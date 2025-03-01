import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/fill-input-task";

export async function FillInputExecutor(environment: ExecutionEnvironment<typeof FillInputTask>): Promise<boolean> {
    try {
        const selector = await environment.getInput("Selector");


        if (!selector) {
            environment.log.error("input -> seelctor not defined")
        }

        const value = await environment.getInput("Value");

        if (!value) {
            environment.log.error("input -> value not defined")
        }
        await environment.getPage()!.type(selector, value);


        // await waitFor(5000);
        return true;
    } catch (error) {
        return false;
    }

}