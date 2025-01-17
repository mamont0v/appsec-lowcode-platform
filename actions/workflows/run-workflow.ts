"use server";

import { auth } from "@/auth";
import { prisma } from '@/lib/db';
import { ExecuteWorkflow } from "@/lib/workflow/execute-workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { WorkflowExecutionPhaseTrigger, WorkflowExecutionPlan, WorkflowExecutionStatus } from "@/types/workflow";



export async function RunWorkflow(form: {
    workflowId: string;
    flowDefinition?: string;
}) {
    const session = await auth();

    // Проверяем наличие сессии и user id
    if (!session || !session.user?.id) {
        throw new Error("Unauthenticated");
    }

    // Извлекаем user id из session
    const userId = session.user.id;

    const { workflowId, flowDefinition } = form;
    if (!workflowId) {
        throw new Error("Missing workflowId");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId,
        },
    });

    if (!workflow) {
        throw new Error("Workflow not found");
    }

    let executionPlan: WorkflowExecutionPlan;
    if (!flowDefinition) {
        throw new Error("Missing flowDefinition");
    }

    const flow = JSON.parse(flowDefinition);

    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
        throw new Error("flow definition not valid");
    }

    if (!result.executionPlan) {
        throw new Error("flow definition not valid");
    }

    executionPlan = result.executionPlan;
    console.log(executionPlan);

    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionPhaseTrigger.MANUAL,
            phases: {
                create: executionPlan.flatMap((phase, index) => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: WorkflowExecutionStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        };
                    });
                }),
            },
        },
        select: {
            id: true,
            phases: true
        }
    });

    if (!execution) {
        throw new Error("Failed to create execution");
    }

    // work this on background
    ExecuteWorkflow(execution.id);

    return execution;
    // redirect(`/workflows/${workflowId}/executions/${execution.id}`);
    // redirect(`/workflow/runs/${workflowId}/${execution.id}`);

}