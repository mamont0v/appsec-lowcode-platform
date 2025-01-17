import { auth } from "@/auth";

export const useCurrentUser = () => {
  const session = auth();

  return session.data?.user;
};
