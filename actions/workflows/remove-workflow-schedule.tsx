"use server";
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { WorkflowStatus } from '@/types/workflow';
import { revalidatePath } from 'next/cache'

export default async function RemoveWorkflowSchedule(id: string) {
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

    if (workflow.status !== WorkflowStatus.PUBLISHED) {
        throw new Error("workflow is not a draft");
    }

    await prisma.workflow.update({
        where: { id, userId },
        data: {
            cron: null,
            nextRunAt: null
        }
    });

    revalidatePath("/app/workflows");
}