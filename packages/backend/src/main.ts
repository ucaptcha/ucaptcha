import { Hono } from "hono";
import type { TimingVariables } from "hono/timing";
import { startServer } from "./startServer";
import { configureRoutes } from "./routing";
import { configureMiddleWares } from "./middleware";
import { notFoundRoute } from "routes/404";
import { errorResponse } from "@/lib/common";
import { rotateKey } from "@/lib/keys";
import { initializeAdminUser } from "@/lib/adminInit";

type Variables = TimingVariables;
const app = new Hono<{ Variables: Variables }>();

app.notFound(notFoundRoute);
app.onError((err, c) => {
	console.error(err);
	return errorResponse(c, err.message, 500);
});

configureMiddleWares(app);
configureRoutes(app);

// Initialize admin user if environment variables are set and no users exist
await initializeAdminUser();

setInterval(rotateKey, 5 * 60 * 1000);

await startServer(app);

export const VERSION = "0.6.0";
