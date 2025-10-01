import { generateValidG, verifyVDF } from "@core/index";
import { redis } from "@/db/redis";
import { generate as generateKey } from "@alikia/random-key";
import { getKeyForChallenge } from "./keys";

export interface Challenge {
	id: string;
	userId: number;
	siteKey: string;
	resource: string;
	g: string;
	T: string;
	N: string;
	p: string;
	q: string;
	status: "pending" | "solved" | "failed" | "used";
}

export const challengeKey = (id: string) => `ucaptcha:challenge:${id}`;

const DEFAULT_CHALLENGE_EXPIRATION_SECONDS = 300;

export async function generateChallenge(
	difficulty: number,
	uid: number,
	siteKey: string,
	resource: string
): Promise<Challenge | null> {
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
		userId: uid,
		siteKey,
		resource,
		status: "pending",
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

export async function verifyChallenge(challenge: Challenge, answer: string): Promise<boolean> {
	return verifyVDF(
		BigInt(challenge.g),
		BigInt(challenge.N),
		BigInt(challenge.T),
		BigInt(answer),
		BigInt(challenge.p),
		BigInt(challenge.q)
	);
}

export const updateChallengeStatus = async (id: string, status: Challenge["status"]) => {
	const challenge = await getChallengeByID(id);
	if (!challenge) {
		return null;
	}
	const currentTTL = await redis.ttl(challengeKey(id));
	return await redis.setex(
		challengeKey(id),
		currentTTL,
		JSON.stringify({
			...challenge,
			status: status
		} as Challenge)
	);
};
