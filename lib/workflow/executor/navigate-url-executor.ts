import { ExecutionEnvironment } from "@/types/executor";
import { NavigateUrlTask } from "../task/navigate-url-task";

export async function NavigateUrlExecutor(environment: ExecutionEnvironment<typeof NavigateUrlTask>): Promise<boolean> {

    try {
        const urlInput = await environment.getInput("URL");

        if (!urlInput) {
            environment.log.error("input -> URL not defined");
        }

        await environment.getPage()!.goto(urlInput);
        environment.log.info(`сайт ${urlInput} посещен успешно!`);
        return true;
    } catch (error) {
        return false;
    }

}