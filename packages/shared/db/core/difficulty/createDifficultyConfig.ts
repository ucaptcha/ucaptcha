import { db } from "@db/pg";
import { DifficultyConfig, difficultyConfigTable } from "@db/schema";

type CreateDifficultyConfigParams = Pick<
	DifficultyConfig,
	"siteID" | "resourceID" | "difficultyConfig"
>;

export async function createDifficultyConfig({
	siteID,
	resourceID,
	difficultyConfig
}: CreateDifficultyConfigParams) {
	const result = await db
		.insert(difficultyConfigTable)
		.values({
			siteID,
			resourceID,
			difficultyConfig: difficultyConfig
		})
		.returning();

	return result[0];
}
