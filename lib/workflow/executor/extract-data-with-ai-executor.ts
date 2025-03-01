import ollama from "ollama";

async function fetchJsonResponseForSingleIssue(issue, prompt) {
    const response = await ollama.chat({
        model: process.env.LLM || "deepseek-r1:7b",
        stream: false,
        format: {
            type: "object",
            properties: {
                path: {
                    type: "string"
                },
                threat: {
                    type: "boolean"
                },
                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                vulnerability: {
                    type: "string"
                }
            },
            required: ["path", "threat", "recommendations", "vulnerability"]
        },
        messages: [
            {
                role: "system",
                content: `
You are an expert in API and OpenAPI security. Your task is to analyze the results of the OpenAPI security linter according to the OWASP API Security rules (spectral-owasp-api-security-ruleset).  

You will be provided with:
1. The linter output containing detected security issues.

Your objective:
- Carefully analyze the linter's findings.  
- Extract relevant security issues and recommendations for mitigation.
- set the threat field TRUE if the defect is considered positive, FALSE if not
                `
            },
            { role: "user", content: JSON.stringify(issue, null, 2) },  // Отправляем один элемент
            { role: "user", content: prompt }
        ]
    });

    // console.log("✅ Ответ для элемента:", response.message.content);
    return JSON.parse(response.message.content); // 🔥 Парсим JSON-ответ
}

export async function ExtractDataWithAiExecutor(environment) {
    try {
        const prompt = await environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("input -> Prompt not defined");
            return false;
        }

        let content = environment.getInput("Content");
        if (!content) {
            environment.log.error("input -> Content not defined");
            return false;
        }

        content = JSON.parse(content);

        // 📌 Извлекаем массив ошибок из resultSet
        const issues = content.resultSet?.results || [];

        if (issues.length === 0) {
            environment.log.info("✅ Нет найденных проблем в OpenAPI логе.");
            environment.setOutput("Extracted data", "[]");
            return true;
        }

        // 🚀 Обрабатываем каждый элемент по очереди
        const allResults = [];
        for (let i = 0; i < issues.length; i++) {
            const aiResponse = await fetchJsonResponseForSingleIssue(issues[i], prompt);
            allResults.push(aiResponse); // Собираем все ответы
        }

        environment.log.info("✅ Все ответы получены!");
        environment.setOutput("Extracted data", JSON.stringify(allResults));

        return true;
    } catch (error) {
        environment.log.error(`❌ Ошибка выполнения AI-анализа: ${error.message}`);
        return false;
    }
}

