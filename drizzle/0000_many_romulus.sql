CREATE TABLE `category` (
	`id` char(36) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`position` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `category_id` PRIMARY KEY(`id`),
	CONSTRAINT `category_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `problem` (
	`id` char(36) NOT NULL,
	`category_id` char(36),
	`name` varchar(255),
	`slug` varchar(255) NOT NULL,
	`difficulty` int,
	`leetcode_url` varchar(255),
	`youtube_url` varchar(255),
	`neetcode_url` varchar(255),
	`solution` text,
	`notes` text,
	`neetcode_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `problem_id` PRIMARY KEY(`id`),
	CONSTRAINT `problem_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `problem_list` (
	`id` char(36) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `problem_list_id` PRIMARY KEY(`id`),
	CONSTRAINT `problem_list_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `problem_to_list` (
	`problem_id` char(36) NOT NULL,
	`list_id` char(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `problem_to_list_problem_id_list_id_unique` UNIQUE(`problem_id`,`list_id`)
);
--> statement-breakpoint
CREATE TABLE `sync_log` (
	`id` char(36) NOT NULL,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `sync_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `problem` ADD CONSTRAINT `problem_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `problem_to_list` ADD CONSTRAINT `problem_to_list_problem_id_problem_id_fk` FOREIGN KEY (`problem_id`) REFERENCES `problem`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `problem_to_list` ADD CONSTRAINT `problem_to_list_list_id_problem_list_id_fk` FOREIGN KEY (`list_id`) REFERENCES `problem_list`(`id`) ON DELETE no action ON UPDATE no action;