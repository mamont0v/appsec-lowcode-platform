import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/launch-browser-task";

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Страница в интернете")
        const browser = await puppeteer.launch({
            headless: false
        });
        environment.log.info("Браузер запущен успешно")
        environment.setBrowser(browser);
        const page = await browser.newPage();
        await page.goto(websiteUrl);
        environment.setPage(page);

        environment.log.info("Браузер вернул страницу")

        return true;
    } catch (error: any) {
        environment.log.error("Page not found");
        return false;
    }

}