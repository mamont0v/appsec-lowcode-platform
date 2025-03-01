"use client";

import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import UnpublishWorkflow from '@/actions/workflows/unpublish-workflow';

function UnpublishButton({ workflowId }: { workflowId: string }) {

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: UnpublishWorkflow,
        onSuccess: (execution) => {
            toast.success('Пайплайн переведен в драфт', { id: workflowId });
            // router.push(`/app/workflow/runs/${workflowId}/${execution.id}`);
        },
        onError: () => {
            toast.error('Ошибка при переводе из публикации пайплайна', { id: workflowId });
        },
    });

    return (
        <Button
            variant={"outline"}
            className='flex items-center gap-2'
            disabled={mutation.isPending}
            onClick={() => {
                toast.loading("Идет перевод в тестовый режим...", { id: workflowId })

                mutation.mutate(workflowId);
            }}>
            <DownloadIcon size={16} className='stroke-orange-400' />
            Перевести в драфт
        </Button>
    );
}

export default UnpublishButton;