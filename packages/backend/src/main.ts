import { Hono } from "hono";
import type { TimingVariables } from "hono/timing";
import { startServer } from "./startServer.ts";
import { configureRoutes } from "./routing.ts";
import { configureMiddleWares } from "./middleware.ts";
import { notFoundRoute } from "routes/404.ts";
import { rotateKey } from "@/routes/challenge/index.ts";

type Variables = TimingVariables;
const app = new Hono<{ Variables: Variables }>();

app.notFound(notFoundRoute);

configureMiddleWares(app);
configureRoutes(app);

setInterval(rotateKey, 5 * 60 * 1000);

await startServer(app);

export const VERSION = "0.6.0";
