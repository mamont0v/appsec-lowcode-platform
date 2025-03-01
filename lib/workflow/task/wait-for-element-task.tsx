import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, EyeIcon, GlobeIcon, LucideProps, MousePointerClick, TextIcon } from "lucide-react";

// Добавить описание в документацию

export const WaitForElementTask = {
    type: TaskType.WAIT_FOR_ELEMENT,
    label: "Найти элемент на странице",
    icon: (props) => <EyeIcon className="stroke-amber-400" {...props} />,
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE,
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
        {
            name: "Visibility",
            type: TaskParamType.SELECT,
            // helperText: "eg: https://google.com/",
            required: true,
            options: [
                { label: "Visible", value: "visible" },
                { label: "Hidden", value: "hidden" },
            ],
            hideHandle: true
        },
    ] as const,
    outputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
} satisfies WorkflowTask;