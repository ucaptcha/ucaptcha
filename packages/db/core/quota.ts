import { redis } from "./redis";
import { challengesLogTable, sitesTable, usersTable } from "./schema";
import { eq, count, gte, and } from "drizzle-orm";
import { db } from "./pg";

export const getUserQuota = async (uid: number, update: boolean): Promise<number> => {
	const cacheKey = `ucaptcha:quota:${uid}`;
	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
		update && (await redis.incr(cacheKey));
		return Number.parseInt(cachedData);
	}
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const num = await db
		.select({ count: count() })
		.from(challengesLogTable)
		.innerJoin(sitesTable, eq(challengesLogTable.siteID, sitesTable.id))
		.innerJoin(usersTable, eq(sitesTable.userID, usersTable.id))
		.where(and(eq(usersTable.id, uid), gte(challengesLogTable.createdAt, startOfMonth)));
	const secsToNextMonth =
		(new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() - now.getTime()) / 1000;
	await redis.setex(cacheKey, Math.round(secsToNextMonth), num[0].count);
	return num[0].count;
};