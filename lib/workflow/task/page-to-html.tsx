import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

// Добавить описание в документацию

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: "Получить HTML страницы",
    icon: (props: LucideProps) => (
        <CodeIcon className="stroke-pink-400" {...props} />
    ),
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true
        },
    ] as const,
    outputs: [
        {
            name: "Html",
            type: TaskParamType.STRING
        },
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
} satisfies WorkflowTask;