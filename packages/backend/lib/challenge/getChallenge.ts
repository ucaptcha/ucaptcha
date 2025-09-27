import { generateValidG } from "@core/index";
import { getKeyForChallenge } from "../keys/getKey";
import { redis } from "@/lib/db/redis";
import { generate as generateKey } from '@alikia/random-key';
import { ConfigManager } from "@/lib/db";

export interface Challenge {
    id: string;
    g: string;
    T: string;
    N: string;
    p: string;
    q: string;
}

const challengeKey = (id: string) => `ucaptcha:challenge:${id}`

const DEFAULT_CHALLENGE_EXPIRATION_SECONDS = 300;

export async function getChallengeExpirationSeconds() {
    const data = await ConfigManager.get("challenge_expiration_seconds");
    if (data) {
        return Number.parseInt(data);
    }
    await ConfigManager.set("challenge_expiration_seconds", DEFAULT_CHALLENGE_EXPIRATION_SECONDS.toString());
    return DEFAULT_CHALLENGE_EXPIRATION_SECONDS;
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
        q: key.q.toString(),
    };
    const expiration = await getChallengeExpirationSeconds();
    await redis.setex(challengeKey(id), expiration, JSON.stringify(challenge));
    return {
        id,
        ...challenge
    }
}
export async function getChallengeByID(id: string): Promise<Challenge | null> {
    const challengeJson = await redis.get(challengeKey(id));
    if (!challengeJson) {
        return null;
    }
    return JSON.parse(challengeJson) as Challenge;
}
