import { Context } from "hono";
import { and, eq } from "drizzle-orm";
import { sitesTable } from "@db/schema";
import { db } from "@db/pg";
import { errorResponse } from "@/lib/common";
import { getResource, updateResource } from "@db/resources";
import { AuthStore } from "@/middleware/auth";

export async function updateResourceHandler(c: Context<{ Variables: AuthStore }>) {
	try {
		const payload = c.get("authPayload");

		const resourceId = parseInt(c.req.param("id"));
		if (isNaN(resourceId)) {
			return errorResponse(c, "Invalid resource ID", 400);
		}

		const body = await c.req.json();
		const { name } = body;

		if (!name) {
			return errorResponse(c, "Resource name is required", 400);
		}

		const [resource] = await getResource(resourceId);

		// Verify the user owns the site
		const site = await db
			.select()
			.from(sitesTable)
			.where(and(eq(sitesTable.id, resource.siteID), eq(sitesTable.userID, payload.userID)));

		if (site.length === 0) {
			return errorResponse(c, "Access denied", 403);
		}

		// Verify that the resource belongs to a site owned by the user
		const updatedResource = await updateResource(resourceId, { name, updatedAt: new Date() });

		if (!updatedResource) {
			return errorResponse(c, "Resource not found", 404);
		}

		if (!updatedResource) {
			return errorResponse(c, "Resource not found or access denied", 404);
		}

		return c.json({ resource: updatedResource });
	} catch (error) {
		console.error("Error updating resource:", error);
		return errorResponse(c, "Failed to update resource", 500);
	}
}
