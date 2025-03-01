import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Запустить браузер",
    icon: (props: LucideProps) => (
        <GlobeIcon className="stroke-pink-400" {...props} />
    ),
    isEntryPoint: false, // true ?
    credits: 5,
    inputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.STRING,
            helperText: "eg: https://google.com/",
            required: true,
            hideHandle: true
        },
    ] as const,
    outputs: [
        {
            name: "Страница в интернете",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
    // runFn: 
} satisfies WorkflowTask;