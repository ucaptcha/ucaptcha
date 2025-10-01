import { Hono } from "hono";
import { timing } from "hono/timing";
import { Variables } from "hono/types";
import { corsMiddleware } from "@/middleware/cors";
import { contentType } from "middleware/contentType.ts";
import { bodyLimitForPing } from "middleware/bodyLimits.ts";
import { registerRateLimiter } from "middleware/rateLimiters.ts";

export function configureMiddleWares(app: Hono<{ Variables: Variables }>) {
	app.use("*", corsMiddleware);

	app.use("*", contentType);
	app.use(timing());

	app.post("/user", registerRateLimiter);
	app.use("*", bodyLimitForPing);
}
