
import { TaskParamType } from "@/types/task";

export const ColorForHandle: Record<TaskParamType, string> = {
    BROWSER_INSTANCE: "!bg-sky-400", // Синий цвет для параметров BROWSER_INSTANCE 
    // эквивалентно [TaskParamType.BROWSER_INSTANCE]
    STRING: "!bg-amber-400", // Жёлтый цвет для параметров STRING
    SELECT: "!bg-rose-400",
    JSON: "!bg-green-400", // Зелёный цвет для параметров JSON
    BLOB: "!bg-purple-400", // Фиолетовый цвет для параметров BLOB
    FILE: "!bg-red-400", // Красный цвет для параметров FILE
    CREDENTIALS: "!bg-indigo-400",
    STRING_OPENAPI: "!bg-lime-500", // Индиго цвет для параметров CREDENTIALS
    TEST: "!bg-teal-400"
};