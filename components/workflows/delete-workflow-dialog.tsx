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


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    workflowName: string;
    workflowId: string;
}

function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: Props) {
    const [confirmText, setConfirmText] = useState("")

    const deleteMutation = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            toast.success("Рабочий процесс удален", { id: workflowId });
            setConfirmText("");
        },
        onError: () => {
            toast.error("Ошибка при удалении процесса", { id: workflowId })
        }
    })


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Если вы удалите этот рабочий процесс, вы не сможете его больше восстановить.
                        <div className="flex flex-col py-4 gap-2 items-center">
                            <p>Если вы уверены, введите полностью название рабочего процесса <b>{workflowName}</b> в поле для подтверждения.</p>
                            <Input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText("")}>
                        Отменить
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={confirmText !== workflowName || deleteMutation.isPending}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        onClick={(event) => {
                            event.stopPropagation();
                            toast.loading("Удаление рабочего процесса...", { id: workflowId });
                            deleteMutation.mutate(workflowId);
                        }}
                    >
                        Удалить 💀
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteWorkflowDialog;