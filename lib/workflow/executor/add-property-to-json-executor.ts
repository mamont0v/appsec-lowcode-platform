import { waitFor } from "@/lib/helper/waitFor";
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/fill-input-task";
import { ClickElementTask } from "../task/click-element-task";
import { ReadPropertyFromJsonTask } from "../task/read-property-from-json-task";
import parseJson, { JSONError } from 'parse-json';
import { AddPropertyToJsonTask } from "../task/add-property-to-json-task";


export async function AddPropertyToJsonExecutor(environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>): Promise<boolean> {
    try {
        // Получаем строку с JSON
        let jsonSelector = await environment.getInput("JSON");
        if (!jsonSelector) {
            environment.log.error("input -> Json not defined");
            return false;
        }


        // Получаем имя свойства, которое нужно извлечь
        const nameValueSelector = await environment.getInput("Имя свойства");

        if (!nameValueSelector) {
            environment.log.error("input -> Имя свойства not defined");
            return false;
        }

        // Получаем значение свойства, которое нужно извлечь
        const propertyValueSelector = await environment.getInput("Значение свойства");

        if (!propertyValueSelector) {
            environment.log.error("input -> Имя свойства not defined");
            return false;
        }


        let jsonObject = JSON.parse(jsonSelector);
        jsonObject = parseJson(jsonObject);

        jsonObject[nameValueSelector] = propertyValueSelector



        // Устанавливаем результат
        environment.setOutput("Значение свойства", JSON.stringify(jsonObject));
        return true;

    } catch (error) {
        // Обработка ошибок
        console.error("Ошибка парсинга JSON:", error);
        environment.log.error("Ошибка парсинга JSON: " + (error as Error).message);
        return false;
    }
}
