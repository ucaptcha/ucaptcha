import { db } from "@db/pg";
import { difficultyConfigTable, sitesTable, resourcesTable } from "@db/schema";
import { eq, and, isNull } from "drizzle-orm";

export interface DifficultyConfigWithRelations {
	id: number;
	siteID: number;
	resourceID: number | null;
	difficultyConfig: {
		default: number;
		custom: {
			timeRange: number;
			threshold: number;
			difficulty: number;
		}[];
	};
	createdAt: Date;
	updatedAt: Date;
	siteName: string;
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