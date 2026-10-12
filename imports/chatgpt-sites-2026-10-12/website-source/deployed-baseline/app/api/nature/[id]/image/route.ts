import { env } from "cloudflare:workers";
import { and,eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { natureEntries } from "../../../../../db/schema";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const{id}=await params;const numericId=Number(id);if(!Number.isInteger(numericId))return new Response("Not found",{status:404});const[row]=await getDb().select().from(natureEntries).where(and(eq(natureEntries.id,numericId),eq(natureEntries.status,"approved"))).limit(1);if(!row)return new Response("Not found",{status:404});const object=await env.BUCKET.get(row.objectKey);if(!object)return new Response("Not found",{status:404});const headers=new Headers({"Cache-Control":"public, max-age=3600","X-Content-Type-Options":"nosniff"});object.writeHttpMetadata(headers);return new Response(object.body,{headers})}
