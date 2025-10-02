import { generateRSAKey, RSAComponents } from "@core/index";
import { redis } from "@db/redis"

const currentKey = "ucaptcha:challenge_key:current";
export const KEY_TTL = 300;
const KEY_BITS = 1024;

export async function rotateKey() {
    const newKey = await generateRSAKey(KEY_BITS);
    await redis.setex(currentKey, KEY_TTL, serializeKey(newKey));
}

export async function getKeyForChallenge() {
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