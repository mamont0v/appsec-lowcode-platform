import { LaunchBrowserTask } from "@/lib/workflow/task/launch-browser-task";
import { PageToHtmlTask } from "@/lib/workflow/task/page-to-html-task";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/extract-text-from-element-task";
import { WorkflowTask } from "@/types/workflow";
import { TaskType } from "@/types/task";
import { UploadOpenApiTask } from "./upload-openapi-file-task";
import { FillInputTask } from "./fill-input-task";
import { ClickElementTask } from "./click-element-task";
import { WaitForElementTask } from "./wait-for-element-task";
import { DeliverViaWebhookTask } from "./deliver-via-webhook-task";
import { ExtractDataWithAiTask } from "./extract-data-with-ai-task";
import { ReadPropertyFromJsonTask } from "./read-property-from-json-task";
import { AddPropertyToJsonTask } from "./add-property-to-json-task";
import { NavigateUrlTask } from "./navigate-url-task";
import { ScrollPageTask } from "./scroll-page-task";
import { LinterOpenApiTask } from "./linter-openapi-task";
import { ReportTask } from "./report-task";

type Registry = {
    // satisfies WorkflowTask требуется добавить в конец каждого файла чтобы проверить что registry соответствует элементу
    [K in TaskType]: WorkflowTask & { type: K };
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
    CLICK_ELEMENT: ClickElementTask,
    WAIT_FOR_ELEMENT: WaitForElementTask,
    DELIVER_WEB_VIA_WEBHOOK: DeliverViaWebhookTask,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAiTask,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
    ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
    NAVIGATE_URL: NavigateUrlTask,
    SCROLL_PAGE: ScrollPageTask,

    REPORT: ReportTask,
    UPLOAD_OPENAPI_FILE: UploadOpenApiTask,
    LINTER_OPENAPI: LinterOpenApiTask,    // DELAY
    // VACUUM
    // SJ
}



