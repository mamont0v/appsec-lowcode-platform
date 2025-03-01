"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Period } from "@/types/analytics";

export async function GetPeriod() {
    const session = await auth();

    if (!session) {
        throw new Error("unauthenticated");
    }

    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("canot find user id");
    }

    const years = await prisma.workflowExecution.aggregate({
        where: { userId },
        _min: { startedAt: true }
    });

    const currentYear = new Date().getFullYear();

    const minYear = years._min.startedAt ? years._min.startedAt.getFullYear() : currentYear;

    const period: Period[] = [];

    for (let year = minYear; year <= currentYear; year++) {
        for (let month = 0; month <= 11; month++) {
            period.push({ year, month })
        }
    }
    return period;
}