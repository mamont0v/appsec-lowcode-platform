
/**
 * Сопоставление типов параметров задачи (TaskParamType) с CSS-классами для стилизации ручек (handles) в ReactFlow.
 * 
 * Это используется для определения цвета ручек (handles) на узлах графа в зависимости от их типа.
 * 
 * Пример использования:
 * ```ts
 * import { ColorForHandle } from './path/to/ColorForHandle';
 * 
 * const handleClass = ColorForHandle[TaskParamType.STRING]; // Получит "!bg-amber-400"
 * ```
 * 
 * @type {Record<TaskParamType, string>}
 * @property {string} BROWSER_INSTANCE - CSS-класс для параметров типа `BROWSER_INSTANCE`. 
 * Цвет ручки: синий.
 * @property {string} STRING - CSS-класс для параметров типа `STRING`. 
 * Цвет ручки: жёлтый.
 */

import { TaskParamType } from "@/types/task";

// Record: сопоставляет каждый TaskParamType с соответствующим классом стиля.
export const ColorForHandle: Record<TaskParamType, string> = {
    BROWSER_INSTANCE: "!bg-sky-400", // Синий цвет для параметров BROWSER_INSTANCE 
    // эквивалентно [TaskParamType.BROWSER_INSTANCE]
    STRING: "!bg-amber-400", // Жёлтый цвет для параметров STRING
};