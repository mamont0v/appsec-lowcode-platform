"use server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export default async function GetReportExecutions(reportId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    // Получаем отчет по ID и userId
    return await prisma.report.findUnique({
        where: {
            id: reportId,
            userId  // Используем id вместо reportId
        },
    });

}
