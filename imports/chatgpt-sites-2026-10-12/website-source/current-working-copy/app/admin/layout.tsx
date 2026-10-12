import type { ReactNode } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authorizeAdmin } from "../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const authorization = await authorizeAdmin(
    (await headers()).get("cf-access-jwt-assertion")
  );

  if (!authorization.authorized) {
    if (authorization.status === 503) {
      throw new Error(authorization.message);
    }
    notFound();
  }

  return children;
}
