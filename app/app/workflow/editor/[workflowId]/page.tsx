import { auth } from '@/auth';
import React from 'react'
import { prisma } from '@/lib/db';
import { waitFor } from '@/lib/helper/waitFor';
import Editor from '@/components/workflow/editor';

async function EditorPage({ params }: { params: { workflowId: string } }) {
    // Проверка пользователя чтобы только он имел доступ к своим рабочим процессам

    const { workflowId } = await params;

    const session = await auth();
    if (!session) {
        throw new Error("unauthenticated");
    }
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("canot find user id");
    }

    // TODO: skeleton istead of loader prev
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

export default EditorPage;