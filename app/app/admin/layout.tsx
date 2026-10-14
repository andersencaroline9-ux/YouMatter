import type { ReactNode } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authorizeAdmin } from "../../lib/admin-auth";
import { LOCAL_ADMIN_PROOF_HEADER } from "../../lib/local-admin-auth-proof";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const requestHeaders = await headers();
  const authorization = await authorizeAdmin(
    requestHeaders.get("cf-access-jwt-assertion"),
    requestHeaders.get(LOCAL_ADMIN_PROOF_HEADER)
  );

  if (!authorization.authorized) {
    if (authorization.status === 503) {
      throw new Error(authorization.message);
    }
    notFound();
  }

  return children;
}
