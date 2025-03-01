"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/app-node';
import React, { useEffect, useState } from 'react'


function StringParam({
    param,
    value,
    updateNodeParamValue,
    disabled
}: ParamProps) {
    const id = React.useId();
    const [internvalValue, setInternalValue] = useState(value);

    // Для обновления состояния очищения value в инпутах и аутпутах, когда соединяются линии и если было значение то оно очищается при соединение
    useEffect(() => {
        setInternalValue(value)
    }, [value]);


    let Component: any = Input;
    if (param.variant === "textarea") {
        Component = Textarea;
    }

    return (
        <div className='space-y-1 p-1 w-full'>
            <Label htmlFor={id} className='text-xs flex'>
                {param.name}
                {param.required && (<p className='text-red-400 px-2'>*</p>)}
            </Label>
            <Component
                className='bg-foreground-muted text-xs'
                placeholder='Введите значение'
                id={id}
                value={internvalValue}
                disabled={disabled}
                onChange={(event: any) => setInternalValue(event.target.value)}
                onBlur={(event: any) => updateNodeParamValue(event.target.value)}
            />
            {param.helperText && (
                <p className='text-muted-foreground px-2'>{param.helperText}</p>
            )}
        </div>
    )
}

export default StringParam;