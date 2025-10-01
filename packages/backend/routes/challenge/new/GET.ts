import { getDifficultyConfig } from "@/db/difficulty/getDifficulty";
import { getResourceID } from "@/db/resources/getResource";
import { getSiteIDFromKey } from "@/db/sites/getSite";
import { Context } from "hono";
import { generateRSAKey, generateValidG, RSAComponents } from "@core/index";
import { redis } from "@/db/redis";
import { generate as generateKey } from "@alikia/random-key";
import { errorResponse } from "@/lib/common.ts";

export interface Challenge {
	id: string;
	g: string;
	T: string;
	N: string;
	p: string;
	q: string;
}

const challengeKey = (id: string) => `ucaptcha:challenge:${id}`;

const DEFAULT_CHALLENGE_EXPIRATION_SECONDS = 300;
const currentKey = "ucaptcha:challenge_key:current";
const lastKey = "ucaptcha:challenge_key:last";
const KEY_TTL = 300;
const KEY_BITS = 1024;

export async function rotateKey() {
	const key = await redis.get(currentKey);
	if (key) {
		await redis.setex(lastKey, KEY_TTL, key);
	}
	const newKey = await generateRSAKey(KEY_BITS);
	await redis.setex(currentKey, KEY_TTL, serializeKey(newKey));
}

async function getKeyForChallenge() {
	const key = await redis.get(currentKey);
	if (!key) {
		const newKey = await generateRSAKey(KEY_BITS);
		await redis.setex(currentKey, KEY_TTL, serializeKey(newKey));
		return newKey;
	}
	return deserializeKey(key);
}

export function serializeKey(key: RSAComponents) {
	return JSON.stringify({
		p: key.p.toString(),
		q: key.q.toString(),
		N: key.N.toString()
	});
}

export function deserializeKey(key: string): RSAComponents {
	const parsed = JSON.parse(key);
	return {
		p: BigInt(parsed.p || 0),
		q: BigInt(parsed.q || 0),
		N: BigInt(parsed.N || 0)
	};
}

export async function generateChallenge(difficulty: number): Promise<Challenge | null> {
	const key = await getKeyForChallenge();
	if (!key) {
		return null;
	}
	const g = generateValidG(key.N);
	const id = await generateKey(10);
	const challenge = {
		g: g.toString(),
		T: difficulty.toString(),
		N: key.N.toString(),
		p: key.p.toString(),
		q: key.q.toString()
	};
	await redis.setex(challengeKey(id), DEFAULT_CHALLENGE_EXPIRATION_SECONDS, JSON.stringify(challenge));
	return {
		id,
		...challenge
	};
}

export async function getChallengeByID(id: string): Promise<Challenge | null> {
	const challengeJson = await redis.get(challengeKey(id));
	if (!challengeJson) {
		return null;
	}
	return JSON.parse(challengeJson) as Challenge;
}

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
	const difficultyConfig = await getDifficultyConfig(siteID, resourceID);
	const difficulty = difficultyConfig.default;
	const challenge = await generateChallenge(difficulty);
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
