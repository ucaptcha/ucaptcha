import { Site, sitesTable } from "../schema";
import { db } from "../pg";
import { generate } from "@alikia/random-key";

export async function createSite(data: Pick<Site, "name" | "userID">) {
	const siteKey = await generate(8);
	const [site] = await db
		.insert(sitesTable)
		.values({ ...data, siteKey })
		.returning();
	return site;
}
