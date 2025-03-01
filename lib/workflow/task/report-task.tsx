import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FileJson2Icon } from "lucide-react";


export const ReportTask = {
    type: TaskType.REPORT,
    label: "Создание отчета",
    icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "Результаты линтера",
            type: TaskParamType.STRING,
            required: false,
        },
        {
            name: "Результаты AI",
            type: TaskParamType.STRING,
            required: false,
        },
        // {
        //     name: "Результаты Unprotected API",
        //     type: TaskParamType.STRING,
        //     required: false,
        // },
    ] as const,
    outputs: [
        {
            name: "Отчет",
            type: TaskParamType.STRING
        }
    ] as const,
} satisfies WorkflowTask;