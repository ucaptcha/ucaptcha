import "dotenv/config";

export const apps = [
	{
		name: "ucaptcha-backend",
		script: "src/wrapper.ts",
		cwd: "./packages/backend",
		interpreter: "bun",
		env: {
			DATABASE_URL: process.env.DATABASE_URL
		}
	},
	{
		name: "ucaptcha-frontend",
		script: ".next/standalone/packages/frontend/server.js",
		cwd: "./packages/frontend",
		interpreter: "node",
	},
];
3