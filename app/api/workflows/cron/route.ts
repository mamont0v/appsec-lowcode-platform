import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { WorkflowStatus } from "@/types/workflow";
import { getAppUrl } from "@/lib/helper/appUrl";
import axios from 'axios';

export async function GET(req: Request) {
    const now = new Date();

    const workflows = await prisma.workflow.findMany({
        select: { id: true },
        where: {
            status: WorkflowStatus.PUBLISHED,
            cron: { not: null },
            nextRunAt: { lte: now },
        }
    })

    for (const workflow of workflows) {
        triggerWorkflow(workflow.id)
    }

    return Response.json({ worflowsToRun: workflows.length }, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
    const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);

    axios.get(triggerApiUrl, {
        headers: {
            Authorization: `Bearer ${process.env.API_SECRET!}`
        }
    }).catch((error) => {
        console.error(error)
    })

    // fetch(triggerApiUrl, {
    //     headers: {
    //         Authorization: `Bearer ${process.env.API_SECRET!}`
    //     },
    //     cache: "no-store"
    // }).catch((error) => {
    //     console.log(error)
    // })
}







