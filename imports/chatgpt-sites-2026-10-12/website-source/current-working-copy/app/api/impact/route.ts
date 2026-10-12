import { count,eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { gratitudes,kindnessEntries,natureEntries } from "../../../db/schema";

function milestone(total:number){return {total,towardNext:total%100,completed:Math.floor(total/100),remaining:100-(total%100)};}
export async function GET(){try{const db=getDb();const[g,k,n]=await Promise.all([db.select({total:count()}).from(gratitudes).where(eq(gratitudes.status,"approved")),db.select({total:count()}).from(kindnessEntries).where(eq(kindnessEntries.status,"approved")),db.select({total:count()}).from(natureEntries).where(eq(natureEntries.status,"approved"))]);return Response.json({gratitude:milestone(g[0]?.total??0),kindness:milestone(k[0]?.total??0),nature:milestone(n[0]?.total??0)})}catch(error){return Response.json({error:error instanceof Error?error.message:"Unable to load impact progress."},{status:500})}}
