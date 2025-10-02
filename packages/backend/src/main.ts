import { Hono } from "hono";
import type { TimingVariables } from "hono/timing";
import { startServer } from "./startServer.ts";
import { configureRoutes } from "./routing.ts";
import { configureMiddleWares } from "./middleware.ts";
import { notFoundRoute } from "routes/404.ts";
import { errorResponse } from "@/lib/common.ts";
import { rotateKey } from "@/lib/keys.ts";
import { db } from "@db/pg.ts";
import { settingsTable } from "@db/schema.ts";

type Variables = TimingVariables;
const app = new Hono<{ Variables: Variables }>();

app.notFound(notFoundRoute);
app.onError((err, c) => {
    console.error(err)
    return errorResponse(c, err.message, 500);
})

configureMiddleWares(app);
configureRoutes(app);

setInterval(rotateKey, 5 * 60 * 1000);

async function init() {
    
}

await startServer(app);

export const VERSION = "0.6.0";
