"use client";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { ParamProps } from '@/types/app-node';
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import React, { useId } from 'react'

type OptionType = {
    label: string;
    value: string;
}

function SelectParam({ param, updateNodeParamValue, value }: ParamProps & { value?: string }) {
    const id = useId();
    return (
        <div className="flex flex-col gap-1 w-full">
            <Label htmlFor={id} className="text-xs flex">
                {param.name}
                {param.required && <p className="text-red-400 px-2">*</p>}
            </Label>

            <Select onValueChange={(value) => updateNodeParamValue(value)} defaultValue={value}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выбрать значение" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Опции</SelectLabel>
                        {param.options.map((option: OptionType) => (
                            <SelectItem key={option.label} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default SelectParam;