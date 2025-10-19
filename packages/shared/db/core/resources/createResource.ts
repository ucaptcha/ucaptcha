import { Resource, resourcesTable } from "../schema";
import { db } from "../pg";
import { and, eq } from "drizzle-orm";

export async function createResource(data: Pick<Resource, "siteID" | "name">) {
	const existingResource = await db
		.select()
		.from(resourcesTable)
		.where(and(eq(resourcesTable.name, data.name), eq(resourcesTable.siteID, data.siteID)));

	if (existingResource.length > 0) {
		return -1;
	}

	const [resource] = await db.insert(resourcesTable).values(data).returning();

	return resource;
}
