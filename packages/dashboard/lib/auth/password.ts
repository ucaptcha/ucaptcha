import Argon2id from "@rabbit-company/argon2id";

// 哈希密码
export async function hashPassword(password: string): Promise<string> {
  return await Argon2id.hash(password);
}

// 验证密码
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await Argon2id.verify(hashedPassword, plainPassword);
}