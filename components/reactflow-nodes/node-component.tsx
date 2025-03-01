/*
* Customize React Node
*/


import { NodeProps } from '@xyflow/react';
import React from 'react'
import NodeCard from './node-card';
import NodeHeader from './node-header';
import { AppNodeData } from '@/types/app-node';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { NodeInput, NodeInputs } from '@/components/reactflow-nodes/node-inputs';
import { NodeOutput, NodeOutputs } from './node-outputs';
import { Badge } from '../ui/badge';

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

const NodeComponent = React.memo((props: NodeProps) => {
    const nodeData = props.data as AppNodeData;

    const task = TaskRegistry[nodeData.type]

    return <NodeCard
        nodeId={props.id}
        isSelected={!!props.selected}>
        {DEV_MODE && <Badge className="text-xs text-gray-400">{props.id}</Badge>}
        <NodeHeader
            taskType={nodeData.type}
            nodeId={props.id}
        />

        <NodeInputs>
            {task.inputs.map(input => (
                <NodeInput
                    key={input.name}
                    input={input}
                    nodeId={props.id}
                />
            ))}
        </NodeInputs>

        <NodeOutputs>
            {task.outputs.map(output => (
                <NodeOutput
                    key={output.name}
                    output={output}
                />
            ))}
        </NodeOutputs>
    </NodeCard>
})


export default NodeComponent;
NodeComponent.displayName = "NodeComponents"; // потому что обернуть useMemo и нужно добавить имя