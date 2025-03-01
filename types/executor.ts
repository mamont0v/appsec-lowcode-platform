import { Browser, Page } from 'puppeteer';
import { WorkflowTask } from './workflow';
import { LogCollector } from './log';
export type Environment = {
    browser?: Browser;
    openapiFile?: string;
    page?: Page;
    phases: Record<
        string,
        {
            inputs: Record<string, string>;
            outputs: Record<string, string>;
        }
    >;
}

export type ExecutionEnvironment<T extends WorkflowTask> = {

    // Реализация get/set Inputs
    getInput(name: T["inputs"][number]["name"]): string;
    setOutput(name: string, value: string): void;

    // Реализация get/set Browsers
    getBrowser(): Browser | undefined;
    setBrowser(browser: Browser): void;

    // Реализация get/set Pages
    getPage(): Page | undefined;
    setPage(page: Page): void;

    // Реализация get/set OpenAPI
    // getOpenApi(): string;
    // setOpenApi(openapiFile: string): void;

    log: LogCollector;
}

