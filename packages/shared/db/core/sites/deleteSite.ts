import { sitesTable } from "../schema";
import { db } from "../pg";
import { eq } from "drizzle-orm";

export async function deleteSite(id: number) {
	const [site] = await db.delete(sitesTable).where(eq(sitesTable.id, id)).returning();

	return site;
}
