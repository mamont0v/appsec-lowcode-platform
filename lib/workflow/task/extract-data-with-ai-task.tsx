import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon, LucideProps } from "lucide-react";

// Добавить описание в документацию

export const ExtractDataWithAiTask = {
    type: TaskType.EXTRACT_DATA_WITH_AI,
    label: "Анализ данных с помощью AI",
    icon: (props) => <BrainIcon className="stroke-rose-400" {...props} />,
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "Content",
            type: TaskParamType.STRING,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true,
        },
        {
            name: "Credentials",
            type: TaskParamType.CREDENTIALS,
            required: false,
            hideHandle: true,
        },
        {
            name: "Prompt",
            type: TaskParamType.STRING,
            required: true,
            variant: "textarea",
            hideHandle: true,
        },
    ] as const,
    outputs: [
        {
            name: "Extracted data",
            type: TaskParamType.STRING,

        }
    ] as const,
} satisfies WorkflowTask;