
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { GetWorkflowsForUser } from '@/actions/workflows/get-workflows-for-user';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, InboxIcon, Search } from 'lucide-react';
import CreateWorkflowDialog from '@/components/workflows/create-workflow-dialog';
import { waitFor } from '@/lib/helper/waitFor';
import WorkflowCard from '@/components/workflows/workflow-card';
import { Input } from '@/components/ui/input';
import Searcher from '@/components/searcher';

interface UserWorkflowsProps {
    userId: string;
}

function Workflows() {
    return (
        <div className='flex-1 flex flex-col h-full'>
            <div className="flex justify-between">
                <div className="flex flex-col">

                    <h1 className="text-3xl font-bold">
                        Рабочие процессы
                    </h1>

                    <p className="text-muted-foreground">
                        Панель управления твоих рабочих пространств
                    </p>
                </div>
                <CreateWorkflowDialog />
            </div>

            <div className="h-full py-6">
                <React.Suspense fallback={<UserWorkflowsSkeleton />}>
                    <UserWorkflows />
                </React.Suspense>
            </div>
        </div>
    );
}

async function UserWorkflowsSkeleton() {

    return (
        <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='h-32 w-full' />
            ))}
        </div>
    );
}

// Серверная функция для получения рабочих процессов
async function UserWorkflows() {
    try {
        // Симуляция задержки
        // waitFor(10000); // 10sec

        // Запрос на получение рабочих процессов
        const workflows = await GetWorkflowsForUser();
        console.log(workflows)
        // Если данные получены
        if (workflows && workflows.length > 0) {
            return (<Searcher workflows={workflows} />)
        }

        // Если нет рабочих процессов
        if (workflows.length === 0) {
            return (
                <div className="flex flex-col gap-4 h-full items-center justify-center">
                    <div className="rounded-full border w-20 h-20 flex items-center justify-center">
                        <InboxIcon size={40} className='stroke-primary' />
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="font-bold">Нет созданных проектов</p>
                        <p className="text-sm text-muted-foreground">
                            Нажми на кнопку ниже, чтобы создать свой первый проект
                        </p>
                    </div>
                    <CreateWorkflowDialog triggerText="Создай свой первый процесс" />
                </div>
            );
        }

    } catch (error) {
        // Обработка ошибок
        return (
            <Alert variant={"destructive"}>
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>Что-то пошло не так</AlertDescription>
            </Alert>
        );
    }
}

export default Workflows;
