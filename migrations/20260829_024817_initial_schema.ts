import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "user" (
  	"id" text PRIMARY KEY NOT NULL,
  	"name" text NOT NULL,
  	"email" text NOT NULL,
  	"emailVerified" boolean DEFAULT false NOT NULL,
  	"image" text,
  	"createdAt" timestamp DEFAULT now() NOT NULL,
  	"updatedAt" timestamp DEFAULT now() NOT NULL,
  	CONSTRAINT "user_email_unique" UNIQUE("email")
  );
  
  CREATE TABLE "session" (
  	"id" text PRIMARY KEY NOT NULL,
  	"expiresAt" timestamp NOT NULL,
  	"token" text NOT NULL,
  	"createdAt" timestamp DEFAULT now() NOT NULL,
  	"updatedAt" timestamp DEFAULT now() NOT NULL,
  	"ipAddress" text,
  	"userAgent" text,
  	"userId" text NOT NULL,
  	CONSTRAINT "session_token_unique" UNIQUE("token")
  );
  
  CREATE TABLE "account" (
  	"id" text PRIMARY KEY NOT NULL,
  	"accountId" text NOT NULL,
  	"providerId" text NOT NULL,
  	"userId" text NOT NULL,
  	"accessToken" text,
  	"refreshToken" text,
  	"idToken" text,
  	"accessTokenExpiresAt" timestamp,
  	"refreshTokenExpiresAt" timestamp,
  	"scope" text,
  	"password" text,
  	"createdAt" timestamp DEFAULT now() NOT NULL,
  	"updatedAt" timestamp DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "verification" (
  	"id" text PRIMARY KEY NOT NULL,
  	"identifier" text NOT NULL,
  	"value" text NOT NULL,
  	"expiresAt" timestamp NOT NULL,
  	"createdAt" timestamp DEFAULT now(),
  	"updatedAt" timestamp DEFAULT now()
  );
  
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms_case_studies_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tool" varchar NOT NULL
  );
  
  CREATE TABLE "cms_case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary_es" varchar NOT NULL,
  	"summary_en" varchar NOT NULL,
  	"content_es" jsonb NOT NULL,
  	"content_en" jsonb NOT NULL,
  	"cover_image_id" integer,
  	"repo_url" varchar,
  	"demo_url" varchar,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "cms_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_es" varchar NOT NULL,
  	"title_en" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt_es" varchar NOT NULL,
  	"excerpt_en" varchar NOT NULL,
  	"category" varchar,
  	"content_es" jsonb NOT NULL,
  	"content_en" jsonb NOT NULL,
  	"cover_image_id" integer,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms_projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "cms_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description_es" varchar NOT NULL,
  	"description_en" varchar NOT NULL,
  	"image_id" integer,
  	"live_url" varchar,
  	"repo_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"cms_case_studies_id" integer,
  	"media_id" integer,
  	"cms_pages_id" integer,
  	"cms_posts_id" integer,
  	"cms_projects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Portfolio' NOT NULL,
  	"home_page_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_case_studies_tools" ADD CONSTRAINT "cms_case_studies_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_case_studies" ADD CONSTRAINT "cms_case_studies_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms_posts" ADD CONSTRAINT "cms_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms_projects_tags" ADD CONSTRAINT "cms_projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_projects" ADD CONSTRAINT "cms_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("cms_case_studies_id") REFERENCES "public"."cms_case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("cms_pages_id") REFERENCES "public"."cms_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("cms_posts_id") REFERENCES "public"."cms_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("cms_projects_id") REFERENCES "public"."cms_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_page_id_cms_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."cms_pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "cms_case_studies_tools_order_idx" ON "cms_case_studies_tools" USING btree ("_order");
  CREATE INDEX "cms_case_studies_tools_parent_id_idx" ON "cms_case_studies_tools" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cms_case_studies_slug_idx" ON "cms_case_studies" USING btree ("slug");
  CREATE INDEX "cms_case_studies_cover_image_idx" ON "cms_case_studies" USING btree ("cover_image_id");
  CREATE INDEX "cms_case_studies_updated_at_idx" ON "cms_case_studies" USING btree ("updated_at");
  CREATE INDEX "cms_case_studies_created_at_idx" ON "cms_case_studies" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "cms_pages_slug_idx" ON "cms_pages" USING btree ("slug");
  CREATE INDEX "cms_pages_updated_at_idx" ON "cms_pages" USING btree ("updated_at");
  CREATE INDEX "cms_pages_created_at_idx" ON "cms_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "cms_posts_slug_idx" ON "cms_posts" USING btree ("slug");
  CREATE INDEX "cms_posts_cover_image_idx" ON "cms_posts" USING btree ("cover_image_id");
  CREATE INDEX "cms_posts_updated_at_idx" ON "cms_posts" USING btree ("updated_at");
  CREATE INDEX "cms_posts_created_at_idx" ON "cms_posts" USING btree ("created_at");
  CREATE INDEX "cms_projects_tags_order_idx" ON "cms_projects_tags" USING btree ("_order");
  CREATE INDEX "cms_projects_tags_parent_id_idx" ON "cms_projects_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cms_projects_slug_idx" ON "cms_projects" USING btree ("slug");
  CREATE INDEX "cms_projects_image_idx" ON "cms_projects" USING btree ("image_id");
  CREATE INDEX "cms_projects_updated_at_idx" ON "cms_projects" USING btree ("updated_at");
  CREATE INDEX "cms_projects_created_at_idx" ON "cms_projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_cms_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("cms_case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_cms_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("cms_pages_id");
  CREATE INDEX "payload_locked_documents_rels_cms_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("cms_posts_id");
  CREATE INDEX "payload_locked_documents_rels_cms_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("cms_projects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_home_page_idx" ON "site_settings" USING btree ("home_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "user" CASCADE;
  DROP TABLE "session" CASCADE;
  DROP TABLE "account" CASCADE;
  DROP TABLE "verification" CASCADE;
  DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "cms_case_studies_tools" CASCADE;
  DROP TABLE "cms_case_studies" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "cms_pages" CASCADE;
  DROP TABLE "cms_posts" CASCADE;
  DROP TABLE "cms_projects_tags" CASCADE;
  DROP TABLE "cms_projects" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;`)
}
