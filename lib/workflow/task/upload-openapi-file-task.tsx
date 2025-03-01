import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { File, GlobeIcon, LucideProps } from "lucide-react";

export const UploadOpenApiTask = {
    type: TaskType.UPLOAD_OPENAPI_FILE,
    label: "Загрузить OpenAPI файл",
    icon: (props: LucideProps) => (
        <File className="stroke-green-400" {...props} />
    ),
    isEntryPoint: false, // 
    credits: 5,
    inputs: [
        {
            name: "OpenAPI",
            type: TaskParamType.OPENAPI,
            helperText: "Загрузите ваш OpenAPI файл",
            required: true,
            hideHandle: true,
            variant: "file"
        },
    ] as const,
    outputs: [
        {
            name: "OpenAPI",
            type: TaskParamType.STRING_OPENAPI,
            description: "OpenAPI"
        }
    ] as const,
    // runFn: 
} satisfies WorkflowTask;


