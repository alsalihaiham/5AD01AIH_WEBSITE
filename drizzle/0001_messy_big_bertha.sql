CREATE TABLE `sell_media` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`key` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `sell_submissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sell_media_submission` ON `sell_media` (`submission_id`);--> statement-breakpoint
CREATE TABLE `sell_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_sell_rate_expiry` ON `sell_rate_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `sell_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`token_hash` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`data` text NOT NULL,
	`created_at` text NOT NULL,
	`submitted_at` text,
	`expires_at` integer NOT NULL,
	`bytes` integer DEFAULT 0 NOT NULL,
	`photos` integer DEFAULT 0 NOT NULL,
	`videos` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sell_submissions_reference_unique` ON `sell_submissions` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_sell_status_created` ON `sell_submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_sell_expiry` ON `sell_submissions` (`expires_at`);