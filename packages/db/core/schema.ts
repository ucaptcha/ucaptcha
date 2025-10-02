import { foreignKey, integer, pgEnum, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	email: text(),
	password: text(),
	jwtSecret: text().notNull().default(""),
	role: userRoleEnum().notNull().default("user"),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()
});

export const sitesTable = pgTable(
	"sites",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: text().notNull(),
		siteKey: text().notNull().unique(),
		userID: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.userID],
			foreignColumns: [usersTable.id]
		})
			.onUpdate("cascade")
			.onDelete("cascade")
	]
);

export const resourcesTable = pgTable(
	"resources",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: text().notNull(),
		siteId: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.siteId],
			foreignColumns: [sitesTable.id]
		})
			.onUpdate("cascade")
			.onDelete("cascade")
	]
);

export const challengesLogTable = pgTable(
	"challenges_log",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		challengeID: text().notNull(),
		siteID: integer().notNull(),
		resourceID: integer().notNull(),
		ttl: integer().notNull(),
		correctlyAnswered: boolean().notNull().default(false),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		answeredAt: timestamp({ withTimezone: true })
	},
	(table) => [
		foreignKey({
			columns: [table.siteId],
			foreignColumns: [sitesTable.id]
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.resourceID],
			foreignColumns: [resourcesTable.id]
		})
			.onUpdate("cascade")
			.onDelete("cascade")
	]
);

export const difficultyConfigTable = pgTable(
	"difficulty_config",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		siteID: integer().notNull(),
		resourceID: integer().notNull(),
		difficulty_default: integer(),
		difficulty_15_sec: integer(),
		difficulty_30_sec: integer(),
		difficulty_1_min: integer(),
		difficulty_3_min: integer(),
		difficulty_5_min: integer(),
		difficulty_10_min: integer(),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.siteID],
			foreignColumns: [sitesTable.id]
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		foreignKey({
			columns: [table.resourceID],
			foreignColumns: [resourcesTable.id]
		})
			.onUpdate("cascade")
			.onDelete("cascade")
	]
);
