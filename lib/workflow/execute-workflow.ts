import { prisma } from "@/lib/db";
import "server-only";
import { WorkflowExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";
import { waitFor } from "../helper/waitFor";
import { AppNode } from "@/types/app-node";
import { TaskRegistry } from "./task/registry";
import { ExecutionPhase } from "@prisma/client";
import { TaskParamType, TaskType } from "@/types/task";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from '../../types/log';
import { createLogCollector } from "../log";


export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
    const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
        include: { workflow: true, phases: true },
    });


    if (!execution) {
        throw new Error("Execution not found");
    }


    const edges = JSON.parse(execution.definition).edges as Edge[];

    if (!edges || edges.length === 0) {
        console.error("No edges found in workflow definition");
        return;
    }

    const environment: Environment = { phases: {} };

    await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt);
    await initializePhaseStatuses(execution);

    let creditsConsumed = 0;
    let executionFailed = false;

    for (const phase of execution.phases) {


        const phaseExecution = await executeWorkflowPhase(
            phase,
            environment,
            edges,
            execution.userId
        );

        // Обновляем количество кредитов при выполнении
        creditsConsumed += phaseExecution.creditsConsumed;

        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
    }

    await finalizeWorkflowExecution(
        executionId,
        execution.workflowId,
        executionFailed,
        creditsConsumed
    );

    await cleanupEnvironment(environment);
    // revalidatePath("/workflow/runs/");
}





async function initializeWorkflowExecution(
    executionId: string,
    workflowId: string,
    nextRunAt?: Date
) {
    await prisma.workflowExecution.update({
        where: {
            id: executionId,
        },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING,
        },
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
            ...(nextRunAt && { nextRunAt })
        },
    });
}


async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id),
            },
        },
        data: {
            status: WorkflowExecutionPhaseStatus.PENDING, // другой статус?
        },
    });
}

async function finalizeWorkflowExecution(
    executionId: string,
    workflowId: string,
    executionFailed: boolean,
    creditsConsumed: number
) {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: {
            id: executionId,
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed,
        },
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId,
        },
        data: {
            lastRunStatus: finalStatus,
        },
    }).catch((e) => {

    });
}


async function executeWorkflowPhase(
    phase: ExecutionPhase,
    environment: Environment,
    edges: Edge[],
    userId: string
) {
    const logCollector = createLogCollector();
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;

    setupEnvironmentForPhase(node, environment, edges);

    await prisma.executionPhase.update({
        where: { id: phase.id },
        data: {
            status: WorkflowExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs),
        },
    });

    // Функция кредитов
    // чтобы работало без неё оставить только 
    //  const success =  await executePhase(phase, node, environment, logCollector);

    const creditsRequired = TaskRegistry[node.data.type].credits
    let success = await decrementCredits(userId, creditsRequired, logCollector);
    const creditsConsumed = success ? creditsRequired : 0;
    if (success) {
        success = await executePhase(phase, node, environment, logCollector);
    }

    const outputs = environment.phases[node.id].outputs;

    await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);
    return { success, creditsConsumed };
}

async function finalizePhase(
    phaseId: string,
    success: boolean,
    outputs: any,
    logCollector: LogCollector,
    creditsConsumed: number
) {
    const finalStatus = success ? WorkflowExecutionPhaseStatus.COMPLETED : WorkflowExecutionPhaseStatus.FAILED;

    // Обновляем ExecutionPhase
    await prisma.executionPhase.update({
        where: {
            id: phaseId,
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            outputs: JSON.stringify(outputs),
            creditsConsumed
        },
    });

    // Подготавливаем данные логов
    const logData = logCollector.getAll().map(log => ({
        message: log.message || "",
        timestamp: log.timestamp ? log.timestamp.toISOString() : new Date().toISOString(),
        logLevel: log.level || "info",
        executionPhaseId: phaseId
    }));
    // TODO: createManyLogs
    // Сохраняем логи
    if (logData.length > 0) {
        try {
            await prisma.executionLog.createMany({
                data: logData,
            });
        } catch (error) {
            console.error("Failed to create logs:", error);
            throw error; // или обработайте ошибку по-своему
        }
    } else {
        // console.warn("No valid logs to save.");
    }
}

async function executePhase(
    params: ExecutionPhase,
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
): Promise<boolean> {    // can switch/case using 
    const runFn = ExecutorRegistry[node.data.type]
    if (!runFn) {
        logCollector.error(`not found executor for ${node.data.type}`);
        return false;
    }

    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector)

    return await runFn(executionEnvironment);
}

// Получение аутпутов из блоков
function setupEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
    environment.phases[node.id] = { inputs: {}, outputs: {} };

    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) continue;

        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = String(inputValue);
            continue;
        }

        const connectedEdge = edges.find(
            (edge) => edge.target === node.id && edge.targetHandle === input.name
        );

        if (!connectedEdge) {
            console.error(`Missing input: ${input.name} for node ${node.id}`);
            continue;
        }

        const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
        if (!outputValue) {
            console.error(`Output value not found for edge:`, connectedEdge);
            continue;
        }

        environment.phases[node.id].inputs[input.name] = outputValue;
    }
}


function createExecutionEnvironment(
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
): ExecutionEnvironment<any> {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],

        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => (environment.browser = browser),

        getPage: () => environment.page,
        setPage: (page: Page) => (environment.page = page),

        //
        setOutput: (name: string, value: string) => {
            environment.phases[node.id].outputs[name] = value;
        },

        setOpenApi: (openapiFile: string) => {
            environment.openapiFile = openapiFile;
        },

        getOpenApi: () => environment.openapiFile || "",

        log: logCollector,

    };
}


async function cleanupEnvironment(environment: Environment) {
    // если запущен бразуер то его нужно закрыть
    if (environment.browser) {
        await environment.browser.close().catch((err) => console.error("cannot close browser, reason:", err));
    }
}


async function decrementCredits(userId: string, amount: number, logCollector: LogCollector) {
    try {
        await prisma.userBalance.update({
            where: { userId, credits: { gte: amount } },
            data: { credits: { decrement: amount } }
        });
        return true;
    } catch (error) {

        logCollector.error('Недостаточно очков');
        return false;
    }
}