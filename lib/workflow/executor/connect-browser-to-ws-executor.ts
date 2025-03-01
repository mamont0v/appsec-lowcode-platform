import puppeteer from "puppeteer";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/launch-browser-task";
import { exec } from "child_process";
import { waitFor } from "@/lib/helper/waitFor";


const BROWSER_WS = "wss://name:dns@bts.superproxy.io:9222"
const chromeExecutable = `open -a "Google Chrome"`;

const openDevtools = async (page: any, client: any) => {
    // get current frameId
    const frameId = page.mainFrame()._id;
    // get URL for devtools from scraping browser
    const { url: inspectUrl } = await client.send('Page.inspect', { frameId });
    // open devtools URL in local chrome
    exec(`"${chromeExecutable}" "${inspectUrl}"`, error => {
        if (error)
            throw new Error('Unable to open devtools: ' + error);
    });
    // wait for devtools ui to load
    await waitFor(5000);
};

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Страница в интернете")

        const browser = await puppeteer.connect({
            browserWSEndpoint: BROWSER_WS
        })

        // Use proxy
        // const browser = await puppeteer.launch({
        //     headless: false,
        //     args: ["--proxy=server=brd.test.io:22225"]
        // });

        environment.log.info("Браузер запущен успешно")

        environment.setBrowser(browser);
        const page = await browser.newPage();



        page.setViewport({ width: 1700, height: 720 });
        await page.authenticate({
            username: "name",
            password: "dsadasd"
        });

        const client = await page.createCDPSession();
        await openDevTools(page, client)

        await page.goto(websiteUrl);
        environment.setPage(page);

        environment.log.info("Браузер вернул страницу")

        return true;
    } catch (error: any) {
        environment.log.error("Page not found");
        return false;
    }

}