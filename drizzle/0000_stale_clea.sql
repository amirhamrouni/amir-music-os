CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`genre` text NOT NULL,
	`stage` text DEFAULT 'Idea' NOT NULL,
	`score` integer DEFAULT 65 NOT NULL,
	`created_at` integer NOT NULL
);
