import { ExecutionEnvironment } from "@/types/executor";
import * as cheerio from 'cheerio';
import { ExtractTextFromElementTask } from "../task/extract-text-from-element-task";

export async function ExtractTextFromElementExecutor(environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>): Promise<boolean> {
    try {
        // получаем данные из output
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("selector is not provided");
            return false;
        }


        const html = environment.getInput("Html");
        if (!html) {
            environment.log.error("Html not defined");
            return false;
        }

        const $ = cheerio.load(html);
        const element = $(selector);

        if (!element) {
            environment.log.error("element not found");
            return false;
        }

        const extractedText = $.text(element);

        if (!extractedText) {
            environment.log.error("extractedText not found");
            return false;
        }
        // Что мы отдаем дальше по потоку
        environment.setOutput("Extracted text", extractedText);
        return true;
    } catch (error) {
        return false;
    }

}