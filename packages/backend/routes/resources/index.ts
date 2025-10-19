import { Hono } from "hono";
import { getResourcesHandler } from "./GET";
import { createResourceHandler } from "./POST";
import { updateResourceHandler } from "./[id]/PUT";
import { deleteResourceHandler } from "./[id]/DELETE";

const resourcesRouter = new Hono();

resourcesRouter.get("/", getResourcesHandler);
resourcesRouter.post("/", createResourceHandler);
resourcesRouter.put("/:id", updateResourceHandler);
resourcesRouter.delete("/:id", deleteResourceHandler);

export { resourcesRouter };
