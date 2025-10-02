import { eq } from "drizzle-orm";
import { sitesTable } from "@/schema";
import { db } from "@/pg";
import { redis } from "@/redis";

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

export async function getUserIDFromSiteID(siteID: number) {
    const cacheKey = `ucaptcha:site_id_user:${siteID}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return Number.parseInt(cachedData);
    }
    const result = await db.select({ userID: sitesTable.userID }).from(sitesTable).where(eq(sitesTable.id, siteID));
    if (result.length === 0) {
        return null;
    }
    await redis.set(cacheKey, result[0].userID);
    return result[0].userID;
}