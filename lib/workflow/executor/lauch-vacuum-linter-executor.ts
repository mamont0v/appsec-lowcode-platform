import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/launch-browser";
// Переделать лаунч браузер
export async function LaunchVacuumLinterExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        console.log("@openapi")
    } catch (error) {
        return false;
    }
    return true;
}