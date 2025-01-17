"use server";

import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function GetWorkflowPhaseDetails(phaseId: string) {
    const session = await auth();

    // Проверяем наличие сессии и user id
    if (!session || !session.user?.id) {
        throw new Error("Unauthenticated");
    }

    // Извлекаем user id из session
    const userId = session.user.id;

    return prisma.executionPhase.findUnique({
        where: {
            id: phaseId,
            execution: {
                userId
            }
        }
    });
}