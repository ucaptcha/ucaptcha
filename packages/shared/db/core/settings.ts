import { db } from "./pg";
import { redis } from "./redis";
import { settingsTable } from "./schema";
import { eq } from "drizzle-orm";

interface AllSettings {
	rateLimitPerSec: number;
	monthlyQuota: number;
	allowSignup: boolean;
}

const defaultSettings = {
	rateLimitPerSec: 50,
	monthlyQuota: 1000000,
	allowSignup: false,
} satisfies AllSettings;

type SettingKey = keyof AllSettings;

const convertTypeToRedis = <K extends SettingKey>(value: AllSettings[K]): string => {
	return String(value);
};

const convertTypeFromRedis = <K extends SettingKey>(key: K, value: string): AllSettings[K] => {
	const defaultValue = defaultSettings[key];
	if (typeof defaultValue === "number") {
		return Number(value) as AllSettings[K];
	} 
    // else if (typeof defaultValue === "string") {
	// 	return value as AllSettings[K];
	// } 
    else if (typeof defaultValue === "boolean") {
		return (value === "true") as AllSettings[K];
	}
	throw new Error(`Unsupported type for setting key: ${key}`);
};

class SettingsManager {
	cacheKey(key: SettingKey) {
		return `ucaptcha:settings:${key}`;
	}

	async get<K extends SettingKey>(key: K): Promise<AllSettings[K]> {
		const cacheKey = this.cacheKey(key);
		const cachedData = await redis.get(cacheKey);
		if (cachedData !== null) {
			return convertTypeFromRedis(key, cachedData);
		}

		const result = await db
			.select({ value: settingsTable.value })
			.from(settingsTable)
			.where(eq(settingsTable.key, key));

		if (result.length === 0) {
			await this.setToDefault(key);
			return defaultSettings[key];
		}

		const value = result[0].value;
		await redis.set(cacheKey, String(value));
		return convertTypeFromRedis(key, String(value));
	}

	async set<K extends SettingKey>(key: K, value: AllSettings[K]): Promise<void> {
		const cacheKey = this.cacheKey(key);

		await redis.set(cacheKey, convertTypeToRedis(value));

		await db.insert(settingsTable).values({ key, value }).onConflictDoUpdate({
			target: settingsTable.key,
			set: { value }
		});
	}

	async setToDefault<K extends SettingKey>(key: K): Promise<void> {
		await this.set(key, defaultSettings[key]);
	}
}

export const settingsManager = new SettingsManager();
