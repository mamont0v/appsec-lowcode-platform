import crypto from 'crypto';
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { WorkflowExecutionPhaseTrigger, WorkflowExecutionPlan, WorkflowExecutionStatus } from '@/types/workflow';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { ExecuteWorkflow } from '@/lib/workflow/execute-workflow';
import parser from "cron-parser";

function isValidSecret(secret: string) {
    const API_SECRET = process.env.API_SECRET;
    if (!API_SECRET) {
        throw new Error("API_SECRET is not set");
    }

    try {
        // Use a constant-time comparison to prevent timing attacks
        return crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
    } catch (err) {
        return false;
    }

}


export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {

        return Response.json(
            {
                error: "Unauth"
            },
            {
                status: 401
            })
    }
    const secret = authHeader.split(" ")[1];

    if (!isValidSecret(secret)) {
        return Response.json({ error: "Unauth" }, { status: 401 })
    }

    // получаем workflowId из URL
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId") as string;

    if (!workflowId) {
        return Response.json({ error: "bad req" }, { status: 400 })
    }

    // находим по нему в бд инфу
    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId }
    })

    if (!workflow) {
        return Response.json({
            error: "bad req"
        },
            { status: 400 }
        )
    }

    // разбираем
    const executionPlan = JSON.parse(
        workflow.executionPlan!
    ) as WorkflowExecutionPlan

    if (!executionPlan) {
        return Response.json({ error: "bad req" }, { status: 400 })
    }

    try {
        const cron = parser.parseExpression(workflow.cron!, { utc: true })
        const nextRun = cron.next().toDate();
        const execution = await prisma.workflowExecution.create({
            data: {
                workflowId,
                userId: workflow.userId,
                definition: workflow.definition,
                status: WorkflowExecutionStatus.PENDING,
                startedAt: new Date(),
                trigger: WorkflowExecutionPhaseTrigger.CRON,
                phases: {
                    create: executionPlan.flatMap((phase, index) => {
                        return phase.nodes.flatMap((node) => {
                            return {
                                userId: workflow.userId,
                                status: WorkflowExecutionStatus.COMPLETED,
                                number: phase.phase,
                                node: JSON.stringify(node),
                                name: TaskRegistry[node.data.type].label,
                            };
                        });
                    }),
                },
            }
        })

        await ExecuteWorkflow(execution.id, nextRun);
        return new Response(null, { status: 200 })
    } catch (error) {
        return Response.json({ error: "Internal server error" }, { status: 500 })

    }

}