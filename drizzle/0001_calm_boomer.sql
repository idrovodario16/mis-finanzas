CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`target_cents` integer NOT NULL,
	`monthly_cents` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `movements` ADD `goal_id` text;