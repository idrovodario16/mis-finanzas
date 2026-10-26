CREATE TABLE `movements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`concept` text NOT NULL,
	`category` text NOT NULL,
	`cents` integer NOT NULL
);
