import { auth } from "@/auth";

export const useCurrentRole = () => {
  const session = auth();

  return session.data?.user.role;
};
