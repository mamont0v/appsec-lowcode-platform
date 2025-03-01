"use client";

import React, { useCallback, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import CustomDialogHeader from '@/components/workflows/custom-dialog-header';
import { Layers2Icon, Loader2 } from 'lucide-react';
import { createWorkflowSchema, createWorkflowSchemaType } from '@/schemas/workflow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { CreateWorkflow } from '@/actions/workflows/create-workflow';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";


function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const router = useRouter(); // Используем useRouter для редиректа

    const form = useForm<createWorkflowSchemaType>({
        resolver: zodResolver(createWorkflowSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: CreateWorkflow,
        onSuccess: (result) => {
            toast.success("Рабочий процесс создан", { id: "create-workflow" })
            // Ожидаем успешное закрытие toast, а затем редиректим
            router.push(`/app/workflow/editor/${result.id}`);

        },
        onError: (error) => {
            toast.error("Ошибка при создании процесса", { id: "create-workflow" });
        },
    });

    const onSubmit = useCallback(
        (values: createWorkflowSchemaType) => {
            toast.loading("Creating workflow...", { id: "create-workflow" });
            mutate(values)
        },
        [mutate]
    )

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Создать процесс"}</Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader
                    icon={Layers2Icon}
                    title="Создать рабочий процесс"
                    subTitle="Начни строить пайплайн рабочего процесса"
                />
                <div className="p-6">
                    <Form {...form}>
                        <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Имя процесса
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Введите описание для своего рабочего пространства
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Описание
                                            <p className="text-xs text-primary">(optional)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Введите описание для своего рабочего пространства что оно делает.
                                            <br />
                                            Это поможет вам вспомнить что делает ваш процесс.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {!isPending && "Продолжить"}
                                {isPending && <Loader2 className='animate-spin' />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkflowDialog