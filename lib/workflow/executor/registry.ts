import { LaunchBrowserExecutor } from "@/lib/workflow/executor/launch-browser-executor";
import { PageToHtmlExecutor } from "./page-to-html-executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ExecutionEnvironment } from "@/types/executor";

type ExecutorFn<T extends WorkflowTask> = (
    environment: ExecutionEnvironment<T>
) => Promise<boolean>;


type RegistryType = {
    [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT: () => Promise.resolve(true),
}