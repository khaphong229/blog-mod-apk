import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;
}

export async function isEditor() {
  const user = await getCurrentUser();
  return (
    user?.role === Role.EDITOR ||
    user?.role === Role.ADMIN ||
    user?.role === Role.SUPER_ADMIN
  );
}
