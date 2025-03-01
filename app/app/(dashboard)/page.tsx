import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { GetPeriod } from "@/actions/analytics/get-period";
import PeriodSelector from "@/components/dashboard/period-selector";
import { Period } from "@/types/analytics";
import { GetStatsCardsValue } from "@/actions/analytics/get-stats-cards-value";
import StatsCard from "@/components/dashboard/stats-card";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { waitFor } from "@/lib/helper/waitFor";
import { GetWorkflowExecutionStats } from "@/actions/analytics/get-workflow-execution-stats";
import ExecutionStatusChart from "@/components/dashboard/execution-status-chart";
import { GetCreditsStats } from "@/actions/analytics/get-credits-stats";
import CreditsStatusChart from "@/components/dashboard/credits-status-chart";


type Props = {};

export const metadata = {
    title: "App",
    description: "Ваши сервисы",
};

async function HomePage({
    searchParams,
}: {
    searchParams: {
        month?: string, year?: string
    }
}) {

    const currentDate = new Date();
    const { month, year } = await searchParams;
    const period: Period = {
        month: month ? parseInt(month) : currentDate.getMonth(),
        year: year ? parseInt(year) : currentDate.getFullYear(),
    };

    return (
        <div className="flex flex-1 flex-col h-full">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Главная</h1>
                {/* TODO: skeleton */}
                <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
                    <PeriodSelectorWrapper selectedPeriod={period} />
                </Suspense>
            </div>
            <div className="h-full py-6 flex flex-col gap-4">
                <Suspense fallback={<StatsCardSkeleton />}>
                    <StatsCards selectedPeriod={period} />
                </Suspense>

                <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
                    <StatsExecutionStatus selectedPeriod={period} />
                </Suspense>

                <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
                    <CreditsConsumedStatus selectedPeriod={period} />
                </Suspense>


            </div>

        </div>
    )
}


async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
    const periods = await GetPeriod();
    return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {

    const data = await GetStatsCardsValue(selectedPeriod);
    return (
        <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h[120px] mt-4">
            <StatsCard
                title="Рабочие процессы"
                value={data.workflowExecutions}
                icon={CirclePlayIcon}
            />
            <StatsCard
                title="Этапы рабочих процессов"
                value={data.phasesExecutions}
                icon={WaypointsIcon}
            />
            <StatsCard
                title="Потрачено"
                value={data.creditsConsumed}
                icon={CoinsIcon}
            />
        </div>
    )
}

function StatsCardSkeleton() {
    return (
        <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full min-h-[120px]" />
            ))}
        </div>
    )
}


async function StatsExecutionStatus({
    selectedPeriod
}: {
    selectedPeriod: Period
}) {
    const data = await GetWorkflowExecutionStats(selectedPeriod);
    return <ExecutionStatusChart data={data} />
}

async function CreditsConsumedStatus({
    selectedPeriod
}: {
    selectedPeriod: Period
}) {
    const data = await GetCreditsStats(selectedPeriod);
    return <CreditsStatusChart
        data={data}
        title="Потрачено кредитов"
        description="Ежедневные траты за указанный период"
    />
}



export default HomePage;
