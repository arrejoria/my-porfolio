import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cms_pages_blocks_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_es" varchar,
  	"eyebrow_en" varchar,
  	"title_es" varchar,
  	"title_en" varchar,
  	"subtitle_es" varchar,
  	"subtitle_en" varchar,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms_pages_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow_es" varchar,
  	"eyebrow_en" varchar,
  	"title_es" varchar,
  	"title_en" varchar,
  	"subtitle_es" varchar,
  	"subtitle_en" varchar,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "cms_pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_es" varchar,
  	"title_en" varchar,
  	"subtitle_es" varchar,
  	"subtitle_en" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "cms_pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "cms_pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "cms_pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "cms_pages_blocks_case_studies" ADD CONSTRAINT "cms_pages_blocks_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_pages_blocks_blog" ADD CONSTRAINT "cms_pages_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_pages_blocks_contact" ADD CONSTRAINT "cms_pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cms_pages_blocks_case_studies_order_idx" ON "cms_pages_blocks_case_studies" USING btree ("_order");
  CREATE INDEX "cms_pages_blocks_case_studies_parent_id_idx" ON "cms_pages_blocks_case_studies" USING btree ("_parent_id");
  CREATE INDEX "cms_pages_blocks_case_studies_path_idx" ON "cms_pages_blocks_case_studies" USING btree ("_path");
  CREATE INDEX "cms_pages_blocks_blog_order_idx" ON "cms_pages_blocks_blog" USING btree ("_order");
  CREATE INDEX "cms_pages_blocks_blog_parent_id_idx" ON "cms_pages_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "cms_pages_blocks_blog_path_idx" ON "cms_pages_blocks_blog" USING btree ("_path");
  CREATE INDEX "cms_pages_blocks_contact_order_idx" ON "cms_pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "cms_pages_blocks_contact_parent_id_idx" ON "cms_pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "cms_pages_blocks_contact_path_idx" ON "cms_pages_blocks_contact" USING btree ("_path");
  ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "cms_pages_meta_meta_image_idx" ON "cms_pages" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_pages_blocks_case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms_pages_blocks_blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms_pages_blocks_contact" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms_pages_blocks_case_studies" CASCADE;
  DROP TABLE "cms_pages_blocks_blog" CASCADE;
  DROP TABLE "cms_pages_blocks_contact" CASCADE;
  ALTER TABLE "cms_pages" DROP CONSTRAINT "cms_pages_meta_image_id_media_id_fk";
  
  DROP INDEX "cms_pages_meta_meta_image_idx";
  ALTER TABLE "cms_pages" DROP COLUMN "meta_title";
  ALTER TABLE "cms_pages" DROP COLUMN "meta_description";
  ALTER TABLE "cms_pages" DROP COLUMN "meta_image_id";`)
}
