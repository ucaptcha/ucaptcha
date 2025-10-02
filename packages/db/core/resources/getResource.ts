import { eq, and } from "drizzle-orm";
import { resourcesTable, sitesTable } from "@/schema";
import { db } from "@/pg";
import { redis } from "@/redis";

export async function getResourceID(siteKey: string, name: string) {
    const cacheKey = `ucaptcha:resource_id:${siteKey}-${name}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return Number.parseInt(cachedData);
    }
    
    const result = await db
        .select({ id: resourcesTable.id })
        .from(resourcesTable)
        .innerJoin(sitesTable, eq(resourcesTable.siteId, sitesTable.id))
        .where(and(
            eq(sitesTable.siteKey, siteKey),
            eq(resourcesTable.name, name)
        ));
    
    if (result.length === 0) {
        return null;
    }
    
    await redis.set(cacheKey, result[0].id);
    return result[0].id;
}
