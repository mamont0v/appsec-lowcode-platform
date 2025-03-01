import GetWorkflowExecutions from '@/actions/workflows/get-workflow-executions';
import ExecutionsTable from '@/components/runs/executions-table';
import Topbar from '@/components/workflow/topbar/topbar';
import { InboxIcon } from 'lucide-react';
import React, { Suspense } from 'react';

export default async function ExecutionPage({ params }: { params: { workflowId: string } }) {
    // Параметры уже доступны, так как это серверный компонент
    const { workflowId } = await params;

    return (
        <div className="h-full w-full overflow-auto">
            <Topbar
                workflowId={workflowId}
                hideButtons
                title="Раннеры"
                subtitle="Список запущенных раннеров"
            />
            {/* Передаем workflowId в ExecutionTable */}
            <Suspense>
                <ExecutionTableWrapper workflowId={workflowId} />
            </Suspense>
        </div>
    );
}

async function ExecutionTableWrapper({ workflowId }: { workflowId: string }) {
    // Получаем данные асинхронно
    const executions = await GetWorkflowExecutions(workflowId);

    if (!executions) {
        return <div>Нет данных о запусках</div>;
    }

    if (executions.length === 0) {
        return (
            <div className='container w-full h-full flex items-center justify-center'>
                <div className='flex items-center flex-col gap-2 justify-center'>
                    <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
                        <InboxIcon size={40} className='stroke-primary' />
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="font-bold">
                            Нет истории для данного раннера
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Запусти раннер в Editor
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-6 w-full">
            <ExecutionsTable workflowId={workflowId} initialData={executions} />
        </div>
    )
}