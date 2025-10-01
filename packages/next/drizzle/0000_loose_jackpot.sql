CREATE TABLE `kv_store` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text,
	`created_at` integer DEFAULT '"2025-09-27T09:10:03.119Z"',
	`updated_at` integer DEFAULT '"2025-09-27T09:10:03.119Z"'
);
