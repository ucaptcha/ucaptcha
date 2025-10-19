import { and, eq } from "drizzle-orm";
import { Site, sitesTable } from "@db/schema";
import { db } from "@db/pg";
import { redis } from "@db/redis";

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

export const getSiteFromID = async (id: number) => {
	const cacheKey = `ucaptcha:site:id_${id}`;
	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
		return JSON.parse(cachedData) as Site;
	}
	const result = await db.select().from(sitesTable).where(eq(sitesTable.id, id));
	if (result.length == 0) {
		return null;
	}
	await redis.set(cacheKey, JSON.stringify(result[0]));
	return result[0];
};

export const siteBelongsToUser = async (siteID: number, userID: number) => {
	const rows = await db
		.select()
		.from(sitesTable)
		.where(and(eq(sitesTable.id, siteID), eq(sitesTable.userID, userID)));
	return rows.length > 0;
};

export async function getSites(userID: number) {
	return db.select().from(sitesTable).where(eq(sitesTable.userID, userID));
}
