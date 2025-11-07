"use server";

import { revalidatePath } from "next/cache";
import { db } from "@db/pg";
import { usersTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { randomBytes } from "crypto";

export async function getAccountData(userID: number) {
	const user = await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			role: usersTable.role,
			jwtSecret: usersTable.jwtSecret,
			createdAt: usersTable.createdAt,
			updatedAt: usersTable.updatedAt,
		})
		.from(usersTable)
		.where(eq(usersTable.id, userID))
		.limit(1);

	if (user.length === 0) {
		throw new Error("User not found");
	}

	return { user: user[0] };
}

export async function changePasswordAction(userID: number, formData: FormData) {
	const currentPassword = formData.get("currentPassword") as string;
	const newPassword = formData.get("newPassword") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!currentPassword || !newPassword || !confirmPassword) {
		throw new Error("All password fields are required");
	}

	if (newPassword !== confirmPassword) {
		throw new Error("New passwords do not match");
	}

	if (newPassword.length < 8) {
		throw new Error("Password must be at least 8 characters long");
	}

	// Get current user data
	const currentUser = await db
		.select({ password: usersTable.password })
		.from(usersTable)
		.where(eq(usersTable.id, userID))
		.limit(1);

	if (currentUser.length === 0) {
		throw new Error("User not found");
	}

	// Verify current password
	if (currentUser[0].password) {
		const isValidPassword = await verifyPassword(currentPassword, currentUser[0].password);
		if (!isValidPassword) {
			throw new Error("Current password is incorrect");
		}
	}

	// Hash new password
	const hashedPassword = await hashPassword(newPassword);

	// Update password
	await db
		.update(usersTable)
		.set({
			password: hashedPassword,
			updatedAt: new Date()
		})
		.where(eq(usersTable.id, userID));

	revalidatePath("/account");
}

export async function regenerateJwtSecretAction(userID: number) {
	// Generate a new random JWT secret (64 characters hex)
	const newSecret = randomBytes(32).toString('hex');

	// Update user's JWT secret
	await db
		.update(usersTable)
		.set({
			jwtSecret: newSecret,
			updatedAt: new Date()
		})
		.where(eq(usersTable.id, userID));

	revalidatePath("/account");

	return { jwtSecret: newSecret };
}