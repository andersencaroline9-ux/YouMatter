CREATE TABLE `strengths_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`strength` text NOT NULL,
	`reflection` text,
	`display_name` text DEFAULT 'Anonymous' NOT NULL,
	`country_code` text,
	`owner_token_hash` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`approved_at` text
);
