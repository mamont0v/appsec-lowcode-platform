"use client";

import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/get-workflow-execution-with-phases';
import { WorkflowExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DatesToDurationString } from '@/lib/helper/dates';
import { GetPhasesTotalCost } from '@/lib/helper/phases';
import { GetWorkflowPhaseDetails } from '@/actions/workflows/get-workflow-phase-details';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '../ui/input';
import { ExecutionLog } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LogLevel } from '@/types/log';
import { cn } from '@/lib/utils';
import PhaseStatusBadge from './phase-status-badge';
import ReactCountUpWrapper from '../react-count-up-wrapper';

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
    initialData
}: {
    initialData: ExecutionData
}) {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

    // update time every second if execution is running
    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases({ executionId: initialData!.id }),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
    });

    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase, query.data?.status],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhase!)
    })

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    useEffect(() => {
        const phases = query.data?.phases || [];

        // Если задача завершена, выбираем последнюю фазу
        if (!isRunning && phases.length > 0 && selectedPhase === null) {
            const latestPhase = phases.toSorted((a, b) =>
                a.completedAt! > b.completedAt! ? -1 : 1
            )[0];
            setSelectedPhase(latestPhase.id);
        }
    }, [query.data?.phases, isRunning, selectedPhase]);




    const duration = DatesToDurationString(
        query.data?.completedAt,
        query.data?.startedAt
    );



    // credits consumed
    const creditConsumed = GetPhasesTotalCost(query.data?.phases || []);




    return (
        <div className="flex w-full h-full">
            <aside className="w-[400px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
                <div className="py-4 px-2">

                    {/* Status */}
                    <ExecutionLabel
                        icon={CircleDashedIcon}
                        label="Статус"
                        value={
                            <div className='font-semibold capitalize flex gap-2 items-center'>
                                <PhaseStatusBadge status={query.data?.status as WorkflowExecutionPhaseStatus}
                                />
                                <span>{query.data?.status}</span>
                            </div>
                        }
                    />
                    <ExecutionLabel
                        icon={CalendarIcon}
                        label="Запущено"
                        value={<span className='lowercase'>
                            {query.data?.startedAt ? formatDistanceToNow(new Date(query.data.startedAt), { addSuffix: true }) : 'N/A'}
                        </span>} />

                    {/* Duration */}
                    <ExecutionLabel
                        icon={ClockIcon}
                        label="Продолжительность"
                        value={duration ? duration : (
                            <Loader2Icon className='animate-spin' size={20} />)} />

                    {/* Credits consume */}
                    <ExecutionLabel
                        icon={CoinsIcon}
                        label="Потрачено монет"
                        value={<ReactCountUpWrapper value={creditConsumed} />} />
                </div>
                <Separator />
                <div className='flex justify-center items-center py-2 px-4'>
                    <div className='text-muted-foreground flex items-center gap-2'>
                        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
                        <span className="font-semibold">
                            Phases
                        </span>
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            key={phase.id}
                            className="w-full justify-between"
                            variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                            size="lg"
                            onClick={() => {
                                if (isRunning) return;
                                if (selectedPhase !== phase.id) { // обновляем только если не выбранная фаза
                                    setSelectedPhase(phase.id);
                                }
                            }
                            }
                        >
                            <div className='flex items-center gap-2'>
                                <Badge variant={"outline"}>
                                    <p className='font-semibold'>{index + 1}</p>
                                </Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                            <PhaseStatusBadge status={phase.status as WorkflowExecutionPhaseStatus} />
                        </Button>
                    ))}
                </div>
            </aside>
            <div className="flex w-full h-full">
                {/* <pre>
                    {JSON.stringify(phaseDetails.data, null, 2)}
                </pre> */}
                {isRunning && (
                    <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                        <p className="font-bold">Задача в работе. Пожалуйста подождите</p>
                    </div>
                )}
                {!isRunning && selectedPhase && phaseDetails.data && (
                    <div className="flex flex-col py-4 container gap-4 overflow-auto">
                        <div className='flex gap-2 items-center'>
                            <Badge variant={'outline'} className='space-x-4 flex justify-between items-center'>
                                <div className='flex gap-1 items-center'>
                                    <CoinsIcon size={18} className='stroke-muted-foreground' />
                                    <span>Кредиты</span>
                                </div>
                                <span>{phaseDetails.data.creditsConsumed}</span>
                            </Badge>

                            <Badge variant={'outline'} className='space-x-4 flex justify-between items-center'>
                                <div className='flex gap-1 items-center'>
                                    <ClockIcon size={18} className='stroke-muted-foreground' />
                                    <span>Продолжительность</span>
                                </div>
                                <span>{DatesToDurationString(
                                    phaseDetails.data.completedAt,
                                    phaseDetails.data.startedAt,
                                ) || "-"}</span>
                            </Badge>
                        </div>

                        <ParameterViewer
                            title="Inputs"
                            subTitle="Inputs used for this phases"
                            paramsJson={phaseDetails.data.inputs}
                        />

                        <ParameterViewer
                            title="Outputs"
                            subTitle="Outputs used for this phases"
                            paramsJson={phaseDetails.data.outputs}
                        />

                        <LogViewer logs={phaseDetails.data.logs} />

                    </div>
                )}
            </div>
        </div>
    )
}

function ExecutionLabel({
    icon,
    label,
    value
}: {
    icon: LucideIcon,
    label: React.ReactNode,
    value: React.ReactNode
}) {
    const Icon = icon;
    return (
        <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
                <Icon size={16} className='stroke-muted-foreground/80' />
                <span>{label}</span>
            </div>
            <div className="font-semibold capitalize flex gap-2 items-center">
                {value}
            </div>
        </div>
    )
}


function ParameterViewer({
    title,
    subTitle,
    paramsJson
}: {
    title: string;
    subTitle: string;
    paramsJson: string | null;
}) {
    const params = paramsJson ? JSON.parse(paramsJson) : undefined;

    return (
        <Card>
            <CardHeader className='rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background'>
                <CardTitle className='text-base'>{title}</CardTitle>
                <CardDescription className='text-muted-foreground text-sm'>
                    {subTitle}
                </CardDescription>
            </CardHeader>
            <CardContent className='py-4'>
                <div className="flex flex-col gap-2">
                    {(!params || Object.keys(params).length === 0) && (
                        <p className="text-sm">Нет информации в этой фазе.</p>
                    )}
                    {params && Object.entries(params).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center space-y-1">
                            <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                                {key}
                            </p>
                            <Input readOnly className="flex-1 basis-2/3" value={value as string} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


function LogViewer({
    logs
}: {
    logs: ExecutionLog[] | undefined
}) {
    if (!logs || logs.length === 0) return <div>Логов нет.</div>;

    return (
        <Card className='w-full'>
            <CardHeader className='rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background'>
                <CardTitle className='text-base'>Логи</CardTitle>
                <CardDescription className='text-muted-foreground text-sm'>
                    Ваши логи для данной фазы выполнения.
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Время</TableHead>
                            <TableHead>Уровень</TableHead>
                            <TableHead>Сообщение</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className='text-muted-foreground'>
                                <TableCell width={180}>
                                    {new Date(log.timestamp).toISOString()}
                                </TableCell>
                                <TableCell width={80}
                                    className={cn("uppercase text-xs font-bold p-[3px] pl-4",
                                        (log.logLevel as LogLevel) === "error" && "text-destructive",
                                        (log.logLevel as LogLevel) === "info" && "text-primary"
                                    )}>{log.logLevel}</TableCell>
                                <TableCell>{log.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card >
    )
}