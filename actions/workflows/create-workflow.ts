"use server";

import { createWorkflowSchema, createWorkflowSchemaType } from "@/schemas/workflow";
import { prisma } from "@/lib/db";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { AppNode } from "@/types/app-node";
import { Edge } from "@xyflow/react";
import { TaskType } from "@/types/task";
import { CreateFlowNode } from "@/lib/workflow/create-flow-node";
import { revalidatePath } from "next/cache";

export async function CreateWorkflow(values: createWorkflowSchemaType) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const { success, data } = createWorkflowSchema.safeParse(values);

    if (!success || !data) {
        throw new Error("invalid form data");
    }
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
    // TODO: Обязательный запуск браузера    
    // initialFlow.nodes.push(CreateFlowNode(TaskType.UPLOAD_OPENAPI_FILE))


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

    // TODO: Нужен ли тут ререндер?
    revalidatePath("/app/workflows");

    return result;
}