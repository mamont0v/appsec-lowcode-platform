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
import { Layers2Icon, Loader2, ShieldEllipsis } from 'lucide-react';
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
import { createCredentialSchema, createCredentialSchemaType } from '@/schemas/credentials';
import { CreateCredential } from '@/actions/credentials/create-credential';


function CreateCredentialsDialog({ triggerText }: { triggerText?: string }) {
    const [isOpen, setOpen] = useState<boolean>(false);
    // const router = useRouter(); // Используем useRouter для редиректа

    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: {
            name: '',
            value: ''
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCredential,
        onSuccess: (result) => {
            toast.success("Учетные данные добавлены", { id: "create-credential" })
            // Ожидаем успешное закрытие toast, а затем редиректим
            // router.push(`/app/workflow/editor/${result.id}`);
            form.reset();
            setOpen(false);
        },
        onError: (error) => {
            toast.error("Ошибка при добавлении учетных данных", { id: "create-credential" });
        },
    });

    const onSubmit = useCallback(
        (values: createCredentialSchemaType) => {
            toast.loading("Creating credential...", { id: "create-credential" });
            mutate(values)
        },
        [mutate]
    )

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Создать учетные данные"}</Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader
                    icon={ShieldEllipsis}
                    title="Добавить учетные данные" />
                <div className="p-6">
                    <Form {...form}>
                        <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Name
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Введите уникальное название для ваших учетных данных
                                            <br />
                                            Это имя будет использоваться для идентификации секрета
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Значение
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

export default CreateCredentialsDialog;