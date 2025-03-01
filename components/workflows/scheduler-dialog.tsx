"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";

import React, { useEffect, useState } from 'react'
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "./custom-dialog-header";
import { Input } from "../ui/input";
import UpdateWorkflowCron from "@/actions/workflows/update-workflow-cron";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import cronstrue from 'cronstrue';
import Link from "next/link";
import parser from 'cron-parser';
import RemoveWorkflowSchedule from "@/actions/workflows/remove-workflow-schedule";
import { Separator } from "../ui/separator";

function SchedulerDialog(props: {
    cron: string | null;
    workflowId: string
}) {
    const [cron, setCron] = useState(props.cron || "");
    const [validCron, setValidCron] = useState(false);
    const [readableCron, setReadableCron] = useState("");

    const mutation = useMutation({
        mutationFn: UpdateWorkflowCron,
        onSuccess: (execution) => {
            toast.success('Cron создана успешно', { id: "cron" });
            // router.push(`/app/workflow/runs/${workflowId}/${execution.id}`);

        },
        onError: () => {
            toast.error('Ошибка при создании cron', { id: "cron" });
        },
    });

    const removeScheduleMutation = useMutation({
        mutationFn: RemoveWorkflowSchedule,
        onSuccess: (execution) => {
            toast.success('Cron создана успешно', { id: "cron" });
            // router.push(`/app/workflow/runs/${workflowId}/${execution.id}`);

        },
        onError: () => {
            toast.error('Ошибка при создании cron', { id: "cron" });
        },
    });

    useEffect(() => {
        try {
            // client-side check cron task
            parser.parseExpression(cron);
            // server-side check cron task
            const humanCronStr = cronstrue.toString(cron);
            setValidCron(true);
            setReadableCron(humanCronStr);
        } catch (error) {
            setValidCron(false)
        }
    }, [cron])

    // fix flickering effect on cron button
    const workflowHasValidCron = props.cron && props.cron.length > 0;
    const readableSavedCron = workflowHasValidCron && cronstrue.toString(props.cron!);


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"link"}
                    size={"sm"}
                    className={cn("text-sm p-0 h-auto text-orange-500", readableSavedCron && "text-primary")}
                >
                    {readableSavedCron && (
                        <div className="flex items-center gap-2">
                            <ClockIcon />
                            {readableSavedCron}
                        </div>
                    )}
                    {!readableSavedCron && (
                        <div className="flex items-center gap-1">
                            <TriangleAlertIcon className="h-3 w-3" /> Создать cron job
                        </div>
                    )}

                </Button>
            </DialogTrigger>

            <DialogContent className="px-0">
                <CustomDialogHeader
                    title="Планировщик расписания выполнения пайплайна"
                    icon={CalendarIcon}

                />
                <div className="p-6 space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Пожалуйста, введите cron выражение для планирования задачи. Время указано в UTC
                    </p>
                    <Input placeholder="Например: * * * * *" value={cron} onChange={(e) => setCron(e.target.value)} />

                    <div className={cn(
                        "bg-accent rounded-md p-4 border text-sm border-destructive text-destructive", validCron && "border-primary text-primary"
                    )}>
                        {validCron ? readableCron : "Невалидное выражение cron"}
                        {!validCron && (
                            <div className="text-xs mt-2">
                                <Link href="https://crontab.guru/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                    cм. cron-генератор
                                </Link>
                            </div>
                        )}
                    </div>

                    {workflowHasValidCron &&
                        <DialogClose asChild>
                            <div className="px-8">
                                <Button className="w-full text-destructive border-destructive hover:text-destructive" variant={"outline"}
                                    disabled={
                                        mutation.isPending || removeScheduleMutation.isPending
                                    }
                                    onClick={() => {
                                        toast.loading("Удаление расписания...", { id: "cron" });
                                        removeScheduleMutation.mutate(props.workflowId);
                                    }}
                                >
                                    Удалить текущее расписание
                                </Button>
                                <Separator className="my-4" />
                            </div>
                        </DialogClose>}
                </div>
                <DialogFooter className="px-6 gap-2">
                    <DialogClose asChild>
                        <Button
                            className="w-full"
                            disabled={mutation.isPending}
                            variant={"secondary"}
                            onClick={() => {
                                toast.loading("Идет сохранение...", { id: "cron" });
                                mutation.mutate({
                                    id: props.workflowId,
                                    cron
                                })
                            }}
                        >
                            Отмена
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            className="w-full"
                            disabled={mutation.isPending || !validCron}
                            onClick={() => {
                                mutation.mutate({
                                    id: props.workflowId,
                                    cron,
                                })
                            }}
                        >Сохранить</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SchedulerDialog;