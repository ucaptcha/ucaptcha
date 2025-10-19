import { Hono } from "hono";
import { timing } from "hono/timing";
import { Variables } from "hono/types";
import { corsMiddleware } from "@/middleware/cors";
import { contentType } from "middleware/contentType";
import { bodyLimitForPing } from "middleware/bodyLimits";
import { newChallengeRateLimiter } from "@/middleware/rateLimiters";
import { authMiddleware } from "@/middleware/auth";

export function configureMiddleWares(app: Hono<{ Variables: Variables }>) {
	app.use("*", corsMiddleware);

	app.use("*", contentType);
	app.use("/challenge/new", newChallengeRateLimiter);
	app.use(timing());

	app.use("*", bodyLimitForPing);

	app.use("/resources", authMiddleware);
	app.use("/resources/*", authMiddleware);
}
