"use server";

import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function GetWorkflowPhaseDetails(phaseId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    return prisma.executionPhase.findUnique({
        where: {
            id: phaseId,
            execution: {
                userId
            },
        },
        include: {
            logs: {
                orderBy: {
                    timestamp: "asc"
                }
            }
        }
    });
}