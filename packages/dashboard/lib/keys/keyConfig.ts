import { redis } from "@/lib/db/redis";
import { ConfigManager } from "../db";

const KEYCOUNT_KEY = `ucaptcha:key_count`;
const DEFAULT_KEY_BITS = 1024;

export async function getKeyCount() {
	const keyCount = await redis.get(KEYCOUNT_KEY);
	if (keyCount) {
		return Number.parseInt(keyCount);
	}
	await redis.set(KEYCOUNT_KEY, "0");
	return 0;
}

export async function getKeyBitsConfig() {
    const data = await ConfigManager.get("key_bits");
    if (data) {
        return Number.parseInt(data);
    }
    await ConfigManager.set("key_bits", DEFAULT_KEY_BITS.toString());
    return DEFAULT_KEY_BITS;
}