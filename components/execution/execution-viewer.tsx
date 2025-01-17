"use client";

import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/get-workflow-execution-with-phases';
import { WorkflowExecutionStatus } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DatesToDurationString } from '@/lib/helper/dates';
import { GetPhasesTotalCost } from '@/lib/helper/phases';
import { GetWorkflowPhaseDetails } from '@/actions/workflows/get-workflow-phase-details';

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

function ExecutionViewer({
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
    const duration = DatesToDurationString(
        query.data?.completedAt,
        query.data?.startedAt
    );

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    // credits consumed
    const creditConsumed = GetPhasesTotalCost(query.data?.phases || []);

    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhase!)
    })


    return (
        <div className="flex w-full h-full">
            <aside className="w-[400px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
                <div className="py-4 px-2">

                    {/* Status */}
                    <ExecutionLabel
                        icon={CircleDashedIcon}
                        label="Status"
                        value={query.data?.status} />

                    {/* Started */}
                    <ExecutionLabel
                        icon={CalendarIcon}
                        label="Started at"
                        value={<span className='lowercase'>
                            {query.data?.startedAt ? formatDistanceToNow(new Date(query.data.startedAt), { addSuffix: true }) : 'N/A'}
                        </span>} />

                    {/* Duration */}
                    <ExecutionLabel
                        icon={ClockIcon}
                        label="Duration"
                        value={duration ? duration : (
                            <Loader2Icon className='animate-spin' size={20} />)} />

                    {/* Credits consume */}
                    <ExecutionLabel
                        icon={CoinsIcon}
                        label="Credits consumed"
                        value={creditConsumed} />
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
                                setSelectedPhase(phase.id)
                            }
                            }
                        >
                            <div className='flex items-center gap-2'>
                                <Badge variant={"outline"}>
                                    <p className='font-semibold'>{index + 1}</p>
                                </Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {phase.status}
                            </p>
                        </Button>
                    ))}
                </div>
            </aside>
            <div className="flex w-full h-full">
                <pre>
                    {JSON.stringify(phaseDetails.data, null, 2)}
                </pre>
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

export default ExecutionViewer;