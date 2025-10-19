import Argon2id from "@rabbit-company/argon2id";

export async function hashPassword(password: string): Promise<string> {
	return await Argon2id.hashEncoded(password);
}

export async function verifyPassword(
	plainPassword: string,
	hashedPassword: string
): Promise<boolean> {
	return await Argon2id.verify(hashedPassword, plainPassword);
}