import { redis } from "../redis";
import { db } from "../pg";
import { eq, and } from "drizzle-orm";
import { difficultyConfigTable } from "../schema";

interface DifficultyConfig {
	default: number;
	d15sec: number;
	d30sec: number;
	d1min: number;
	d3min: number;
	d5min: number;
	d10min: number;
}

export async function getDifficultyConfig(siteID: number, resourceID: number): Promise<DifficultyConfig | null> {
	const resourceCacheKey = resourceID ? `-${resourceID}` : "";
	const cacheKey = `ucaptcha:difficulty_config:${siteID}${resourceCacheKey}`;

	const cachedData = await redis.get(cacheKey);
	if (cachedData) {
		return JSON.parse(cachedData);
	}

	let data: DifficultyConfig[];
	const selection = {
		default: difficultyConfigTable.difficulty_default,
		d15sec: difficultyConfigTable.difficulty_15_sec,
		d30sec: difficultyConfigTable.difficulty_30_sec,
		d1min: difficultyConfigTable.difficulty_1_min,
		d3min: difficultyConfigTable.difficulty_3_min,
		d5min: difficultyConfigTable.difficulty_5_min,
		d10min: difficultyConfigTable.difficulty_10_min
	};
	const siteIDEq = eq(difficultyConfigTable.siteID, siteID);
	const resourceIDEq = eq(difficultyConfigTable.resourceID, resourceID);
	data = await db.select(selection).from(difficultyConfigTable).where(and(siteIDEq, resourceIDEq));
	if (!data[0]) {
		data = await db.select(selection).from(difficultyConfigTable).where(siteIDEq);
	}
	if (!data[0]) {
		return null;
	}
	await redis.set(cacheKey, JSON.stringify(data[0]));
	return data[0];
}
