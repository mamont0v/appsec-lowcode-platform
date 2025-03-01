"use server";

import { auth } from "@/auth";
import { PeriodToDateRange } from "@/lib/helper/dates";
import { Period } from "@/types/analytics";
import { prisma } from "@/lib/db";
import { eachDayOfInterval, format } from "date-fns";
import { WorkflowExecutionPhaseStatus } from "@/types/workflow";


type Stats = Record<
    string, {
        success: number;
        failed: number
    }>

const { COMPLETED, FAILED } = WorkflowExecutionPhaseStatus

export async function GetCreditsStats(period: Period) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const dateRange = PeriodToDateRange(period);
    const executionPhases = await prisma.executionPhase.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status: {
                in: [COMPLETED, FAILED]
            }
        },
    });

    const dateFormat = "yyyy-MM-dd";

    const stats: Stats = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate,
    }).map((date) => format(date, dateFormat))
        .reduce((acc, date) => {
            acc[date] = {
                success: 0,
                failed: 0,
            };
            return acc;
        }, {} as any);




    executionPhases.forEach((executionPhase) => {
        const date = format(executionPhase.startedAt!, dateFormat);

        if (executionPhase.status === COMPLETED) {
            stats[date].success += executionPhase.creditsConsumed || 0;
        }

        if (executionPhase.status === FAILED) {
            stats[date].failed += executionPhase.creditsConsumed || 0;

        }
    })

    const result = Object.entries(stats).map(([date, infos]) => ({
        date,
        ...infos
    }));

    return result;
}
