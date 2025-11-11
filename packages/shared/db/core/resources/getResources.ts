import { and, eq } from "drizzle-orm";
import { resourcesTable, sitesTable } from "../schema";
import { db } from "../pg";
import { redis } from "@db/redis";

export async function getResources(userID: number, siteID?: number) {
	const whereCond = siteID
		? and(eq(sitesTable.userID, userID), eq(resourcesTable.siteID, siteID))
		: eq(sitesTable.userID, userID);
	return db
		.select({
			id: resourcesTable.id,
			name: resourcesTable.name,
			siteID: resourcesTable.siteID,
			siteName: sitesTable.name,
			createdAt: resourcesTable.createdAt,
			updatedAt: resourcesTable.updatedAt
		})
		.from(resourcesTable)
		.innerJoin(sitesTable, eq(resourcesTable.siteID, sitesTable.id))
		.where(whereCond);
}

export async function getResource(id: number) {
	return db
		.select({
			id: resourcesTable.id,
			name: resourcesTable.name,
			siteID: resourcesTable.siteID,
			createdAt: resourcesTable.createdAt,
			updatedAt: resourcesTable.updatedAt
		})
		.from(resourcesTable)
		.where(eq(resourcesTable.id, id));
}

export async function getResourceID(siteKey: string, name: string) {
	const cacheKey = `ucaptcha:resource_id:${siteKey}-${name}`;
	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
		return Number.parseInt(cachedData);
	}

	const result = await db
		.select({ id: resourcesTable.id })
		.from(resourcesTable)
		.innerJoin(sitesTable, eq(resourcesTable.siteID, sitesTable.id))
		.where(and(eq(sitesTable.siteKey, siteKey), eq(resourcesTable.name, name)));

	if (result.length === 0) {
		return null;
	}

	await redis.setex(cacheKey, 3600, result[0].id);
	return result[0].id;
}

export const resourceBelongsToUser = (resourceID: number, userID: number) => {
	return db
		.select()
		.from(resourcesTable)
		.innerJoin(sitesTable, eq(resourcesTable.siteID, sitesTable.id))
		.where(and(eq(resourcesTable.id, resourceID), eq(sitesTable.userID, userID)));
};
