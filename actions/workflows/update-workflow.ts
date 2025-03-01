"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({
    id, definition
}: {
    id: string, definition: string
}) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    if (!userId) {
        throw new Error("unathenticated");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    });

    if (!workflow) {
        throw new Error("Not workflow found");
    }
    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("workflow is not a draft")
    }

    await prisma.workflow.update({
        data: {
            definition,
        },
        where: {
            id,
            userId
        }
    })

    revalidatePath("/app/workflows")
}