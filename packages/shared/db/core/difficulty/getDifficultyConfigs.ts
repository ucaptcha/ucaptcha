import { db } from "@db/pg";
import { difficultyConfigTable, sitesTable, resourcesTable, DifficultyConfig } from "@db/schema";
import { eq, and } from "drizzle-orm";

export type DifficultyConfigWithRelations = DifficultyConfig & {
	siteName: string | null;
	resourceName: string | null;
}

export async function getDifficultyConfigs(userID: number, siteID?: number): Promise<DifficultyConfigWithRelations[]> {
	const conditions = [eq(sitesTable.userID, userID)];
	
	if (siteID) {
		conditions.push(eq(difficultyConfigTable.siteID, siteID));
	}

	return db
		.select({
			id: difficultyConfigTable.id,
			siteID: difficultyConfigTable.siteID,
			resourceID: difficultyConfigTable.resourceID,
			difficultyConfig: difficultyConfigTable.difficultyConfig,
			createdAt: difficultyConfigTable.createdAt,
			updatedAt: difficultyConfigTable.updatedAt,
			siteName: sitesTable.name,
			resourceName: resourcesTable.name
		})
		.from(difficultyConfigTable)
		.leftJoin(sitesTable, eq(difficultyConfigTable.siteID, sitesTable.id))
		.leftJoin(resourcesTable, eq(difficultyConfigTable.resourceID, resourcesTable.id))
		.where(and(...conditions));
}