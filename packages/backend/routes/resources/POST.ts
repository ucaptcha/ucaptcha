import { Context } from "hono";
import { and, eq } from "drizzle-orm";
import { resourcesTable } from "@db/schema";
import { db } from "@db/pg";
import { errorResponse } from "@/lib/common";
import { siteBelongsToUser } from "@db/sites/getSite";
import { AuthStore } from "@/middleware/auth";
import { createResource } from "@db/resources";

export async function createResourceHandler(c: Context<{ Variables: AuthStore }>) {
	try {
		const payload = c.get("authPayload");

		const body = await c.req.json();
		const { name, siteID } = body;

		if (!name || !siteID) {
			return errorResponse(c, "Resource name and site ID are required", 400);
		}

		// Verify that the site belongs to the user
		const siteValid = await siteBelongsToUser(siteID, payload.userID);

		if (!siteValid) {
			return errorResponse(c, "Site not found or access denied", 404);
		}

		const resource = await createResource({
			siteID,
			name
		});

		if (resource === -1) {
			return errorResponse(c, "Resource with this name already exists for this site", 400);
		}

		return c.json({ resource }, 201);
	} catch (error) {
		console.error("Error creating resource:", error);
		return errorResponse(c, "Failed to create resource", 500);
	}
}
