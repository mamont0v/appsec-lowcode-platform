import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon } from "lucide-react";


export const AddPropertyToJsonTask = {
    type: TaskType.ADD_PROPERTY_TO_JSON,
    label: "Добавить JSON",
    icon: (props) => <DatabaseIcon className="stroke-orange-400" {...props} />,
    isEntryPoint: false,
    credits: 1,
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
        {
            name: "Значение свойства",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        {
            name: "Обновленный JSON",
            type: TaskParamType.STRING
        }
    ] as const,
} satisfies WorkflowTask;