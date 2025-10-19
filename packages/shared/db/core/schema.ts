import {
	foreignKey,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	boolean,
	index,
	jsonb
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export interface DifficultyConfigValue {
	default: number;
	custom: {
		timeRange: number;
		threshold: number;
		difficulty: number;
	}[];
}

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text().notNull(),
	email: text().unique(),
	password: text(),
	jwtSecret: text().notNull().default(""),
	role: userRoleEnum().notNull().default("user"),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()
});

export type User = InferSelectModel<typeof usersTable>;

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

export type Site = InferSelectModel<typeof sitesTable>;

export const resourcesTable = pgTable(
	"resources",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: text().notNull(),
		siteID: integer().notNull(),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.siteID],
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
		userID: integer().notNull(),
		siteID: integer().notNull(),
		resourceID: integer().notNull(),
		ttl: integer().notNull(),
		difficulty: integer().notNull(),
		correctlyAnswered: boolean().notNull().default(false),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		answeredAt: timestamp({ withTimezone: true })
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
			.onDelete("cascade"),
		foreignKey({
			columns: [table.userID],
			foreignColumns: [usersTable.id]
		})
			.onUpdate("cascade")
			.onDelete("cascade"),
		index("idx_log_created-at_uid").on(table.createdAt, table.userID),
		index("idx_log_uid").on(table.userID)
	]
);

export const difficultyConfigTable = pgTable(
	"difficulty_config",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		siteID: integer().notNull(),
		resourceID: integer(),
		difficultyConfig: jsonb().$type<DifficultyConfigValue>().default({
			default: 200000,
			custom: []
		}),
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

export const settingsTable = pgTable("settings", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	key: text().notNull().unique(),
	value: jsonb().notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull()
});

export type Resource = InferSelectModel<typeof resourcesTable>;
export type ChallengeLog = InferSelectModel<typeof challengesLogTable>;
export type DifficultyConfig = InferSelectModel<typeof difficultyConfigTable>;
export type Settings = InferSelectModel<typeof settingsTable>;
