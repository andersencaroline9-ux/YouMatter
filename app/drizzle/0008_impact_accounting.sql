CREATE TABLE `impact_accounting` (
	`id` integer PRIMARY KEY NOT NULL,
	`trees_funded` integer DEFAULT 0 NOT NULL,
	`trees_planted` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "impact_accounting_singleton" CHECK("impact_accounting"."id" = 1),
	CONSTRAINT "impact_accounting_valid_totals" CHECK(typeof("impact_accounting"."trees_funded") = 'integer' AND typeof("impact_accounting"."trees_planted") = 'integer' AND "impact_accounting"."trees_funded" BETWEEN 0 AND 9007199254740991 AND "impact_accounting"."trees_planted" BETWEEN 0 AND "impact_accounting"."trees_funded")
);

--> statement-breakpoint
INSERT INTO impact_accounting (id, trees_funded, trees_planted) VALUES (1, 0, 0);
