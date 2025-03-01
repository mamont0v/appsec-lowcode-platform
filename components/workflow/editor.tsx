import { Workflow } from '@prisma/client';
import React from 'react'
import { ReactFlow, ReactFlowProvider, useNodes } from '@xyflow/react'
import FlowEditor from './flow-editor';
import Topbar from './topbar/topbar';
import TaskMenu from './task-menu';
import { FlowValidationContextProvider } from '@/context/flow-validation-context';
import { WorkflowStatus } from '@/types/workflow';
import { Separator } from '@/components/ui/separator';
import Logo from '../logo';
import { ThemeToggle } from '../theme-toggle';

function Editor({ workflow }: { workflow: Workflow }) {
    return (
        <div className="flex flex-col h-screen w-full">
            <FlowValidationContextProvider>
                <ReactFlowProvider>
                    <div className="flex flex-col h-full w-full overflow-hidden">
                        <Topbar
                            title="Редактор процессов"
                            subtitle={workflow.name}
                            workflowId={workflow.id}
                            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
                        />
                        <section className='flex h-full overflow-auto'>
                            <TaskMenu>
                                <FlowEditor workflow={workflow} />
                            </TaskMenu>
                        </section>
                    </div>
                </ReactFlowProvider>
            </FlowValidationContextProvider>
            <Separator />
            <footer className='flex items-center justify-between p-2'>
                <Logo />
                <ThemeToggle />
            </footer>
        </div>
    )
}


export default Editor;