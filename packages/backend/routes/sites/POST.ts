import { Context } from "hono";
import { sitesTable } from "@db/schema";
import { db } from "@db/pg";
import { verifyAuthToken } from "@shared/auth/jwt";
import { errorResponse } from "@/lib/common";
import { generate as randomKey } from "@alikia/random-key";

export async function createSite(c: Context) {
	try {
		const authHeader = c.req.header("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return errorResponse(c, "Unauthorized", 401);
		}

		const token = authHeader.substring(7);
		const { payload } = await verifyAuthToken(token);
		
		if (!payload) {
			return errorResponse(c, "Invalid token", 401);
		}

		const body = await c.req.json();
		const { name } = body;

		if (!name) {
			return errorResponse(c, "Site name is required", 400);
		}

		// Generate a unique site key
		const siteKey = await randomKey(8);

		const [site] = await db
			.insert(sitesTable)
			.values({
				name,
				siteKey,
				userID: payload.userID
			})
			.returning();

		return c.json({ site });
	} catch (error) {
		console.error("Error creating site:", error);
		return errorResponse(c, "Failed to create site", 500);
	}
}