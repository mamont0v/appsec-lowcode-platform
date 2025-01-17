"use client";

import { RunWorkflow } from '@/actions/workflows/run-workflow';
import { Button } from '@/components/ui/button'
import useExecutionPlan from '@/hooks/use-execution.plan';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

function ExecuteButton({ workflowId }: { workflowId: string }) {
    const generateExecutionPlan = useExecutionPlan();
    const { toObject } = useReactFlow();
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: (execution) => {
            toast.success('Пайплайн запущен', { id: "execution-workflow" });
            router.push(`/workflow/runs/${workflowId}/${execution.id}`);

        },
        onError: () => {
            toast.error('Ошибка при запуске пайплайна', { id: "execution-workflow" });
        },
    });

    return (
        <Button
            variant={"outline"}
            className='flex items-center gap-2'
            disabled={mutation.isPending}
            onClick={() => {
                const plan = generateExecutionPlan();
                if (!plan) {
                    return;
                }
                mutation.mutate({
                    workflowId,
                    flowDefinition: JSON.stringify(toObject()),
                });
            }}>
            <PlayIcon size={16} className='stroke-orange-400' />
            Запустить
        </Button>
    );
}

export default ExecuteButton;