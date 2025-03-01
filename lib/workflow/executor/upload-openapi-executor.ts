import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/launch-browser-task";
import { UploadOpenApiTask } from "../task/upload-openapi-file-task";
// Переделать лаунч браузер
export async function UploadOpenApiExecutor(environment: ExecutionEnvironment<typeof UploadOpenApiTask>): Promise<boolean> {
    try {

        const openApiFile = await environment.getInput("OpenAPI");

        if (!openApiFile) {
            console.error("Ошибка: OpenAPI файл не найден");
            return false;
        }

        await environment.setOutput("OpenAPI", openApiFile);
        return true;
    } catch (error) {
        return false;
    }
}