import { WorkflowExecutionPhaseStatus } from '@/types/workflow';
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, Loader2Icon } from 'lucide-react';
import React from 'react';

export default function PhaseStatusBadge({ status }: { status: WorkflowExecutionPhaseStatus }) {
    switch (status) {
        case WorkflowExecutionPhaseStatus.PENDING:
            return <CircleDashedIcon size={20} className="stroke-muted-foreground" />;
        case WorkflowExecutionPhaseStatus.RUNNING:
            return <Loader2Icon size={20} className="animate-spin stroke-yellow-500" />;
        case WorkflowExecutionPhaseStatus.COMPLETED:
            return <CircleCheckIcon size={20} className="stroke-green-500" />;
        case WorkflowExecutionPhaseStatus.FAILED:
            return <CircleXIcon size={20} className="stroke-destructive" />;
        default:
            return <div className="rounded-full">{status}</div>;
    }
}
