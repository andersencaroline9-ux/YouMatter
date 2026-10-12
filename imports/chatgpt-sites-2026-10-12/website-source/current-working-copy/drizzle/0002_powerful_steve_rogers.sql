CREATE TABLE `superhero_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`strength` text NOT NULL,
	`superpower` text NOT NULL,
	`display_name` text DEFAULT 'Anonymous' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`approved_at` text
);
