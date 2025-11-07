import { redis } from "@db/redis";
import { RateLimiter } from "@koshnic/ratelimit";
import { getDifficultyConfig } from "./getDifficulty";

export async function getDynamicDifficulty(siteID: number, resourceID?: number): Promise<number> {
	const config = await getDifficultyConfig(siteID, resourceID || 0);
	if (!config) {
		return 200000;
	}

	const { difficultyConfig } = config;
	let selectedDifficulty = difficultyConfig.default;

	const limiter = new RateLimiter(redis);
	const sortedRules = [...difficultyConfig.custom].sort((a, b) => b.threshold - a.threshold);

	for (const rule of sortedRules) {
		const identifier = `traffic-${siteID}-${resourceID || "default"}-${rule.timeRange}`;
		const { allowed } = await limiter.allow(identifier, {
			ratePerPeriod: rule.threshold,
			period: rule.timeRange,
			burst: rule.threshold,
			cost: 1
		});

		if (!allowed && rule.difficulty > selectedDifficulty) {
			selectedDifficulty = rule.difficulty;
		}
	}

	return selectedDifficulty;
}
