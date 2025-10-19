import type { BlankEnv } from "hono/types";
import { Context, Next } from "hono";
import { RateLimiter } from "@koshnic/ratelimit";
import { redis } from "@db/redis";
import { db } from "@db/pg";
import { challengesLogTable, sitesTable, usersTable } from "@db/schema";
import { eq, count, gte, and } from "drizzle-orm";
import { errorResponse } from "@/lib/common";

export const getUserQuota = async (uid: number) => {
	const cacheKey = `ucaptcha:quota:${uid}`;
	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
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

export const newChallengeRateLimiter = async (
	c: Context<BlankEnv, "/challenge/new", {}>,
	next: Next
) => {
	const limiter = new RateLimiter(redis);
	const params = c.req.query();
	const siteKey = params.siteKey;
	if (!siteKey) {
		return errorResponse(c, "Missing query parameters.", 400);
	}
	const site = await db.select().from(sitesTable).where(eq(sitesTable.siteKey, siteKey));
	if (site.length === 0) {
		return errorResponse(c, "Given siteKey does not exist.", 404);
	}
	const userID = site[0].userID;
	const identifier = `qps-limit-${userID}`;
	const { allowed, retryAfter } = await limiter.allowPerSecond(identifier, 50);

	if (!allowed) {
		return errorResponse(
			c,
			`Too many requests, please retry after ${Math.round(retryAfter)} seconds.`,
			429
		);
	}

	const quota = await getUserQuota(userID);
	if (quota >= 1000000) {
		return errorResponse(c, "You have reached your quota for this month.", 429);
	}
	await redis.incr(`ucaptcha:quota:${userID}`);
	await next();
};
