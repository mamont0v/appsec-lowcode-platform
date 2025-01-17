"use server";

import { auth } from "@/auth";
import { prisma } from '@/lib/db';


export async function GetWorkflowsForUser() {
    const session = await auth();

    // Проверяем наличие сессии и user id
    if (!session || !session.user?.id) {
        throw new Error("Unauthenticated");
    }

    // Извлекаем user id из session
    const userId = session.user.id;

    return prisma.workflow.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    // try {
    //     const workflows = await prisma.workflow.findMany({
    //         where: {
    //             userId: userId,
    //         },
    //         orderBy: {
    //             createdAt: "asc",
    //         },
    //     });
    //     if (!workflows || workflows.length === 0) {
    //         console.warn("No workflows found for userId:", session.user?.id);
    //     } else {
    //         console.log("Fetched workflows:", workflows);
    //     }

    //     return workflows;
    // } catch (error) {
    //     throw new Error("Error fetching workflows.");
    // }
}
