"use client";
import React, { useState } from "react";
import Editor from '@monaco-editor/react';

const CodeEditor = async (openapiSpec) => {
    const [value, setValue] = useState("")
    return <Editor
        value={openapiSpec}
        theme="vs-dark"
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onChange={(value?: string) => setValue(value || "")}
    />;

};

export default CodeEditor;
