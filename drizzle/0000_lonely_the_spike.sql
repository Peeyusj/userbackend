CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `news_article` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`markdownContent` text,
	`title` text NOT NULL,
	`tags` text DEFAULT (json_array()),
	`description` text NOT NULL,
	`img_src` text,
	`category` integer,
	`priority` integer NOT NULL,
	`author` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`category`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_name` text NOT NULL,
	`profile_pic` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`phone_number` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
