import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/wait-for-element-task";

export async function WaitForElementExecutor(environment: ExecutionEnvironment<typeof WaitForElementTask>): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");

        if (!selector) {
            environment.log.error("input -> selector not defined")
        }

        const visibility = await environment.getInput("Visibility");

        if (!visibility) {
            environment.log.error("input -> selector not defined")
        }

        // без этой проверки не работает
        if (visibility === "hidden") {
            const isElementPresent = await environment.getPage()!.evaluate(
                (selector) => !!document.querySelector(selector),
                selector
            );
            if (!isElementPresent) {
                environment.log.info(`Элемент ${selector} уже скрыт`);
                return true;
            }
        }


        await environment.getPage()!.waitForSelector(selector, {
            visible: visibility === "visible",
            hidden: visibility === "hidden"
        });

        environment.log.info(`Элемент ${selector} стал ${visibility}`)

        return true;
    } catch (error) {
        environment.log.error(`Ошибка при ожидании элемента: ${error}`);

        return false;
    }

}