import { redis } from "@/db/redis";
import { db } from "@/db/pg";
import { usersTable } from "@/db/schema";
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
	await redis.set(cacheKey, result[0].secret);
	return result[0].secret;
};
