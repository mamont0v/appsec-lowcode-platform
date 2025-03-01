"use server";
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { FlowToExecutionPlan } from '@/lib/workflow/execution-plan';
import { CalculateWorkflowCost } from '@/lib/workflow/helpers';
import { WorkflowStatus } from '@/types/workflow';
import { revalidatePath } from 'next/cache'

export default async function PublishWorkflow({
    id,
    flowDefinition
}: {
    id: string;
    flowDefinition: string;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId,
        }
    });

    if (!workflow) {
        throw new Error("Рабочий процесс не найден");
    }

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("workflow is not a draft");
    }

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
        throw new Error("no execution plan generated")
    }

    if (!result.executionPlan) {
        throw new Error("no execution plan generated");
    }


    const creditsCost = CalculateWorkflowCost(flow.nodes);
    await prisma.workflow.update({
        where: {
            id,
            userId,
        },
        data: {
            definition: flowDefinition,
            executionPlan: JSON.stringify(result.executionPlan),
            creditsCost,
            status: WorkflowStatus.PUBLISHED
        }
    })

    revalidatePath(`/app/workflow/editor/${id}`)
}

