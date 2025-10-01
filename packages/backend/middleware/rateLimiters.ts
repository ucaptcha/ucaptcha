import type { BlankEnv } from "hono/types";
import { getConnInfo } from "hono/bun";
import { Context, Next } from "hono";
import { generate as generateRandomId } from "@alikia/random-key";
import { RateLimiter } from "@koshnic/ratelimit";
import { redis } from "@/db/redis";

export const getUserIP = (c: Context) => {
	let ipAddr = null;
	const info = getConnInfo(c);
	if (info.remote && info.remote.address) {
		ipAddr = info.remote.address;
	}
	const forwardedFor = c.req.header("X-Forwarded-For");
	if (forwardedFor) {
		ipAddr = forwardedFor.split(",")[0];
	}
	return ipAddr;
};

export const getIdentifier = (c: Context, includeIP: boolean = true) => {
	let ipAddr = generateRandomId(6);
	if (getUserIP(c)) {
		ipAddr = getUserIP(c);
	}
	const path = c.req.path;
	const method = c.req.method;
	const ipIdentifier = includeIP ? `@${ipAddr}` : "";
	return `${method}-${path}${ipIdentifier}`;
};

export const newChallengeRateLimiter = async (c: Context<BlankEnv, "/challenge/new", {}>, next: Next) => {
	const limiter = new RateLimiter(redis);
	const params = c.req.query();
	const siteKey = params.siteKey;
	const resource = params.resource;
	if (!siteKey || !resource) {
		return c.json(
			{
				message: "Missing query parameters."
			},
			400
		);
	}
	const identifier = `${siteKey}-${resource}`;
	const { allowed, retryAfter } = await limiter.allowPerSecond(identifier, 50);

	if (!allowed) {
		return c.json(
			{
				message: `Too many requests, please retry after ${Math.round(retryAfter)} seconds.`
			},
			429
		);
	}

	await next();
};
