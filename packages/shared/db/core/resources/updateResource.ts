import { eq } from "drizzle-orm";
import { Resource, resourcesTable } from "../schema";
import { db } from "../pg";
import { redis } from "@db/redis.ts";
import { getSiteFromID } from "@db/sites/getSite.ts";

export async function updateResource(id: number, data: Partial<Resource>) {
	const [resource] = await db
		.update(resourcesTable)
		.set(data)
		.where(eq(resourcesTable.id, id))
		.returning();

	const { siteKey } = await getSiteFromID(resource.siteID);
	const cacheKey = `ucaptcha:resource_id:${siteKey}-${resource.name}`;
	await redis.set(cacheKey, JSON.stringify(data));

	return resource;
}
