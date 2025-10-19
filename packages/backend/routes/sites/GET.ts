import { Context } from "hono";
import { eq } from "drizzle-orm";
import { sitesTable } from "@db/schema";
import { db } from "@db/pg";
import { verifyAuthToken } from "@shared/auth/jwt";
import { errorResponse } from "@/lib/common";

export async function getSites(c: Context) {
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

		const sites = await db
			.select()
			.from(sitesTable)
			.where(eq(sitesTable.userID, payload.userID));

		return c.json({ sites });
	} catch (error) {
		console.error("Error fetching sites:", error);
		return errorResponse(c, "Failed to fetch sites", 500);
	}
}
