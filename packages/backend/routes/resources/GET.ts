import { Context } from "hono";
import { errorResponse } from "@/lib/common";
import { AuthStore } from "@/middleware/auth";
import { getResources } from "@db/resources";

export async function getResourcesHandler(c: Context<{ Variables: AuthStore }>) {
	try {
		const payload = c.get("authPayload");
		const siteIDParam = c.req.query("siteID");
		const siteID = siteIDParam ? parseInt(siteIDParam) : undefined;
		const userID = payload.userID;

		const resources = await getResources(userID, siteID);

		return c.json({ resources });
	} catch (error) {
		console.error("Error fetching resources:", error);
		return errorResponse(c, "Failed to fetch resources", 500);
	}
}
