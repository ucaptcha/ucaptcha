import { errorResponse } from "@/lib/common";
import { Context } from "hono";

export const notFoundRoute = (c: Context) => {
	return errorResponse(c, "Route not found.", 404);
};
