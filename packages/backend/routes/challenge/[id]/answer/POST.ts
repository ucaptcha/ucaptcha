import { Context } from "hono";
import { redis } from "@db/redis";
import { errorResponse } from "@/lib/common.ts";
import { getChallengeByID, updateChallengeStatus, verifyChallenge } from "@/lib/challenge";
import { sign } from "hono/jwt";
import { getJWTSecretForUser } from "@db/jwt/getSecret";
import { db } from "@db/pg";
import { challengesLogTable } from "@db/schema";
import { eq } from "drizzle-orm";

const challengeKey = (id: string) => `ucaptcha:challenge:${id}`;

export const answerChallenge = async (c: Context<null, "/challenge/:id/answer", null>) => {
	const id = c.req.param("id");
	const challenge = await getChallengeByID(id);
	if (!challenge) {
		return errorResponse(c, "Challenge not found.", 404);
	}
	if (challenge.status === "used") {
		return errorResponse(c, "Challenge is invalid.", 400);
	}
	const body = await c.req.json();
	if (!body) {
		return errorResponse(c, "Missing body.", 400);
	}
	const answer = body.answer;
	if (!answer) {
		return errorResponse(c, "Missing answer.", 400);
	}
	const isCorrect = await verifyChallenge(challenge, answer);
	const currentTTL = await redis.ttl(challengeKey(id));
	await db
		.update(challengesLogTable)
		.set({ answeredAt: new Date() })
		.where(eq(challengesLogTable.challengeID, id));
	if (!isCorrect) {
		await updateChallengeStatus(id, "failed");
		return errorResponse(c, "Incorrect answer.", 403);
	}
	const NOW = Math.floor(Date.now() / 1000);
	const FIVE_MINUTES_LATER = NOW + currentTTL;
	const secret = await getJWTSecretForUser(challenge.userId);
	const jwt = await sign(
		{
			id: id,
			exp: FIVE_MINUTES_LATER
		},
		secret
	);
	await updateChallengeStatus(id, "solved");
	await db
		.update(challengesLogTable)
		.set({ correctlyAnswered: true })
		.where(eq(challengesLogTable.challengeID, id));
	return c.json({
		token: jwt
	});
};
