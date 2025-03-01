import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { SendIcon } from "lucide-react";

// Добавить описание в документацию

export const DeliverViaWebhookTask = {
    type: TaskType.DELIVER_WEB_VIA_WEBHOOK,
    label: "Deliver via Webhook",
    icon: (props) => <SendIcon className="stroke-blue-400" {...props} />,
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "Target URL",
            type: TaskParamType.STRING,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true,
            // variant: "textarea"
        },
        {
            name: "Body",
            type: TaskParamType.STRING,
            // helperText: "eg: https://google.com/",
            required: true,
            // hideHandle: true
        },
    ] as const,
    outputs: [] as const,
} satisfies WorkflowTask;