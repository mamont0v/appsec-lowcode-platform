import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/deliver-via-webhook-task";

export async function DeliverViaWebhookExecutor(environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>): Promise<boolean> {

    try {
        const targetUrl = await environment.getInput("Target URL");

        if (!targetUrl) {
            environment.log.error("input -> seelctor not defined")
        }

        const bodySelector = await environment.getInput("Body");

        if (!bodySelector) {
            environment.log.error("input -> seelctor not defined")
        }

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodySelector)
        });

        const statusCode = response.status;

        if (statusCode !== 200) {
            environment.log.error("input -> seelctor not defined");
        }

        const responseBody = await response.json();
        environment.log.info(JSON.stringify(responseBody, null, 4));
        return true;

    } catch (error) {
        return false;
    }

}