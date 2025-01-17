import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { GetWorkflowsForUser } from '@/actions/workflows/get-workflows-for-user';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, InboxIcon } from 'lucide-react';
import CreateWorkflowDialog from '@/components/workflows/create-workflow-dialog';
import { waitFor } from '@/lib/helper/waitFor';
import WorkflowCard from '@/components/workflows/workflow-card';

interface UserWorkflowsProps {
    userId: string;
}

function Workflows() {
    return (
        <div className='flex-1 flex flex-col h-full'>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">
                        Workflows
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

function UserWorkflowsSkeleton() {
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

        // Запрос на получение рабочих процессов
        const workflows = await GetWorkflowsForUser();

        // Если данные получены
        if (workflows && workflows.length > 0) {
            return (
                <div className="grid grid-cols-1 gap-4">
                    {workflows.map((workflow) => (
                        <WorkflowCard key={workflow.id} workflow={workflow} />
                    ))}
                </div>
            )
        }

        // Если нет рабочих процессов
        return (
            <div className="flex flex-col gap-4 h-full items-center justify-center">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
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
