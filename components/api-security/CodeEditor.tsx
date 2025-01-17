"use client";
import React, { useState } from "react";
import Editor from '@monaco-editor/react';

const CodeEditor = async () => {
    const [value, setValue] = useState("")
    return <Editor
        value={value}
        theme="vs-dark"
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onChange={(value, event) => setValue(value)}
    />;

};

export default CodeEditor;
