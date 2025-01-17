
import Topbar from '@/components/workflow/topbar/topbar';
import React, { Suspense } from 'react'
import Loading from './loading';
import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/get-workflow-execution-with-phases';
import ExecutionViewer from '@/components/execution/execution-viewer';


async function ExecutionViewerPage({
    params
}: {
    params: {
        executionId: string,
        workflowId: string
    }
}) {
    const { executionId, workflowId } = await params;

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Topbar
                workflowId={workflowId}
                title="Workflow run detailed"
                subtitle={`ID: ${executionId}`}
                hideButtons
            />
            <section className="flex h-full overflow-auto">
                <Suspense fallback={<Loading />}>
                    <ExecutionViewerWrapper executionId={executionId} />
                </Suspense>
            </section>
        </div>
    );
}

async function ExecutionViewerWrapper({
    executionId
}: {
    executionId: string;
}) {
    const workflowExecution = await GetWorkflowExecutionWithPhases({ executionId })

    if (!workflowExecution) {
        return <div>Execution not found</div>
    }

    return (<ExecutionViewer initialData={workflowExecution} />);
}

export default ExecutionViewerPage;

