import { eq } from "drizzle-orm";
import { sitesTable } from "@/db/schema";
import { db } from "@/db/pg";
import { redis } from "@/db/redis";

export async function getSiteIDFromKey(siteKey: string) {
    const cacheKey = `ucaptcha:site_id:${siteKey}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return Number.parseInt(cachedData);
    }
	const result = await db.select().from(sitesTable).where(eq(sitesTable.siteKey, siteKey));
    if (result.length === 0) {
        return null;
    }
    await redis.set(cacheKey, result[0].id);
	return result[0].id;
}
