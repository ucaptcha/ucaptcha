import { Context, Hono, Next } from "hono";
import { errorResponse } from "@/lib/common";
import { JWTData, verifyAuthToken } from "@shared/auth/jwt";
import { JWTPayload } from "jose";

export interface AuthStore {
	authPayload: JWTPayload & JWTData;
}

export const authMiddleware = async (c: Context<{ Variables: AuthStore }>, next: Next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return errorResponse(c, "Unauthorized", 401);
	}

	const token = authHeader.substring(7);
	const { valid, payload } = await verifyAuthToken(token);

	if (!valid || !payload) {
		return errorResponse(c, "Invalid token", 401);
	}

	c.set("authPayload", payload);

	await next();
};
