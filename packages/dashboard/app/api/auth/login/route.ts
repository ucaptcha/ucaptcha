import { NextRequest, NextResponse } from "next/server";
import { db } from "@db/pg";
import { usersTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/password";
import { generateAuthToken } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ message: "Password and email are required" },
				{ status: 400 }
			);
		}

		const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

		if (user.length === 0) {
			return NextResponse.json({ message: "User does not exist" }, { status: 401 });
		}

		const userData = user[0];

		const isValidPassword = await verifyPassword(password, userData.password || "");
		if (!isValidPassword) {
			return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
		}

		const authToken = await generateAuthToken(userData);

		const response = NextResponse.json({
			user: {
				id: userData.id,
				name: userData.name,
				email: userData.email,
				role: userData.role
			}
		});

		response.cookies.set({
			name: "auth_token",
			value: authToken,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 7
		});

		return response;
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}