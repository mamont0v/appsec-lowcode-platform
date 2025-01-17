// app/api/topics/route.js
import { getAuthSession } from "@/lib/nextauth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
    try {

        // check auth
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "Please auth"
                },
                { status: 401 }

            )
        }

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
