"use server";
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache'



export default async function DeleteWorkflow(workflowId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    await prisma.workflow.delete({
        where: {
            id: workflowId,
            userId
        }
    });

    revalidatePath("/app/workflows")

}

