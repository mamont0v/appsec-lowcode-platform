import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/fill-input-task";
import { ClickElementTask } from "../task/click-element-task";

export async function ClickElementExecutor(environment: ExecutionEnvironment<typeof ClickElementTask>): Promise<boolean> {

    try {
        const selector = await environment.getInput("Selector");

        if (!selector) {
            environment.log.error("input -> Selector not defined")
        }

        await environment.getPage()!.click(selector);

        return true;
    } catch (error) {
        return false;
    }

}