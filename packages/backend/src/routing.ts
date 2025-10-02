import { getNewChallenge } from "@/routes/challenge";
import { answerChallenge } from "@/routes/challenge/[id]/answer/POST";
import { checkChallenge } from "@/routes/challenge/[id]/check/POST";
import { getChallenge } from "@/routes/challenge/[id]/GET";
import { Hono } from "hono";
import { Variables } from "hono/types";

export function configureRoutes(app: Hono<{ Variables: Variables }>) {
	app.get("/challenge/new", getNewChallenge);
	app.get("/challenge/:id", getChallenge);
	app.post("/challenge/:id/check", checkChallenge);
	app.post("/challenge/:id/answer", answerChallenge);
}
