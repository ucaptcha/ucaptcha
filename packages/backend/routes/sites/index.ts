import { Hono } from "hono";
import { getSites } from "./GET";
import { createSite } from "./POST";
import { updateSite } from "./[id]/PUT";
import { deleteSite } from "./[id]/DELETE";

const sitesRouter = new Hono();

sitesRouter.get("/", getSites);
sitesRouter.post("/", createSite);
sitesRouter.put("/:id", updateSite);
sitesRouter.delete("/:id", deleteSite);

export { sitesRouter };