"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";



export async function GetAvailableCredits() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const balance = await prisma.userBalance.findUnique({
        where: { userId },
    });

    if (!balance) return 0;
    return balance.credits;
}