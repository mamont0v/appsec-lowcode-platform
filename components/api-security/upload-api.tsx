"use client";
import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";

type Props = {};

const UploadApi = (props: Props) => {
    const [document, setDocument] = useState<Blob | File | null | undefined>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);

    const acceptableTypes = [
        "application/json",
        "application/x-yaml",
        "text/yaml",
        "text/x-yaml",
    ];

    const handleError = useCallback((message: string) => {
        setErrorMessage(message);
        setIsLoading(false);
    }, []);

    const handleSubmitFile = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!document) {
            handleError("Пожалуйста, выберите файл.");
            return;
        }

        if (!acceptableTypes.includes(document.type)) {
            handleError("Неподдерживаемый формат файла. Пожалуйста, загрузите JSON или YAML.");
            return;
        }

        setIsLoading(true);
        setDownloadUrl(null);
        setErrorMessage(null);


        const formData = new FormData();
        formData.append("file", document);
        try {
            // TODO
            const response = await fetch("https:///api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                handleError(result.error || "Произошла ошибка при обработке файла.");
                return;
            }

            const { taskId } = result;
            setTaskId(taskId);
            // TODO
            setDownloadUrl(`/api/upload/${taskId}`);
        } catch (error) {
            handleError("Произошла ошибка при загрузке файла.");
        } finally {
            setIsLoading(false);
        }
    }, [document, handleError]);

    const handleDownloadReport = useCallback(() => {
        if (!taskId) {
            handleError("Task ID не найден.");
            return;
        }

        try {
            // TODO
            const responseUrl = `/api/upload/${taskId}`;
            window.location.href = responseUrl;
        } catch (error) {
            handleError("Ошибка при загрузке отчета.");
        }
    }, [taskId, handleError]);

    return (
        <div className="w-full">
            <form className="w-full" onSubmit={handleSubmitFile}>
                <label
                    className="bg-secondary w-full flex h-20 border-2 border-fuchsia-600 border-dashed relative cursor-pointer"
                    htmlFor="document"
                >
                    <div className="absolute inset-0 m-auto flex justify-center items-center">
                        {document && document instanceof File && document.name
                            ? document.name
                            : "Добавить файл.."}
                    </div>
                </label>
                <input
                    type="file"
                    id="document"
                    onChange={(e) => setDocument(e?.target?.files?.[0])}
                    accept={acceptableTypes.join(",")}
                    className="hidden"
                />
                <Button size="lg" className="bg-gray-800 mt-4" type="submit">
                    {isLoading ? "Загрузка..." : "Отправить"}
                </Button>
            </form>



            {errorMessage && <div className="text-red-600 mt-4">{errorMessage}</div>}

            {downloadUrl && (
                <div className="mt-4">
                    <Button size="lg" className="bg-blue-600" onClick={handleDownloadReport}>
                        Скачать отчет
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UploadApi;
