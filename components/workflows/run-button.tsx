import { RunWorkflow } from '@/actions/workflows/run-workflow';
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { Button } from '../ui/button';

function RunButton({ workflowId }: { workflowId: string }) {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: (execution) => {
            toast.success('Пайплайн запущен', { id: workflowId });
            router.push(`/app/workflow/runs/${workflowId}/${execution.id}`);
        },
        onError: () => {
            toast.error('Ошибка при запуске пайплайна', { id: workflowId });
        },
    });
    return (
        <Button
            variant={"outline"}
            size={"sm"}
            className='flex items-center gap-2'
            disabled={mutation.isPending}
            onClick={() => {
                toast.loading("Пайплайн запущен", { id: workflowId });
                mutation.mutate({
                    workflowId,
                })
            }}
        >
            <PlayIcon size={16} />
            Run
        </Button>
    )
}

export default RunButton