"use client";

import React, { ReactNode } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { TaskType } from '@/types/task';
import { Button } from '../ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';

interface TaskMenuProps {
    children: ReactNode;
}

function TaskMenu({ children }: TaskMenuProps) {
    return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Левая панель (меню задач) */}
            <ResizablePanel defaultSize={20} minSize={10} maxSize={30} className="border-r">
                <aside className="h-full p-2 px-4 overflow-auto">
                    <Accordion
                        type="multiple"
                        className="w-full"
                        defaultValue={[
                            "openapi",
                            "initial",
                            "extraction",
                            "interactions",
                            "timing",
                            "results",
                            "storage",
                        ]}
                    >
                        <AccordionItem value="openapi">
                            <AccordionTrigger className="font-bold">OpenAPI</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-1">
                                <TaskMenuBtn taskType={TaskType.UPLOAD_OPENAPI_FILE} />
                                <TaskMenuBtn taskType={TaskType.LINTER_OPENAPI} />
                                <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                                <TaskMenuBtn taskType={TaskType.REPORT} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </aside>
            </ResizablePanel>

            {/* Полоса для изменения размера */}
            <ResizableHandle withHandle className="w-2 bg-gray-300 hover:bg-gray-400 cursor-ew-resize" />

            {/* Правая панель (основной контент) */}
            <ResizablePanel defaultSize={80} minSize={50} className="p-4">
                {children}

            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
    const task = TaskRegistry[taskType];

    // onDragStart = (event, nodeType) https://v9.reactflow.dev/examples/drag-and-drop/
    const onDragStart = (event: React.DragEvent, type: TaskType) => {
        event.dataTransfer.setData('application/reactflow', type);
        event.dataTransfer.effectAllowed = 'move';

    }

    return (
        <Button
            variant={"secondary"}
            className='flex justify-between items-center gap-2 border w-full'
            onDragStart={(event) => onDragStart(event, taskType)}
            draggable
        >
            <div className="flex gap-2">
                <task.icon size={20} />
                {task.label}
            </div>
        </Button>
    )
}

export default TaskMenu;