import { drizzle } from "drizzle-orm/libsql";

export const DB_PATH = "file:config.db"
export const db = drizzle(DB_PATH);
