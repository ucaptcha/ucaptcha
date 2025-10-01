import { getNewChallenge } from "@/routes/challenge";
import { Hono } from "hono";
import { Variables } from "hono/types";

export function configureRoutes(app: Hono<{ Variables: Variables }>) {
	app.get("/challenge/new", getNewChallenge);
}
