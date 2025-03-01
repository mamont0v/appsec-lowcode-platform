"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";



export async function SetupUser() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const balance = await prisma.userBalance.findUnique({
        where: { userId },
    });

    if (!balance) {
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 100
            }
        })
    };

}