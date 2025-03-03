import { LogCollector, Log, LogLevel, LogLevels } from "@/types/log";
import { LogFunction } from '../types/log';

export function createLogCollector(): LogCollector {
    const logs: Log[] = [];
    const getAll = () => logs;

    const logFunctions = {} as Record<LogLevel, LogFunction>
    LogLevels.forEach(
        (level) => (
            logFunctions[level] = (message: string) => {
                logs.push({ message, level, timestamp: new Date() });
            })
    );
    return {
        getAll,
        ...logFunctions
    }
}