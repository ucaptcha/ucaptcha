import { Site, sitesTable } from "../schema";
import { db } from "../pg";
import { eq } from "drizzle-orm";

export async function updateSite(id: number, data: Pick<Site, "name">) {
	const [site] = await db.update(sitesTable).set(data).where(eq(sitesTable.id, id)).returning();

	return site;
}
