"use client";

import { TaskRegistry } from '@/lib/workflow/task/registry';
import { TaskType } from '@/types/task';
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/app-node';
import { CreateFlowNode } from '@/lib/workflow/create-flow-node';

function NodeHeader({
    taskType,
    nodeId
}: {
    taskType: TaskType,
    nodeId: string
}) {
    const task = TaskRegistry[taskType];
    const { deleteElements, getNode, addNodes } = useReactFlow(); // from reactflow


    return (
        <div className='flex items-center gap-2 p-2'>
            <task.icon size={16} />
            <div className="flex justify-between items-center w-full">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                    {task.label}
                </p>
                <div className="flex gap-1 items-center">

                    {task.isEntryPoint && <Badge>Начало</Badge>}

                    <Badge className="gap-2 flex items-center text-xs">
                        <CoinsIcon size={16} />
                        {task.credits}
                    </Badge>
                    {/* Delete badge and copy buttons for non-entry point */}
                    {!task.isEntryPoint && (
                        <>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={() => {
                                    deleteElements({
                                        nodes: [{ id: nodeId }]
                                    })
                                }}
                            >
                                <TrashIcon size={12} />
                            </Button>

                            {/* copy button react flow private feature*/}
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={() => {
                                    const node = getNode(nodeId) as AppNode
                                    const newX = node.position.x;
                                    const newY = node.position.y + node.measured?.height! + 20;
                                    const newNode = CreateFlowNode(node.data.type, {
                                        x: newX,
                                        y: newY
                                    });
                                    addNodes([newNode]);
                                }}
                            >
                                <CopyIcon size={12} />
                            </Button>
                        </>
                    )}

                    <Button variant={"ghost"} size={"icon"} className='drag-handle cursor-grab'>
                        <GripVerticalIcon size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NodeHeader;