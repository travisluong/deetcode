CREATE TABLE `solution` (
	`id` varchar(255) NOT NULL,
	`problem_id` varchar(255),
	`user_id` varchar(255),
	`content` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `solution_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `solution` ADD CONSTRAINT `solution_problem_id_problem_id_fk` FOREIGN KEY (`problem_id`) REFERENCES `problem`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `solution` ADD CONSTRAINT `solution_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;