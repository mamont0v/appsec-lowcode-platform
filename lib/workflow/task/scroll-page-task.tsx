import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpIcon, CodeIcon, EyeIcon, GlobeIcon, LucideProps, MousePointerClick, TextIcon } from "lucide-react";

// Добавить описание в документацию

export const ScrollPageTask = {
    type: TaskType.SCROLL_PAGE,
    label: "Scroll веб-страницы",
    icon: (props) => <ArrowUpIcon className="stroke-orange-400" {...props} />,
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
    ] as const,
    outputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
} satisfies WorkflowTask;