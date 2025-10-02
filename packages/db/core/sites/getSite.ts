import { eq } from "drizzle-orm";
import { Site, sitesTable } from "../schema";
import { db } from "../pg";
import { redis } from "../redis";

export async function getSiteByKey(siteKey: string) {
	const cacheKey = `ucaptcha:site:key_${siteKey}`;
	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
		return JSON.parse(cachedData) as Site;
	}
	const result = await db.select().from(sitesTable).where(eq(sitesTable.siteKey, siteKey));
	if (result.length === 0) {
		return null;
	}
	await redis.set(cacheKey, JSON.stringify(result[0]));
	return result[0];
}

export const getSiteIDFromKey = async (siteKey: string) => {
	const result = await getSiteByKey(siteKey);
	if (result === null) {
		return null;
	}
	return result.id;
};
