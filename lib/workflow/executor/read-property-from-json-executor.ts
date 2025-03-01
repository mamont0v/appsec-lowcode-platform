import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/fill-input-task";
import { ClickElementTask } from "../task/click-element-task";
import { ReadPropertyFromJsonTask } from "../task/read-property-from-json-task";
import parseJson, { JSONError } from 'parse-json';


export async function ReadPropertyFromJsonExecutor(environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>): Promise<boolean> {
    try {
        // Получаем строку с JSON
        let jsonSelector = await environment.getInput("JSON");
        if (!jsonSelector) {
            environment.log.error("input -> Json not defined");
            return false;
        }

        // Удаляем префиксы и суффиксы, если они присутствуют
        jsonSelector = jsonSelector.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        // Убираем лишние символы переноса строки и пробелы
        const cleanedJsonString = jsonSelector.replace(/\n/g, "").trim();

        if (!cleanedJsonString) {
            environment.log.error("input -> Invalid JSON format or empty JSON string");
            return false;
        }

        // Парсим строку JSON в объект
        let jsonObject = JSON.parse(cleanedJsonString);
        jsonObject = parseJson(jsonObject);

        // console.log("@jsonObject", jsonObject);
        // console.log("@TYPE::", typeof jsonObject);

        // Получаем имя свойства, которое нужно извлечь
        const nameValueSelector = await environment.getInput("Имя свойства");

        if (!nameValueSelector) {
            environment.log.error("input -> Имя свойства not defined");
            return false;
        }

        // console.log("Property name to search:", nameValueSelector);

        // Получаем значение свойства из объекта JSON
        const propertyValue = jsonObject[nameValueSelector];

        if (propertyValue === undefined) {
            environment.log.error(`input -> Property '${nameValueSelector}' not found in the JSON object`);
            return false;
        }

        // Устанавливаем результат
        environment.setOutput("Значение свойства", propertyValue);
        return true;

    } catch (error) {
        // Обработка ошибок
        console.error("Ошибка парсинга JSON:", error);
        environment.log.error("Ошибка парсинга JSON: " + (error as Error).message);
        return false;
    }
}
