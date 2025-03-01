"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ParamProps } from "@/types/app-node";
import React, { useEffect, useState } from "react";

function OpenApiParam({ param, value, updateNodeParamValue }: ParamProps) {
    const [internalValue, setInternalValue] = useState("");  // Set initial value to an empty string

    // Synchronize internal value with prop `value`
    useEffect(() => {
        setInternalValue(value);  // Ensure it always has a value ("" if undefined or null)
    }, [value]);

    return (
        <div className="space-y-1 p-1 w-full">
            <Label className="text-xs flex">
                {param.name}
                {param.required && <span>*</span>}
            </Label>
        </div>
    );
}

export default OpenApiParam;
