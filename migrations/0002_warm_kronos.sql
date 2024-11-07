ALTER TABLE "pairs" ADD COLUMN "round_id" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "pairs" ADD COLUMN "winner_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_winner_id_players_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
