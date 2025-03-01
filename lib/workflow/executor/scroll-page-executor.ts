import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/fill-input-task";
import { ClickElementTask } from "../task/click-element-task";
import { ScrollPageTask } from "../task/scroll-page-task";

export async function ScrollPageExecutor(environment: ExecutionEnvironment<typeof ScrollPageTask>): Promise<boolean> {

    try {
        const selector = await environment.getInput("Selector");

        if (!selector) {
            environment.log.error("input -> Selector not defined")
        }

        await environment.getPage()!.evaluate((selector: string) => {
            const element = document.querySelector(selector);

            if (!element) {
                throw new Error("element not found");
            }

            const top = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top });
        }, selector);



        return true;
    } catch (error) {
        return false;
    }

}