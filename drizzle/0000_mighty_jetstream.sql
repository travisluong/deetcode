CREATE TABLE `problems` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`category` varchar(256),
	`difficulty` enum('easy','medium','hard'),
	`leetcode_url` varchar(256),
	`youtube_url` varchar(256),
	`github_url` varchar(256),
	`notes` text,
	CONSTRAINT `problems_id` PRIMARY KEY(`id`)
);
