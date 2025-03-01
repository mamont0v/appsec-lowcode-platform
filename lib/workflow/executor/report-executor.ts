import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/fill-input-task";
import { ClickElementTask } from "../task/click-element-task";
import { ReadPropertyFromJsonTask } from "../task/read-property-from-json-task";
import parseJson, { JSONError } from 'parse-json';
import { ReportTask } from "../task/report-task";
import fs from 'fs';
import path from 'path';
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import { getAppUrl } from "@/lib/helper/appUrl";


export async function ReportExecutor(environment: ExecutionEnvironment<typeof ReportTask>): Promise<boolean> {
    try {

        // Получаем имя свойства, которое нужно извлечь
        const linterResults = await environment.getInput("Результаты линтера");
        let linterParsedResults;

        if (!linterResults || linterResults.trim().length === 0) {
            environment.log.info("input -> Результаты линтера не определены или пусты, не включены в отчет");
            return true;
        } else {
            // Пробуем распарсить результаты линтера
            try {
                linterParsedResults = await JSON.parse(linterResults);
            } catch (error) {
                environment.log.error("input -> Invalid JSON format for линтер results");
                return false;
            }

            // Обработка результатов линтера, если они валидны
            if (linterParsedResults && linterParsedResults.length > 0) {

                // Добавление результатов линтера в отчет
            }

        }


        let aiResults = await environment.getInput("Результаты AI");

        // Удаляем префиксы и суффиксы, если они присутствуют
        // jsonSelector = jsonSelector.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        // Убираем лишние символы переноса строки и пробелы
        // const cleanedJsonString = jsonSelector.replace(/\n/g, "").trim();

        // Если результаты AI не существуют или пусты, пропускаем добавление в отчет
        let aiParsedResults, parsedData;

        if (!aiResults || aiResults.trim().length === 0) {
            environment.log.info("input -> Результаты AI не определены или пусты, не включены в отчет");
            return true;
        } else {
            // Пробуем распарсить результаты линтера

            try {
                environment.log.info("input -> Trying JSON parse AI results");
                // aiParsedResults = JSON.parse(aiResults);
                // parsedData = parseJson(aiParsedResults);
            } catch (error) {
                environment.log.error("input -> Invalid JSON format for AI results");

            }

            // Обработка результатов линтера, если они валидны
            if (aiParsedResults && aiParsedResults.length > 0) {
                // Добавление результатов линтера в отчет
            }
        }

        let sjReport = await environment.getInput("Результаты Unprotected API");
        console.log("sjReport", sjReport);

        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("unauthenticated");
        }
        const userId = session.user.id;



        const reportData = {
            reportId: uuidv4(),  // Генерация уникального ID отчета
            linterResults: linterParsedResults || null,
            aiResults: aiResults || null,
            sjReport: sjReport || null,
        };

        // Создаем новый отчет в базе данных
        const newReport = await prisma.report.create({
            data: {
                userId: userId,
                reportId: reportData.reportId,
                data: {
                    linterResults: reportData.linterResults,
                    aiResults: reportData.aiResults,
                    sjReport: reportData.sjReport
                }, // Сохраняем данные отчета
            }
        });
        if (!newReport) {
            throw new Error("Не удалось создать отчет");
        }

        // model Report {
        //     id        String   @id @default(cuid()) @map("_id") // Уникальный идентификатор
        //     userId    String
        //     data      Json // Поле для хранения данных отчета в формате JSON
        //     createdAt DateTime @default(now()) // Время создания отчета
        //     updatedAt DateTime @updatedAt // Время последнего обновления отчета
        //   }
        const uploadUrl = getAppUrl(`app/workflow/reports/${newReport.id}`); // Формируем URL

        // Сохраняем ссылку на отчет в environment
        environment.setOutput("Отчет", uploadUrl);


        return true;

    } catch (error) {
        // Обработка ошибок
        console.error("Ошибка парсинга JSON:", error);
        environment.log.error("Ошибка парсинга JSON: " + (error as Error).message);
        return false;
    }
}
