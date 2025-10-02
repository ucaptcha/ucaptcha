import { defineConfig } from 'drizzle-kit';
import { DB_PATH } from './lib/db';

export default defineConfig({
	schema: "./lib/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: DB_PATH,
	},
});
