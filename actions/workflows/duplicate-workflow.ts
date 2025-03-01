"use server";

import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from "@/schemas/workflow";
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";


export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const { success, data } = duplicateWorkflowSchema.safeParse(form);

    if (!success) {
        throw new Error("invalid form data");
    }



    const sourceWorkflow = await prisma.workflow.findUnique({
        where: {
            id: data.workflowId,
            userId
        }
    })

    if (!sourceWorkflow) {
        throw new Error("Workflow not founded");
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            name: data.name,
            description: data.description,
            status: WorkflowStatus.DRAFT,
            definition: sourceWorkflow.definition
        }
    });

    if (!result) {
        throw new Error("Dailed to dublicate workflow")
    }

    revalidatePath("/app/workflows")

    // return result;

}