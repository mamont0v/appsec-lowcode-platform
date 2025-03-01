"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GetCredentialsForUser() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    return prisma.credential.findMany({
        where: { userId },
        orderBy: {
            name: "asc"
        }
    });
}