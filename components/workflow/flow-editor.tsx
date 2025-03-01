"use client";

import { CreateFlowNode } from '@/lib/workflow/create-flow-node';
import { TaskType } from '@/types/task';
import { Workflow } from '@prisma/client';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls, BackgroundVariant, useReactFlow, Connection, addEdge, Edge, getOutgoers, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect } from 'react'
import NodeComponent from '../reactflow-nodes/node-component';
import { AppNode } from '@/types/app-node';
import DeletableEdges from '../reactflow-edges/deletable-edge';
import { TaskRegistry } from '@/lib/workflow/task/registry';

// Создать другие узлы
const nodeTypes = {
    FlowScrapeNode: NodeComponent // FlowScrapeNode это имя нашего компонента, если мы хотим создать какой то другой компонент то нужно как в create-flow-node создать похожий объект
}

const edgeTypes = {
    default: DeletableEdges,
}

const snapGrid: [number, number] = [20, 20]
const fitViewOptions = { padding: 3 }

function FlowEditor({ workflow }: { workflow: Workflow }) {
    // Состояния для управления узлами и связями графа
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

    // Обновление состояния при изменении workflow.definition
    // https://v9.reactflow.dev/examples/drag-and-drop/
    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition)

            if (!flow) return;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            if (!flow.viewport) return;
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (error) { }
    }, [workflow.definition, setEdges, setNodes, setViewport])


    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const taskType = event.dataTransfer.getData("application/reactflow");
        if (typeof taskType === undefined || !taskType) return;

        // hook https://reactflow.dev/api-reference/types/react-flow-instance при перетаскивании элемента из бокового меню, чтобы передать координаты в потом ReactFlow, не забываем передать в useReactFlow
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        })

        const newNode = CreateFlowNode(taskType as TaskType, position); // position потому что CreateFlowNode ожидает две переменные, type и необязательный position
        setNodes((es) => es.concat(newNode)); // from  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);

    }, [screenToFlowPosition, setNodes]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // https://reactflow.dev/learn/customization/custom-nodes
    // Соединения в ReactFlow
    const onConnect = useCallback((connection: Connection) => {
        setEdges((edges) => addEdge({ ...connection, animated: true }, edges));

        // clear inputs and outputs when connected edges
        if (!connection.targetHandle) return;
        const node = nodes.find((nd) => nd.id === connection.target);
        if (!node) return;
        const nodeInputs = node.data.inputs;
        // delete nodeInputs[connection.targetHandle] // не работает удаление ключа вместо присвоения ему ""
        updateNodeData(node.id, {
            inputs: {
                ...nodeInputs,
                [connection.targetHandle]: "",
            }
        });


        // TODO: работает тоже

        // setNodes((prevNodes) =>
        //     prevNodes.map((node) => {
        //         if (node.id === connection.target) {
        //             const updatedInputs = {
        //                 ...node.data.inputs,
        //                 [connection.targetHandle]: "",
        //             };
        //             return {
        //                 ...node,
        //                 data: {
        //                     ...node.data,
        //                     inputs: updatedInputs,
        //                 },
        //             };
        //         }
        //         return node;
        //     })
        // );

        // console.log("Node connected:", node.id, "with inputs:", nodeInputs);
    },
        [setEdges, updateNodeData, nodes]
    );


    const isValidConnection = useCallback((connection: Edge | Connection) => {
        // Запрет соединения элементами блока самим с собой
        if (connection.source === connection.target) {
            return false;
        }

        // same taskparam type connection
        const source = nodes.find((node) => node.id === connection.source);
        const target = nodes.find((node) => node.id === connection.target);


        if (!source || !target) {
            return false;
        }

        const sourceTask = TaskRegistry[source.data.type];
        const targetTask = TaskRegistry[target.data.type];

        const output = sourceTask.outputs.find(
            (o) => o.name === connection.sourceHandle
        );
        const input = targetTask.inputs.find(
            (o) => o.name === connection.targetHandle
        );

        if (input?.type !== output?.type) {
            return false;
        }

        // Защита от зацикливания, чтобы нельзя было инпуты и аутпуты зациклить https://reactflow.dev/examples/interaction/prevent-cycles
        const hasCycle = (node: AppNode, visited = new Set()) => {
            if (visited.has(node.id)) return false;
            visited.add(node.id);

            for (const outgoer of getOutgoers(node, nodes, edges)) {
                if (outgoer.id === connection.source) return true;
                if (hasCycle(outgoer, visited)) return true;
            }
        };

        const detectedCycle = hasCycle(target);
        return !detectedCycle;
    }, [nodes, edges])


    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}

                // тоже самое
                // onEdgesChange={(changes) => {
                //     onEdgesChange(changes)
                //     saveMutation.mutate({
                //         workflowId,
                //         definition
                //     })
                // }}
                nodeTypes={nodeTypes} // стилизация блоков
                edgeTypes={edgeTypes} // стилизация линий
                // snapToGrid // equal snapToGrid={true}
                // snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                //fitView // if uncomment this, we centered worfklow after restart page 

                onConnect={onConnect}
                isValidConnection={isValidConnection} // запрещает соединять 
                // drag button from sidebar.js
                onDragOver={onDragOver}
                onDrop={onDrop}
                proOptions={{ hideAttribution: true }}
            >
                <Controls
                    position='top-left'
                    fitViewOptions={fitViewOptions}
                    showZoom
                />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <MiniMap
                    position='top-right'
                    className='!bg-background'
                    zoomable
                    pannable

                />
            </ReactFlow>
        </main >
    )
}

export default FlowEditor;