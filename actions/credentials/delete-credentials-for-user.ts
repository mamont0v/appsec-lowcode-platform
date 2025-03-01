"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function DeleteCredentialsForUser(name: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    await prisma.credential.delete({
        where: {
            userId_name: {
                userId,
                name
            }
        },

    })

    revalidatePath("/app/credentials")
}