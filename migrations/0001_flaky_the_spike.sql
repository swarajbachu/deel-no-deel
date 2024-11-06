CREATE TYPE "public"."pair_status" AS ENUM('pending', 'ongoing', 'ended');--> statement-breakpoint
ALTER TABLE "pairs" ADD COLUMN "pairStatus" "pair_status" DEFAULT 'pending' NOT NULL;