CREATE TABLE "client_logos" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo_url" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" text PRIMARY KEY NOT NULL,
	"question_id" text NOT NULL,
	"question_en" text NOT NULL,
	"answer_id" text NOT NULL,
	"answer_en" text NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"client_name" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"company" text NOT NULL,
	"requirements" text NOT NULL,
	"estimated_budget" text NOT NULL,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" text PRIMARY KEY NOT NULL,
	"title_id" text NOT NULL,
	"title_en" text NOT NULL,
	"desc_id" text NOT NULL,
	"desc_en" text NOT NULL,
	"image_url" text NOT NULL,
	"category" text NOT NULL,
	"client_name" text NOT NULL,
	"tech_stack" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" text NOT NULL,
	"features_json" text NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"type" text NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"title_id" text NOT NULL,
	"title_en" text NOT NULL,
	"desc_id" text NOT NULL,
	"desc_en" text NOT NULL,
	"icon_name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" text PRIMARY KEY NOT NULL,
	"label_id" text NOT NULL,
	"label_en" text NOT NULL,
	"value" text NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"client_name" text NOT NULL,
	"role" text NOT NULL,
	"content_id" text NOT NULL,
	"content_en" text NOT NULL,
	"avatar_url" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"order_idx" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
