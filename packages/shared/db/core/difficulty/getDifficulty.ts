import { redis } from "@db/redis";
import { db } from "@db/pg";
import { eq, and } from "drizzle-orm";
import { difficultyConfigTable, DifficultyConfig } from "@db/schema";

export async function getDifficultyConfig(
	siteID: number,
	resourceID: number
): Promise<DifficultyConfig | null> {
	const resourceCacheKey = resourceID ? `-${resourceID}` : "";
	const cacheKey = `ucaptcha:difficulty_config:${siteID}${resourceCacheKey}`;

	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
		return JSON.parse(cachedData);
	}

	let data: DifficultyConfig[];
	const siteIDEq = eq(difficultyConfigTable.siteID, siteID);
	const resourceIDEq = eq(difficultyConfigTable.resourceID, resourceID);
	data = await db.select().from(difficultyConfigTable).where(and(siteIDEq, resourceIDEq));
	if (!data[0]) {
		data = await db.select().from(difficultyConfigTable).where(siteIDEq);
	}
	if (!data[0]) {
		return null;
	}
	await redis.setex(cacheKey, 3600, JSON.stringify(data[0]));
	return data[0];
}
