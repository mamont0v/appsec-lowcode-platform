"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { symmetricEncryptData } from "@/lib/encryption";

import { createCredentialSchema, createCredentialSchemaType } from "@/schemas/credentials";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: createCredentialSchemaType) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("unauthenticated");
    }
    const userId = session.user.id;

    const { success, data } = createCredentialSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid form data");
    }

    const encryptValue = symmetricEncryptData(data.value);

    const result = await prisma.credential.create({
        data: {
            userId,
            name: data.name,
            value: encryptValue // "iv:encryptedData:authTag"
        }
    })

    if (!result) {
        throw Error("failed to create credentials");
    }

    revalidatePath("/app/credentials");
}
