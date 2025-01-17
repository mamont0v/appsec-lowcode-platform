"use server";

import { createWorkflowSchema, createWorkflowSchemaType } from "@/schemas/workflow";
import { prisma } from "@/lib/db";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { AppNode } from "@/types/app-node";
import { Edge } from "@xyflow/react";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/create-flow-node";

export async function CreateWorkflow(values: createWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(values);

    if (!success || !data) {
        throw new Error("invalid form data");
    }

    // Проверка на наличие session и session.user?.id
    const session = await auth();

    if (!session || !session.user?.id) {
        throw new Error("unauthenticated");
    }

    const userId = session.user.id;


    // Проверка на существующий workflow
    const existingWorkflow = await prisma.workflow.findUnique({
        where: {
            name_userId: {
                name: data.name,
                userId: userId,
            },
        },
    });

    if (existingWorkflow) {
        throw new Error("Workflow with this name already exists for the user.");
    }

    // @feature: Initial entry point here, LAUNCH_BROWSER
    const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
        nodes: [],
        edges: []
    }
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))


    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialFlow), // Initial point if we want use smth else need delete and use empty "{}"
            ...data, // Используется только при успешной валидации
        },
    });

    if (!result) {
        throw new Error("failed to create workflow");
    }

    return result;
}