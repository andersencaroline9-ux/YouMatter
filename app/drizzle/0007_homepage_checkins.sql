CREATE TABLE `homepage_checkins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`display_name` text DEFAULT 'Anonymous' NOT NULL,
	`country_code` text,
	`owner_token_hash` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`approved_at` text,
	CONSTRAINT "homepage_checkins_rating_range" CHECK("homepage_checkins"."rating" BETWEEN 1 AND 10)
);
