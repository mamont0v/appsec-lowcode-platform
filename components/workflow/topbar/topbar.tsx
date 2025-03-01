"use client"

import React from 'react'
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TooltipWrapper from '@/components/workflows/tooltip-wrapper';
import SaveBtn from '@/components/workflow/topbar/save-button';
import ExecuteButton from '@/components/workflow/topbar/execute-button';
import NavigationTabs from '@/components/workflow/topbar/navigation-tabs';
import PublishBtn from '@/components/workflow/topbar/publish-button';
import UnpublishButton from '@/components/workflow/topbar/unpublish-button';

interface Props {
    title: string;
    subtitle?: string
    workflowId: string;
    hideButtons?: boolean;
    isPublished?: boolean;
}

function Topbar({
    title,
    subtitle,
    workflowId,
    hideButtons = false,
    isPublished = false
}: Props) {
    const router = useRouter();
    return (
        <header className='flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10'>
            <div className="flex gap-1 flex-1">
                <TooltipWrapper content="Назад">
                    <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
                        <ChevronLeft size={20} />
                    </Button>
                </TooltipWrapper>
                <div>
                    <p className='font-bold text-ellipsis truncate'>
                        {title}
                    </p>
                    {subtitle && (
                        <p className='text-xs text-muted-foreground truncate text-ellipsis'>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            <NavigationTabs workflowId={workflowId} />
            <div className="flex gap-1 flex-1 justify-end">
                {hideButtons === false && (
                    <>
                        <ExecuteButton workflowId={workflowId} />
                        {isPublished && (
                            <UnpublishButton workflowId={workflowId} />
                        )

                        }
                        {!isPublished && (
                            <>
                                <SaveBtn workflowId={workflowId} />
                                <PublishBtn workflowId={workflowId} />
                            </>
                        )}
                    </>
                )}
            </div>
        </header>
    )
}

export default Topbar;