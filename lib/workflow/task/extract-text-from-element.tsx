import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps, TextIcon } from "lucide-react";

// Добавить описание в документацию

export const ExtractTextFromElement = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label: "Получить text страницы",
    icon: (props: LucideProps) => (
        <TextIcon className="stroke-pink-400" {...props} />
    ),
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "Html",
            type: TaskParamType.STRING,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true,
            variant: "textarea"
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true
        },
    ] as const,
    outputs: [
        {
            name: "Extracted text",
            type: TaskParamType.STRING
        }
    ] as const,
} satisfies WorkflowTask;