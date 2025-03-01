import { LaunchBrowserExecutor } from "@/lib/workflow/executor/launch-browser-executor";
import { PageToHtmlExecutor } from "./page-to-html-executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementExecutor } from "./extract-text-from-element-executor";
import { FillInputExecutor } from "./fill-input-executor";
import { ClickElementTask } from "../task/click-element-task";
import { ClickElementExecutor } from "./click-element-executor";
import { WaitForElementExecutor } from "./wait-for-element-executor";
import { DeliverViaWebhookExecutor } from "./deliver-via-webhook-executor";
import { ExtractDataWithAiExecutor } from "./extract-data-with-ai-executor";
import { ReadPropertyFromJsonExecutor } from "./read-property-from-json-executor";
import { AddPropertyToJsonExecutor } from "./add-property-to-json-executor";
import { NavigateUrlExecutor } from "./navigate-url-executor";
import { ScrollPageExecutor } from "./scroll-page-executor";
import { LinterOpenapiExecutor } from "./linter-openapi-executor";
import { UploadOpenApiExecutor } from "./upload-openapi-executor";
import { ReportExecutor } from "./report-executor";

type ExecutorFn<T extends WorkflowTask> = (
    environment: ExecutionEnvironment<T>
) => Promise<boolean>;


type RegistryType = {
    [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
    FILL_INPUT: FillInputExecutor,
    CLICK_ELEMENT: ClickElementExecutor,
    WAIT_FOR_ELEMENT: WaitForElementExecutor,
    DELIVER_WEB_VIA_WEBHOOK: DeliverViaWebhookExecutor,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
    REPORT: ReportExecutor,
    ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
    NAVIGATE_URL: NavigateUrlExecutor,
    SCROLL_PAGE: ScrollPageExecutor,

    LINTER_OPENAPI: LinterOpenapiExecutor,
    UPLOAD_OPENAPI_FILE: UploadOpenApiExecutor    // TODO: Add new tasks here
}