CREATE TABLE `client_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`swimSchoolId` int,
	`swimmerType` enum('adult_self','child') DEFAULT 'adult_self',
	`swimmerName` varchar(255),
	`swimmerAge` int,
	`swimmerAgeGroup` enum('2-4','5-7','8-10','11-13','14-17','18-25','26-35','36-45','46-55','56+'),
	`swimLevel` enum('non_swimmer','beginner','intermediate','advanced','competitive') DEFAULT 'beginner',
	`goals` text,
	`preferredPoolId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `coach_availability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startHour` int NOT NULL,
	`endHour` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coach_availability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coach_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`swimSchoolId` int,
	`subscriptionTier` enum('basic','premium') NOT NULL DEFAULT 'basic',
	`bio` text,
	`languages` varchar(512),
	`hourlyRate` decimal(8,2),
	`yearsExperience` int,
	`primaryCert` enum('AUSTSWIM','STA','NROC','International Equivalent'),
	`primaryCertExpiry` timestamp,
	`primaryCertProofKey` varchar(512),
	`primaryCertProofUrl` varchar(512),
	`lifesavingCert` enum('Bronze Medallion','CPR & AED','First Aid','Equivalent'),
	`lifesavingCertExpiry` timestamp,
	`lifesavingCertProofKey` varchar(512),
	`lifesavingCertProofUrl` varchar(512),
	`certStatus` enum('pending','approved','rejected','expired') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`approvedAt` timestamp,
	`approvedBy` int,
	`videoPortfolioUrl` varchar(512),
	`catchmentRegions` text,
	`photoKey` varchar(512),
	`photoUrl` varchar(512),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coach_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `coach_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`coachId` int NOT NULL,
	`poolId` int,
	`swimSchoolId` int,
	`scheduledAt` timestamp NOT NULL,
	`durationMinutes` int NOT NULL DEFAULT 60,
	`status` enum('pending','confirmed','completed','cancelled','no_show') NOT NULL DEFAULT 'pending',
	`coachConfirmedStart` boolean DEFAULT false,
	`coachConfirmedEnd` boolean DEFAULT false,
	`clientConfirmedEnd` boolean DEFAULT false,
	`rateAtBooking` decimal(8,2),
	`platformFeePercent` decimal(5,2) DEFAULT '10.00',
	`platformFeeAmount` decimal(8,2),
	`coachPayout` decimal(8,2),
	`paymentStatus` enum('unpaid','paid','refunded','disputed') NOT NULL DEFAULT 'unpaid',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_fees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`amount` decimal(8,2) NOT NULL,
	`collectedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `platform_fees_id` PRIMARY KEY(`id`),
	CONSTRAINT `platform_fees_lessonId_unique` UNIQUE(`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `pool_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hostUserId` int NOT NULL,
	`poolType` enum('condominium','landed_estate','other') NOT NULL DEFAULT 'condominium',
	`estateName` varchar(255) NOT NULL,
	`fullAddress` text NOT NULL,
	`postalCode` varchar(16) NOT NULL,
	`unitNumber` varchar(64),
	`poolLength` int,
	`poolDepth` varchar(64),
	`securityGuidelines` text,
	`accessInstructions` text,
	`mcstApproved` boolean DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pool_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `school_coaches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`swimSchoolId` int NOT NULL,
	`coachId` int NOT NULL,
	`role` enum('head_coach','assistant','guest') NOT NULL DEFAULT 'assistant',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `school_coaches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swim_schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`logoKey` varchar(512),
	`logoUrl` varchar(512),
	`brandColor` varchar(16) DEFAULT '#1B3A5C',
	`uen` varchar(32),
	`contactEmail` varchar(320),
	`contactPhone` varchar(32),
	`address` text,
	`postalCode` varchar(16),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `swim_schools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`platformRole` enum('root_admin','swim_school','coach','pool_host','client') DEFAULT 'client',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
