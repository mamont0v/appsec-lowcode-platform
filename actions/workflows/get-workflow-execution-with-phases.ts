"use server";

import { auth } from "@/auth";
import { prisma } from '@/lib/db';


export async function GetWorkflowExecutionWithPhases({ executionId }: { executionId: string }) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;


    return prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
            userId,
        },
        include: {
            phases: {
                orderBy: {
                    number: 'asc',
                }
            }
        },
    });
}