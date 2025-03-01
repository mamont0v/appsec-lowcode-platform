import CodeEditor from "@/components/api-security/code-editor";
import UploadApi from "@/components/api-security/upload-api";
import React from "react";

const APISecurity = async () => {
    return (
        <div className="mt-10 p-8 mx-auto max-w-7xl">
            {/* <CodeEditor /> */}
            <UploadApi />
        </div>
    )
}

export default APISecurity;
