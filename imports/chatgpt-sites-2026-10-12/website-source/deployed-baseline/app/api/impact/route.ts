import { count,eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { gratitudes } from "../../../db/schema";
export async function GET(){try{const[result]=await getDb().select({total:count()}).from(gratitudes).where(eq(gratitudes.status,"approved"));const total=result?.total??0;return Response.json({gratitudeTotal:total,towardNextTree:total%100,treesUnlocked:Math.floor(total/100)})}catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to load impact progress."},{status:500})}}
