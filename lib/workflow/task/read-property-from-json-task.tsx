import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileJson2Icon } from "lucide-react";


export const ReadPropertyFromJsonTask = {
    type: TaskType.READ_PROPERTY_FROM_JSON,
    label: "Прочитать JSON",
    icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "JSON",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Имя свойства",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        {
            name: "Значение свойства",
            type: TaskParamType.STRING
        }
    ] as const,
} satisfies WorkflowTask;