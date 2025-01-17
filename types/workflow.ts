import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "./task";
import { AppNode } from "./app-node";

export enum WorkflowStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED"
}

// type for Wokflow Badged
export type WorkflowTask = {
    label: string;
    icon: React.FC<LucideProps>;
    type: TaskType;
    isEntryPoint?: boolean;
    inputs: TaskParam[];
    outputs: TaskParam[];
    credits: number;
}

export type WorkflowExecutionPlanPhase = {
    phase: number;
    nodes: AppNode[]; // can execute 2 and more Nodes in parallel
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum WorkflowExecutionStatus {
    CREATED = "CREATED",
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    SUCCESS = "SUCCESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELED = "CANCELED",
}

export enum WorkflowExecutionPhaseStatus {
    COMPLETED = "COMPLETED",
    CREATED = "CREATED",
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELED = "CANCELED",
}

export enum WorkflowExecutionPhaseTrigger {
    MANUAL = "MANUAL",
    AUTOMATIC = "AUTOMATIC",
}