"use client";

import React, { useState } from 'react';
import { Workflow, WorkflowExecution } from "@prisma/client";
import { Card, CardContent } from '@/components/ui/card';
import { WorkflowExecutionStatus, WorkflowStatus } from '@/types/workflow';
import { ChevronRight, ChevronRightIcon, ClockIcon, CoinsIcon, CornerDownRightIcon, FileTextIcon, MoreVerticalIcon, MoveRightIcon, PlayIcon, ShuffleIcon, TrashIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TooltipWrapper from '@/components/workflows/tooltip-wrapper';
import DeleteWorkflowDialog from '@/components/workflows/delete-workflow-dialog';
import RunButton from '@/components/workflows/run-button';
import SchedulerDialog from './scheduler-dialog';
import { Badge } from '../ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import ExecutionStatusIndicator, { ExecutionStatusLabel } from '../runs/execution-status-indicator';
import { formatInTimeZone } from "date-fns-tz";
import { DuplicateWorkflow } from '@/actions/workflows/duplicate-workflow';
import DublicateWorkflowDialog from './update-workflow-dialog';

const statusCode = {
    [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
    [WorkflowStatus.PUBLISHED]: "bg-primary",
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;

    return (
        <Card className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-sm dark:shadow-primary/30 group/card'>
            <CardContent className='p-4 flex items-center justify-between h-[100px]'>
                <div className='flex items-center justify-end space-x-3'>
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", statusCode[workflow.status as WorkflowStatus])}>
                        {isDraft ? (<FileTextIcon className="h-5 w-5" />) : (
                            <PlayIcon className="h-5 w-5 text-white" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-black text-muted-foreground flex items-center">
                            <TooltipWrapper content={workflow.description}>
                                <Link href={`/app/workflow/editor/${workflow.id}`} className='flex items-center  hover:underline'>
                                    {workflow.name}
                                </Link>
                            </TooltipWrapper>
                            {isDraft && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Draft
                                </span>
                            )}
                            <DublicateWorkflowDialog workflowId={workflow.id} />
                        </h3>
                        <ScheduleSection
                            isDraft={isDraft}
                            creditsCost={workflow.creditsCost}
                            workflowId={workflow.id}
                            cron={workflow.cron}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!isDraft && <RunButton workflowId={workflow.id} />}
                    <Link href={`/app/workflow/editor/${workflow.id}`} className={cn(
                        buttonVariants({
                            variant: "outline",
                            size: "sm"
                        }),
                        "flex items-center  hover:underline"
                    )}>
                        <ShuffleIcon size={16} />
                        Edit
                    </Link>
                    <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
                </div>
            </CardContent>
            <LastRunDetails workflow={workflow} />
        </Card>
    )
}


function WorkflowActions({ workflowName, workflowId }: { workflowId: string, workflowName: string }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteWorkflowDialog
                open={showDeleteDialog}
                setOpen={setShowDeleteDialog}
                workflowName={workflowName}
                workflowId={workflowId}

            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={'sm'}>
                        <TooltipWrapper content={"Действия"}>
                            <div className="flex items-center justify-center w-full h-full">
                                <MoreVerticalIcon size={18} />
                            </div>
                        </TooltipWrapper>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Действия</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive flex items-center gap-2"
                        onSelect={() => {
                            setShowDeleteDialog((prev) => !prev)
                        }}
                    >
                        <TrashIcon size={16} />
                        Удалить 💀
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}


function ScheduleSection({
    isDraft,
    creditsCost,
    workflowId,
    cron
}: {
    isDraft: boolean,
    creditsCost: number,
    workflowId: string,
    cron: string | null
}) {
    if (isDraft) return null;

    return (
        <div className="flex items-center gap-2">
            <CornerDownRightIcon className='h-4 w-4 text-muted-foreground' />
            <SchedulerDialog workflowId={workflowId} cron={cron} key={`${cron}-${workflowId}`} />
            <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
            <TooltipWrapper content="Credit">
                <div className="flex items-center gap-3">
                    <Badge variant={"outline"}
                        className="space-x-2 text-muted-foreground rounded-sm">
                        <CoinsIcon className='h-4 w-4' />
                        <span className="text-sm">
                            {creditsCost}
                        </span>
                    </Badge>
                </div>
            </TooltipWrapper>

        </div>
    )
}


function LastRunDetails({ workflow }: { workflow: Workflow }) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;
    if (isDraft) {
        return null;
    }

    const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
    const formattedStartedAt = lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

    const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");

    const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");



    return (
        <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
            <div className="flex items-center text-sm gap-2">
                {lastRunAt && (
                    <Link href={`/app/workflow/runs/${workflow.id}/${lastRunId}`} className='flex items-center text-sm gap-2 group'>
                        <span>Последний запуск:</span>

                        <ExecutionStatusIndicator status={lastRunStatus as WorkflowExecutionStatus} />
                        <ExecutionStatusLabel status={lastRunStatus as WorkflowExecutionStatus} />
                        {/* <span>{lastRunStatus}</span> */}
                        <span>{formattedStartedAt}</span>
                        <ChevronRightIcon size={14} className='-translate-x-[2px] group-hover:translate-x-0 transition' />
                    </Link>
                )}
                {!lastRunAt && <div className=''>Нет истории</div>}
            </div>
            {nextRunAt && (
                <div className='flex items-center text-sm gap-2'>
                    <ClockIcon size={12} />
                    <span>Следующий запуск:</span>
                    <span>{nextSchedule}</span>
                    <span className='text-xs'>({nextScheduleUTC} UTC)</span>
                </div>
            )}
        </div>
    )
}

export default WorkflowCard;