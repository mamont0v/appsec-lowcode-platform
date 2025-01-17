import { Workflow } from '@prisma/client';
import React from 'react'
import { ReactFlow, ReactFlowProvider, useNodes } from '@xyflow/react'
import FlowEditor from './flow-editor';
import Topbar from './topbar/topbar';
import TaskMenu from './task-menu';
import { FlowValidationContextProvider } from '@/context/flow-validation-context';

function Editor({ workflow }: { workflow: Workflow }) {
    return (
        <FlowValidationContextProvider>
            <ReactFlowProvider>
                <div className="flex flex-col h-full w-full overflow-hidden">
                    <Topbar title="Редактор процессов" subtitle={workflow.name} workflowId={workflow.id} />
                    <section className='flex h-full overflow-auto'>
                        <TaskMenu />
                        <FlowEditor workflow={workflow} />
                    </section>
                </div>
            </ReactFlowProvider>
        </FlowValidationContextProvider>
    )
}

export default Editor;