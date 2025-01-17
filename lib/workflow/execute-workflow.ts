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

export async function ExecuteWorkflow(executionId: string) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
        },
        include: { workflow: true, phases: true },
    });

    if (!execution) {
        throw new Error("Execution not found");
    }

    // run phases 
    const environment: Environment = { phases: {} }

    await initializeWorkflowExecution(executionId, execution.workflowId);
    await initializePhaseStatuses(execution);

    let creditsConsumed = 0;
    let executionFailed = false;
    for (const phase of execution.phases) {
        const phasesExecution = await executeWorkflowPhase(phase, environment);
        if (!phasesExecution.success) {
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

    // revalidatePath("/workflow/runs/");
}





async function initializeWorkflowExecution(
    executionId: string,
    workflowId: string
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
            lastRunId: executionId
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


async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment) {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;

    setupEnvironmentForPhase(node, environment);

    await prisma.executionPhase.update({
        where: {
            id: phase.id,
        },
        data: {
            status: WorkflowExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs)
        },
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;
    const success = await executePhase(phase, node, environment);

    await finalizePhase(phase.id, success);
    return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
    const finalStatus = success ? WorkflowExecutionPhaseStatus.COMPLETED : WorkflowExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: {
            id: phaseId,
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
        },
    });
}

async function executePhase(
    params: ExecutionPhase,
    node: AppNode,
    environment: Environment
): Promise<boolean> {
    // can switch/case using 
    const runFn = ExecutorRegistry[node.data.type]
    if (!runFn) {
        return false;
    }
    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment)

    return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment) {
    environment.phases[node.id] = { inputs: {}, outputs: {} }
    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) continue; // change to OpenAPI vacuum
        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        // TODO
    }
}


function createExecutionEnvironment(node: AppNode, environment: Environment): ExecutionEnvironment<any> {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],

        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => (environment.browser = browser),

        getPage: () => environment.page,
        setPage: (page: Page) => (environment.page = page)
    };
}