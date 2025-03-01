"use client";


import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import DeleteWorkflow from '@/actions/workflows/delete-workflow';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { XIcon } from 'lucide-react';
import { DeleteCredentialsForUser } from '@/actions/credentials/delete-credentials-for-user';


interface Props {
    name: string;
}

function DeleteCredentialsDialog({ name }: Props) {
    const [open, setOpen] = useState(false);

    const [confirmText, setConfirmText] = useState("")

    const deleteMutation = useMutation({
        mutationFn: DeleteCredentialsForUser,
        onSuccess: () => {
            toast.success("Учетные данные удалены", { id: name });
            setConfirmText("");
        },
        onError: () => {
            toast.error("Ошибка при удалении учетных данных", { id: name })
        }
    })


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>

            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"icon"}>
                    <XIcon size={18} />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Если вы удалите этот рабочий процесс, вы не сможете его больше восстановить.
                    </AlertDialogDescription>
                    <div className="flex flex-col py-4 gap-2 items-center">
                        <p>Если вы уверены, введите полностью название учетных данных <b>{name}</b> в поле для подтверждения.</p>
                        <Input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} />
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText("")}>
                        Отменить
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={confirmText !== name || deleteMutation.isPending}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        onClick={(event) => {
                            event.stopPropagation();
                            toast.loading("Удаление учетных данных...", { id: name });
                            deleteMutation.mutate(name);
                        }}
                    >
                        Удалить 💀
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCredentialsDialog;