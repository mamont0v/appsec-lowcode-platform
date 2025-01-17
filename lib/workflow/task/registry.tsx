import { LaunchBrowserTask } from "@/lib/workflow/task/launch-browser";
import { PageToHtmlTask } from "@/lib/workflow/task/page-to-html";
import { ExtractTextFromElement } from "@/lib/workflow/task/extract-text-from-element";
import { WorkflowTask } from "@/types/workflow";
import { TaskType } from "@/types/task";

type Registry = {
    // satisfies WorkflowTask требуется добавить в конец каждого файла чтобы проверить что registry соответствует элементу
    [K in TaskType]: WorkflowTask & { type: K };
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement
    // VACUUM
    // SJ
}



