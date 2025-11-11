import { redis } from "../redis";
import { db } from "../pg";
import { usersTable } from "../schema";
import { eq } from "drizzle-orm";

export const getJWTSecretForUser = async (uid: number) => {
	const cacheKey = `ucaptcha:jwt_secret:${uid}`;
	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
		return cachedData;
	}
	const result = await db.select({ secret: usersTable.jwtSecret }).from(usersTable).where(eq(usersTable.id, uid));
	if (result.length === 0) {
		return null;
	}
	await redis.setex(cacheKey, 3600, result[0].secret);
	return result[0].secret;
};
