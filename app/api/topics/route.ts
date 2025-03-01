// app/api/topics/route.js
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: "Please auth"
                },
                { status: 401 }

            )
        }
        // const userId = session.user.id;


        const topics = await prisma.topic.findMany();

        return new Response(JSON.stringify(topics), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Failed to load topics" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
