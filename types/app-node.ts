import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./task";


// {
//     "type": "UPLOAD_OPENAPI",
//     "inputs": {
//         "file": FILE
//     },
// }

export interface AppNodeData {
    type: TaskType;
    [key: string]: any;
    inputs: Record<string, string | File | Blob | Object>; // Record<string, string | File | Blob | Object>
    // может быть уяза, получается что пользак может в любой импут хуйнуть файл или блоб
}

// Расширяем тип Node из react flow своими данными, а имеено тип джобы, её входы\выходы и данные, но при этом пользователь не сможет расширить чем-угодно наш тип
export interface AppNode extends Node {
    data: AppNodeData;
}

export interface ParamProps {
    param: TaskParam;
    value: string; //value: string | Blob | File;

    updateNodeParamValue: (newValue: string) => void;
    disabled?: boolean;
}

export type AppNodeMissingInputs = {
    nodeId: string;
    inputs: string[];
}
