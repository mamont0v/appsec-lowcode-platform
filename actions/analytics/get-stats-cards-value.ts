"use server";

import { prisma } from "@/lib/db";
import { WorkflowExecutionPhaseStatus } from '@/types/workflow';
import { Period } from '../../types/analytics';
import { auth } from '@/auth';
import { PeriodToDateRange } from "@/lib/helper/dates";

const { COMPLETED, FAILED } = WorkflowExecutionPhaseStatus

export async function GetStatsCardsValue(period: Period) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const dateRange = PeriodToDateRange(period);
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status: {
                in: [COMPLETED, FAILED] // TODO: paused crashed and etc.
            },
        },
        select: {
            creditsConsumed: true,
            phases: {
                where: {
                    creditsConsumed: {
                        not: null,
                    },
                },
                select: { creditsConsumed: true }
            },
        },
    });

    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: 0, // TODO: mb remove
        phasesExecutions: 0
    }

    stats.creditsConsumed = executions.reduce((sum, execution) => sum + execution.creditsConsumed, 0);

    stats.phasesExecutions = executions.reduce(
        (sum, execution) => sum + execution.phases.length, 0
    )

    return stats;
}
