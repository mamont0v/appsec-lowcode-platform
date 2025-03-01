import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/page-to-html-task";

export async function PageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean> {
    try {
        const html = await environment.getPage()!.content();

        await environment.setOutput("Html", html)
        return true;
    } catch (error) {
        return false;
    }

}