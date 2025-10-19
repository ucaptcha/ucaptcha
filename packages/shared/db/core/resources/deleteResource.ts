import { eq } from "drizzle-orm";
import { resourcesTable } from "@db/schema";
import { db } from "@db/pg";
import { getSiteFromID } from "@db/sites/getSite";
import { redis } from "@db/redis";

export async function deleteResource(id: number) {
	const [resource] = await db.delete(resourcesTable).where(eq(resourcesTable.id, id)).returning();

	const site = await getSiteFromID(resource.siteID);
	if (site === null) {
		return null;
	}

	const cacheKey = `ucaptcha:resource_id:${site.siteKey}-${resource.name}`;
	await redis.del(cacheKey);

	return resource;
}
