"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ParamProps } from "@/types/app-node";
import React, { useEffect, useState } from "react";
import { z } from "zod";

const fileSchema = z.object({
    name: z.string(),
    size: z.number().max(5 * 1024 * 1024, "Файл должен быть меньше 5 MB"),
    type: z.enum(["application/json", "application/x-yaml", "text/yaml", "text/x-yaml"], "Неверный тип файла"),
});

function OpenApiFileParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
    const id = React.useId();
    const [internalFile, setInternalFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const acceptableTypes = [
        "application/json",
        "application/x-yaml",
        "text/yaml",
        "text/x-yaml",
    ];

    useEffect(() => {
        if (value && typeof value === "string") {
            // Используем сохранённое имя файла, если оно было загружено ранее
            const storedFileName = internalFile?.name || "openapi";
            const storedFileType = internalFile?.type || "application/octet-stream";

            setInternalFile(new File([value], storedFileName, { type: storedFileType }));
        } else {
            setInternalFile(null);
        }
    }, [value]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (file) {
            const validationResult = fileSchema.safeParse({
                name: file.name,
                size: file.size,
                type: file.type,
            });

            if (!validationResult.success) {
                setError(validationResult.error.errors[0].message);
                updateNodeParamValue("");
                return;
            }

            setError(null);
            setInternalFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                updateNodeParamValue(e.target?.result as string);
            };
            reader.readAsText(file);
        } else {
            setError("Файл не выбран");
            setInternalFile(null);
            updateNodeParamValue("");
        }
    };

    const handleFileRemove = () => {
        setInternalFile(null);
        setError(null);
        updateNodeParamValue("");
    };

    return (
        <div className="space-y-1 p-1 w-full">
            <Label htmlFor={id} className="text-xs flex">
                {param.name}
                {param.required && <p className="text-red-400 px-2">*</p>}
            </Label>

            {internalFile ? (
                <div className="flex items-center justify-between border border-gray-300 p-2 rounded-md">
                    <span className="text-sm">{internalFile.name}</span>
                    <Button variant="destructive" size="sm" onClick={handleFileRemove}>
                        Удалить
                    </Button>
                </div>
            ) : (
                <label htmlFor={id} className="bg-secondary w-full flex h-20 border-2 border-fuchsia-600 border-dashed relative cursor-pointer">
                    <div className="absolute inset-0 m-auto flex justify-center items-center text-xs">
                        Добавить файл...
                    </div>
                </label>
            )}

            {!internalFile && (
                <Input
                    type="file"
                    id={id}
                    onChange={handleFileChange}
                    accept={acceptableTypes.join(",")}
                    className="hidden bg-foreground-muted text-xs"
                    disabled={disabled}
                />
            )}

            {error && <p className="text-red-400 text-xs px-2">{error}</p>}
            {param.helperText && !error && <p className="text-muted-foreground text-xs px-2">{param.helperText}</p>}
        </div>
    );
}

export default OpenApiFileParam;
