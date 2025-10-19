import { db } from "@db/pg";
import { usersTable } from "@db/schema";
import { count } from "drizzle-orm";
import { hashPassword } from "./auth/password";
import crypto from "crypto";

export async function initializeAdminUser(): Promise<void> {
	const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
	const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
	const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

	// Check if all required environment variables are set
	if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
		console.log(
			"Admin user environment variables not set. Skipping admin user initialization."
		);
		return;
	}

	try {
		// Check if there are any existing users
		const userCount = await db.select({ count: count() }).from(usersTable);

		if (userCount[0].count > 0) {
			console.log(
				`Found ${userCount[0].count} existing user(s). Skipping admin user creation.`
			);
			return;
		}

		console.log("No existing users found. Creating admin user...");

		// Hash the password
		const hashedPassword = await hashPassword(ADMIN_PASSWORD);

		// Generate a JWT secret for the admin user
		const jwtSecret = crypto.randomBytes(32).toString("hex");

		// Create the admin user
		await db.insert(usersTable).values({
			name: ADMIN_USERNAME,
			email: ADMIN_EMAIL,
			password: hashedPassword,
			jwtSecret: jwtSecret,
			role: "admin"
		});

		console.log(`✅ Admin user created successfully:`);
		console.log(`   Username: ${ADMIN_USERNAME}`);
		console.log(`   Email: ${ADMIN_EMAIL}`);
	} catch (error) {
		console.error("❌ Failed to initialize admin user:", error);
		throw error;
	}
}
