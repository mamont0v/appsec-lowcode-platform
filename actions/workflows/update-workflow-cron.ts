"use server";
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import parser from "cron-parser";


async function UpdateWorkflowCron({
    id,
    cron
}: {
    id: string;
    cron: string;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    try {
        const interval = parser.parseExpression(cron, { utc: true });
        await prisma.workflow.update({
            where: {
                id, userId
            },
            data: {
                cron,
                nextRunAt: interval.next().toDate()
            }
        });
    } catch (error) {
        throw new Error("Invalid cron expression");
    }

    revalidatePath("/app/workflows");

}

export default UpdateWorkflowCron;