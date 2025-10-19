import { eq } from "drizzle-orm";
import { Resource, resourcesTable } from "../schema";
import { db } from "../pg";
import { redis } from "@db/redis";
import { getSiteFromID } from "@db/sites/getSite";

export async function updateResource(id: number, data: Partial<Resource>) {
	const [resource] = await db
		.update(resourcesTable)
		.set(data)
		.where(eq(resourcesTable.id, id))
		.returning();

	const s = await getSiteFromID(resource.siteID);
	if (!s) {
		return null;
	}
	const { siteKey } = s;
	const cacheKey = `ucaptcha:resource_id:${siteKey}-${resource.name}`;
	await redis.set(cacheKey, JSON.stringify(data));

	return resource;
}
