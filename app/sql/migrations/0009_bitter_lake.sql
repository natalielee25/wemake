ALTER TABLE "posts" ADD COLUMN "upvotes" bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;