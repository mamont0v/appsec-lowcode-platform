"use client";

import { GetCredentialsForUser } from "@/actions/credentials/get-credentials-for-user";
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
import { useQuery } from "@tanstack/react-query";
import React, { useId } from 'react'


function CredentialsParam({ param, updateNodeParamValue, value }: ParamProps & { value?: string }) {
    const id = useId();

    // получение с помощью серверного действия секреты
    const query = useQuery({
        queryKey: ["credentials-for-user"],
        queryFn: GetCredentialsForUser,
        refetchInterval: 10000, //10s
    })
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
                        <SelectLabel>Credentials</SelectLabel>
                        {query.data?.map((credential: { value: string; name: string; id: string }) => (
                            <SelectItem key={credential.id} value={credential.id}>
                                {credential.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default CredentialsParam;