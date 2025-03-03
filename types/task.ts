export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
    FILL_INPUT = "FILL_INPUT",
    CLICK_ELEMENT = "CLICK_ELEMENT",
    WAIT_FOR_ELEMENT = 'WAIT_FOR_ELEMENT',
    DELIVER_WEB_VIA_WEBHOOK = 'DELIVER_WEB_VIA_WEBHOOK',
    EXTRACT_DATA_WITH_AI = 'EXTRACT_DATA_WITH_AI',
    READ_PROPERTY_FROM_JSON = 'READ_PROPERTY_FROM_JSON',
    REPORT = 'REPORT',
    ADD_PROPERTY_TO_JSON = 'ADD_PROPERTY_TO_JSON',
    NAVIGATE_URL = "NAVIGATE_URL",
    SCROLL_PAGE = "SCROLL_PAGE",

    UPLOAD_OPENAPI_FILE = "UPLOAD_OPENAPI_FILE",
    LINTER_OPENAPI = "LINTER_OPENAPI",
    SJ_OPENAPI = "SJ_OPENAPI"
}

export enum TaskParamType {
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    STRING = "STRING",
    OPENAPI = "OPENAPI",
    STRING_OPENAPI = "STRING_OPENAPI",
    JSON = "JSON",
    BLOB = "BLOB",
    FILE = "FILE",
    SELECT = "SELECT",
    CREDENTIALS = "CREDENTIALS",
    REPORT = "REPORT",
    PHASE1 = "PHASE1",
    PHASE2 = "PHASE2",
    PHASE3 = "PHASE3"
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    value?: string;
    [key: string]: any;
}
