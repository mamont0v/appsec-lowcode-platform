import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, EyeIcon, GlobeIcon, Link2Icon, LucideProps, MousePointerClick, TextIcon } from "lucide-react";

// Добавить описание в документацию

export const NavigateUrlTask = {
    type: TaskType.NAVIGATE_URL,
    label: "Навигация по URL",
    icon: (props) => <Link2Icon className="stroke-orange-400" {...props} />,
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
            name: "URL",
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