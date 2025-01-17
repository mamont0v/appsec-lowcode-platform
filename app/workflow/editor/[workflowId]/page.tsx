import { auth } from '@/auth';
import React from 'react'
import { prisma } from '@/lib/db';
import { waitFor } from '@/lib/helper/waitFor';
import Editor from '@/components/workflow/editor';

async function EditorPage({ params }: { params: { workflowId: string } }) {
    const { workflowId } = await params;
    const session = await auth();

    // Проверка на наличие session и session.user?.id
    if (!session || !session.user?.id) {
        return <div>Что-то случилось попробуйте позже</div>;
    }

    const userId = session.user.id;

    // debug skeleton
    // await waitFor(5000);

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId
        }
    })

    if (!workflow) {
        return <div>У вас нет рабочих процессов</div>
    }



    return (
        <Editor workflow={workflow} />
    )
}

export default EditorPage