import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { natureEntries } from "../../../../../../db/schema";
import { authorizeAdmin } from "../../../../../../lib/admin-auth";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){const authorization=await authorizeAdmin(request.headers.get("cf-access-jwt-assertion"));if(!authorization.authorized)return Response.json({error:authorization.message},{status:authorization.status});const{id}=await params;const[row]=await getDb().select().from(natureEntries).where(eq(natureEntries.id,Number(id))).limit(1);if(!row)return new Response("Not found",{status:404});const object=await env.BUCKET.get(row.objectKey);if(!object)return new Response("Not found",{status:404});const headers=new Headers({"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"});object.writeHttpMetadata(headers);return new Response(object.body,{headers})}
