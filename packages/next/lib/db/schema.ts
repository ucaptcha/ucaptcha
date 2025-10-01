import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const kvStore = sqliteTable("kv_store", {
	key: text("key").primaryKey(),
	value: text("value"),
	createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});
