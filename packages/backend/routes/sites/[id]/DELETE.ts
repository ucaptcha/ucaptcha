import { Context } from "hono";
import { eq, and } from "drizzle-orm";
import { sitesTable } from "@db/schema";
import { db } from "@db/pg";
import { verifyAuthToken } from "@shared/auth/jwt";
import { errorResponse } from "@/lib/common";

export async function deleteSite(c: Context) {
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

		const siteID = parseInt(c.req.param("id"));
		if (isNaN(siteID)) {
			return errorResponse(c, "Invalid site ID", 400);
		}

		const [deletedSite] = await db
			.delete(sitesTable)
			.where(and(
				eq(sitesTable.id, siteID),
				eq(sitesTable.userID, payload.userID)
			))
			.returning();

		if (!deletedSite) {
			return errorResponse(c, "Site not found or access denied", 404);
		}

		return c.json({ message: "Site deleted successfully" });
	} catch (error) {
		console.error("Error deleting site:", error);
		return errorResponse(c, "Failed to delete site", 500);
	}
}