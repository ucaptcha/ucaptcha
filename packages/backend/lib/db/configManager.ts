import { eq } from "drizzle-orm";
import { db } from "./db";
import { kvStore } from "./schema";

export class ConfigManager {
	/**
	 * Set a key-value pair
	 * @param key Key
	 * @param value Vsalue
	 */
	static async set(key: string, value: string): Promise<void> {
		const now = new Date();

		const existing = await db.select().from(kvStore).where(eq(kvStore.key, key));

		if (existing.length > 0) {
			await db
				.update(kvStore)
				.set({
					value,
					updatedAt: now,
				})
				.where(eq(kvStore.key, key));
		} else {
			await db.insert(kvStore).values({
				key,
				value,
				createdAt: now,
				updatedAt: now,
			});
		}
	}

	/**
	 * Retrieve a value by key
	 * @param key Key
	 * @returns Value or null if not found
	 */
	static async get(key: string): Promise<string | null> {
		const result = await db.select().from(kvStore).where(eq(kvStore.key, key));
		return result.length > 0 ? result[0].value : null;
	}

	/**
	 * Delete a key
	 * @param key Key
	 */
	static async delete(key: string): Promise<void> {
		await db.delete(kvStore).where(eq(kvStore.key, key));
	}

	/**
	 * Retrieve all key-value pairs
	 * @returns An object containing all key-value pairs
	 */
	static async getAll(): Promise<Record<string, string>> {
		const result = await db.select().from(kvStore);
		const config: Record<string, string> = {};

		for (const item of result) {
			if (item.value !== null) {
				config[item.key] = item.value;
			}
		}

		return config;
	}
}
