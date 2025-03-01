import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  return session.user;
};

export const currentRole = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }
  // TODO
  return session.user.role;
};
