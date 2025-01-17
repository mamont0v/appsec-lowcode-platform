import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/launch-browser";

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Страница в интернете")
        const browser = await puppeteer.launch({
            headless: false
        })
        environment.setBrowser(browser);
        const page = await browser.newPage();
        await page.goto(websiteUrl)
        return true;
    } catch (error) {
        return false;
    }

}