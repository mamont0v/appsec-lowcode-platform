import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, Edit3Icon, GlobeIcon, LucideProps } from "lucide-react";

// Добавить описание в документацию

export const FillInputTask = {
    type: TaskType.FILL_INPUT,
    label: "Заполнить input",
    icon: (props) => <Edit3Icon className="stroke-orange-400" {...props} />,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true
        },
        {
            name: "Value",
            type: TaskParamType.STRING,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true
        },
    ] as const,
    outputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
} satisfies WorkflowTask;