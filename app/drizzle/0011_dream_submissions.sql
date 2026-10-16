CREATE TABLE `dream_submissions` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `dream` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `approved_at` text,
  CONSTRAINT "dream_submissions_valid_dream" CHECK(length(trim("dream_submissions"."dream")) BETWEEN 1 AND 120)
);
