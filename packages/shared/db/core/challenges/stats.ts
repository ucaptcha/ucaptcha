import { db } from "../pg";
import { challengesLogTable } from "../schema";
import { count, eq, and, gte } from "drizzle-orm";

export async function getSolvedChallengesInLastMonthByUser(uid: number) {
	const monthAgo = new Date();
	monthAgo.setMonth(monthAgo.getMonth() - 1);
	const correctlyAnswered = await db
		.select({ count: count() })
		.from(challengesLogTable)
		.where(
			and(
				eq(challengesLogTable.userID, uid),
				eq(challengesLogTable.correctlyAnswered, true),
				gte(challengesLogTable.createdAt, monthAgo)
			)
		);
	return correctlyAnswered[0].count;
}

export async function getChallengesGeneratedInLastMonthByUser(uid: number) {
	const monthAgo = new Date();
	monthAgo.setMonth(monthAgo.getMonth() - 1);
	const generated = await db
		.select({ count: count() })
		.from(challengesLogTable)
		.where(
			and(eq(challengesLogTable.userID, uid), gte(challengesLogTable.createdAt, monthAgo))
		);
	return generated[0].count;
}
