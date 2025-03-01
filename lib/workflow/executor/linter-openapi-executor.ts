import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { LinterOpenApiTask } from "../task/linter-openapi-task";
import * as fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { Buffer } from "buffer";
import parseJson, { JSONError } from 'parse-json';
import { v4 as uuidv4 } from "uuid";
import { getAppUrl } from "@/lib/helper/appUrl";

export async function LinterOpenapiExecutor(environment: ExecutionEnvironment<typeof LinterOpenApiTask>): Promise<boolean> {
    try {
        const openApiFile = await environment.getInput("OpenAPI");

        if (!openApiFile) {
            console.error("Ошибка: OpenAPI файл не найден");
            return false;
        }

        const jsonObject = JSON.parse(openApiFile);
        const jsonBuffer = Buffer.from(JSON.stringify(jsonObject), "utf-8");

        // Создаем taskId заранее
        const taskId = uuidv4();

        const formData = new FormData();
        formData.append("file", jsonBuffer, { filename: "openapi.json", contentType: "application/json" });
        formData.append("taskId", taskId);

        const uploadUrl = getAppUrl("api/upload");
        // console.log("@uploadUrl", uploadUrl)
        const response = await axios.post(uploadUrl, formData, {
            headers: { ...formData.getHeaders() },
        });


        // Ожидание завершения задачи
        const report = await waitForReport(taskId);
        if (!report) {
            console.error("Ошибка: отчет не был сгенерирован.");
            return false;
        }


        const linterResults = JSON.stringify(report)

        await environment.setOutput("Отчет сканирования линтером", linterResults);
        await environment.setOutput("OpenAPI", openApiFile)
        return true;
    } catch (error) {

        console.error("Ошибка при загрузке файла executor:", error);
        return false;
    }
}

// Функция ожидания результата
async function waitForReport(taskId: string, maxRetries = 10, delayMs = 5000): Promise<any | null> {
    for (let i = 0; i < maxRetries; i++) {
        // console.log(`Проверка статуса задачи: ${taskId}, попытка ${i + 1}/${maxRetries}`);

        try {
            // TODO: поменять URL
            const uploadUrl = getAppUrl(`api/upload/${taskId}`);
            const response = await axios.get(uploadUrl);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
        }

        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    console.error("Ошибка: превышено время ожидания отчета.");
    return null;
}
