import { db } from "@db/pg";
import { difficultyConfigTable } from "@db/schema";
import { eq } from "drizzle-orm";

export async function deleteDifficultyConfig(id: number) {
	const result = await db
		.delete(difficultyConfigTable)
		.where(eq(difficultyConfigTable.id, id))
		.returning();

	return result[0];
}