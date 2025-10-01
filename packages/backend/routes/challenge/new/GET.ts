import { getDifficultyConfig } from "@/db/difficulty/getDifficulty";
import { getResourceID } from "@/db/resources/getResource";
import { getSiteIDFromKey, getUserIDFromSiteID } from "@/db/sites/getSite";
import { Context } from "hono";
import { redis } from "@/db/redis";
import { errorResponse } from "@/lib/common.ts";
import { challengeKey, generateChallenge } from "@/lib/challenge";
import { KEY_TTL } from "@/lib/keys";

export const getNewChallenge = async (c: Context) => {
	const params = c.req.query();
	if (!params.siteKey || !params.resource) {
		return errorResponse(c, "Missing query parameters.", 400);
	}
	const siteKey = params.siteKey;
	const resource = params.resource;
	const siteID = await getSiteIDFromKey(siteKey);
	const resourceID = await getResourceID(siteKey, resource);
	if (!siteID || !resourceID) {
		return errorResponse(c, "Given siteKey or resource does not exist.", 404);
	}
	const userID = await getUserIDFromSiteID(siteID);
	const difficultyConfig = await getDifficultyConfig(siteID, resourceID);
	const difficulty = difficultyConfig.default;
	const challenge = await generateChallenge(difficulty, userID, siteKey, resource);
	if (!challenge) {
		return errorResponse(c, "No challenge available.", 500);
	}
	await redis.setex(challengeKey(challenge.id), KEY_TTL, JSON.stringify(challenge));
	return c.json({
		id: challenge.id,
		g: challenge.g,
		T: challenge.T,
		N: challenge.N
	});
};
