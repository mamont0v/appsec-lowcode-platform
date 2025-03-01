import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, NotepadTextDashed } from "lucide-react";

export const LinterOpenApiTask = {
    type: TaskType.LINTER_OPENAPI,
    label: "Линтер OpenAPI",
    icon: (props: LucideProps) => (
        <NotepadTextDashed className="stroke-purple-700" {...props} />
    ),
    isEntryPoint: false,
    credits: 5,
    inputs: [
        {
            name: "OpenAPI",
            type: TaskParamType.STRING_OPENAPI,
            description: "Спецификация в формате JSON"
        },
    ] as const,
    outputs: [
        {
            name: "Отчет сканирования линтером",
            type: TaskParamType.STRING,
            description: "Спецификация OPENAPI"
        },
        // {
        //     name: "OpenAPI",
        //     type: TaskParamType.STRING_OPENAPI,
        //     description: "Спецификация в формате JSON"
        // },
    ] as const,
    // runFn: 
} satisfies WorkflowTask;


