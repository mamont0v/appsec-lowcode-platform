"use client";

import { RunWorkflow } from '@/actions/workflows/run-workflow';
import { Button } from '@/components/ui/button'
import useExecutionPlan from '@/hooks/use-execution.plan';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon, UploadIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import PublishWorkflow from '@/actions/workflows/publish-workflow';

function PublishButton({ workflowId }: { workflowId: string }) {
    const generateExecutionPlan = useExecutionPlan();
    const { toObject } = useReactFlow();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: PublishWorkflow,
        onSuccess: (execution) => {
            toast.success('Пайплайн опубликован', { id: workflowId });
            // router.push(`/app/workflow/runs/${workflowId}/${execution.id}`);
        },
        onError: () => {
            toast.error('Ошибка при публикации пайплайна', { id: workflowId });
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

                toast.loading("Идет публикация...", { id: workflowId })
                mutation.mutate({
                    id: workflowId,
                    flowDefinition: JSON.stringify(toObject()),
                });
            }}>
            <UploadIcon size={16} className='stroke-green-400' />
            Опубликовать
        </Button>
    );
}

export default PublishButton;