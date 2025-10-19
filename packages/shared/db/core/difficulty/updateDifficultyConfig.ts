import { db } from "@db/pg";
import { DifficultyConfig, difficultyConfigTable } from "@db/schema";
import { eq } from "drizzle-orm";

type UpdateDifficultyConfigParams = Pick<
	DifficultyConfig,
	"id" | "difficultyConfig"
> & {
	resourceID?: number;
}

export async function updateDifficultyConfig({
	id,
	difficultyConfig,
	resourceID
}: UpdateDifficultyConfigParams) {
	const result = await db
		.update(difficultyConfigTable)
		.set({
			resourceID: resourceID,
			difficultyConfig,
			updatedAt: new Date()
		})
		.where(eq(difficultyConfigTable.id, id))
		.returning();

	return result[0];
}