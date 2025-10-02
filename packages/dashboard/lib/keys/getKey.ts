import { redis } from "@/lib/db/redis";
import { getKeyBitsConfig, getKeyCount } from "./keyConfig";
import { generateRSAKey, type RSAComponents } from "@core/index";
import { deserializeKey, serializeKey } from "./serialization";

const keyIndex = (i: number) => `ucaptcha:key_${i}`;

export async function getKeyForChallenge() {
	const keyCount = await getKeyCount();
	const randomIndex = Math.floor(Math.random() * keyCount);
	const cachedKey = await redis.get(keyIndex(randomIndex));
	if (cachedKey) {
		return deserializeKey(cachedKey);
	}
	const keyBits = await getKeyBitsConfig();
	const generatedKey = await generateRSAKey(keyBits);
	if (!generatedKey) {
		return null;
	}
	await redis.set(keyIndex(randomIndex), serializeKey(generatedKey));
	return generatedKey;
}
