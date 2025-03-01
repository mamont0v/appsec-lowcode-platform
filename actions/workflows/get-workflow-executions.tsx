"use server";

import { auth } from "@/auth";
import { prisma } from '@/lib/db';


async function GetWorkflowExecutions(workflowId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;


    return prisma.workflowExecution.findMany({
        where: {
            workflowId,
            userId,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

}

export default GetWorkflowExecutions;