import { Context } from "hono";
import { and, eq } from "drizzle-orm";
import { resourcesTable, sitesTable } from "@db/schema";
import { db } from "@db/pg";
import { errorResponse } from "@/lib/common";
import { deleteResource } from "@db/resources";
import { AuthStore } from "@/middleware/auth";

export async function deleteResourceHandler(c: Context<{ Variables: AuthStore }>) {
	try {
		const payload = c.get("authPayload");

		const resourceId = parseInt(c.req.param("id"));
		if (isNaN(resourceId)) {
			return errorResponse(c, "Invalid resource ID", 400);
		}

		// Get the resource first to check ownership
		const resource = await db
			.select()
			.from(resourcesTable)
			.where(eq(resourcesTable.id, resourceId));

		if (resource.length === 0) {
			return errorResponse(c, "Resource not found", 404);
		}

		// Verify the user owns the site
		const site = await db
			.select()
			.from(sitesTable)
			.where(
				and(eq(sitesTable.id, resource[0].siteID), eq(sitesTable.userID, payload.userID))
			);

		if (site.length === 0) {
			return errorResponse(c, "Access denied", 403);
		}

		await deleteResource(resourceId);

		return c.json({ message: "Resource deleted successfully" });
	} catch (error) {
		console.error("Error deleting resource:", error);
		return errorResponse(c, "Failed to delete resource", 500);
	}
}
