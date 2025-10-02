import { User } from "@db/schema";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const REFRESH_TOKEN_EXPIRES_IN = "7d";

export async function generateAuthToken(user: User) {
	const secret = new TextEncoder().encode(
		process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_key_for_development_only"
	);

	const refreshToken = await new SignJWT({
		userID: user.id,
		email: user.email,
		role: user.role,
		name: user.name
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
		.sign(secret);

	return refreshToken;
}

interface JWTData {
	userID: number;
	email: string;
	role: string;
	name: string;
}

export async function verifyAuthToken(token: string) {
	try {
		const secret = new TextEncoder().encode(
			process.env.JWT_SECRET || "fallback_refresh_secret_key_for_development_only"
		);

		const { payload } = await jwtVerify(token, secret);
		return { valid: true, payload: payload as JWTPayload & JWTData };
	} catch (error) {
		return { valid: false, error };
	}
}
