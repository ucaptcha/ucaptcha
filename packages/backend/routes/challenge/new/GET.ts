import { getDifficultyConfig } from "@/db/difficulty/getDifficulty";
import { getResourceID } from "@/db/resources/getResource";
import { getSiteIDFromKey } from "@/db/sites/getSite";
import { Context } from "hono";
import { generateValidG, RSAComponents } from "@core/index";
import { redis } from "@/db/redis";
import { generate as generateKey } from "@alikia/random-key";

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

async function getKeyForChallenge() {
	const key = await redis.get("ucaptcha:challenge_key:current");
	if (!key) {
		
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
		return c.json(
			{
				message: "Missing query parameters."
			},
			400
		);
	}
	const siteKey = params.siteKey;
	const resource = params.resource;
	const siteID = await getSiteIDFromKey(siteKey);
	const resourceID = await getResourceID(siteKey, resource);
	const difficultyConfig = await getDifficultyConfig(siteID, resourceID);
	return c.json({
		siteKey,
		resource,
		difficulty: difficultyConfig
	});
};
