import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// payload-i18n-migration A4 (homepage blocks) — design D6. `eyebrow`/`title`/
// `subtitle` on `case-studies-block.ts`/`blog-block.ts`/`contact-block.ts`
// used to be `group` fields with hand-authored `es`/`en` sub-fields (the
// `bilingual()` helper, now deleted from lib/payload/blocks/shared.ts). None
// of these 8 fields is `richText` and none is `required` (optionality was
// always the per-field fallback-to-dictionary mechanism for homepage
// blocks), so — like A3 (projects) — this ships as a single additive
// migration: no N/N+1 split, no NOT-NULL-relaxation dance, no Local API
// backfill loop.
//
// `payload migrate:create` produced a CLEAN diff scoped to exactly the 3
// block-row tables (`cms_pages_blocks_{caseStudies,blog,contact}`) — no
// `cms_pages_locales`/SEO-meta noise (already resolved out-of-band, commit
// `91dcd51`, before A2). No `.json` snapshot hand-correction was needed.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cms_pages_blocks_case_studies_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "cms_pages_blocks_blog_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "cms_pages_blocks_contact_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  ALTER TABLE "cms_pages_blocks_case_studies_locales" ADD CONSTRAINT "cms_pages_blocks_case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_pages_blocks_case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_pages_blocks_blog_locales" ADD CONSTRAINT "cms_pages_blocks_blog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_pages_blocks_blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_pages_blocks_contact_locales" ADD CONSTRAINT "cms_pages_blocks_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "cms_pages_blocks_case_studies_locales_locale_parent_id_uniqu" ON "cms_pages_blocks_case_studies_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "cms_pages_blocks_blog_locales_locale_parent_id_unique" ON "cms_pages_blocks_blog_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "cms_pages_blocks_contact_locales_locale_parent_id_unique" ON "cms_pages_blocks_contact_locales" USING btree ("_locale","_parent_id");`)

  // Backfill (plain text) via SQL — safe per the spec's "Plain text
  // backfill" scenario. Unlike A1/A2/A3, none of these 8 fields is
  // `required: true` — there is no single authoritative column to gate "is
  // this locale translated" on (any of eyebrow/title/subtitle can be filled
  // independently while the others stay blank). Each locale-branch row is
  // therefore inserted when AT LEAST ONE of that locale's 2-3 legacy columns
  // is non-null, not gated on a single column — this avoids both silently
  // dropping a partial fill (e.g. only `title_es` ever set) and inserting an
  // all-NULL row for a locale nobody ever touched, which design D4 treats as
  // "not translated" (absent row), matching what a fresh Payload write for
  // an untranslated locale would produce.
  await db.execute(sql`
    INSERT INTO "cms_pages_blocks_case_studies_locales" ("_locale", "_parent_id", "eyebrow", "title", "subtitle")
    SELECT 'es'::"public"."_locales", "id", "eyebrow_es", "title_es", "subtitle_es" FROM "cms_pages_blocks_case_studies"
    WHERE "eyebrow_es" IS NOT NULL OR "title_es" IS NOT NULL OR "subtitle_es" IS NOT NULL
    UNION ALL
    SELECT 'en'::"public"."_locales", "id", "eyebrow_en", "title_en", "subtitle_en" FROM "cms_pages_blocks_case_studies"
    WHERE "eyebrow_en" IS NOT NULL OR "title_en" IS NOT NULL OR "subtitle_en" IS NOT NULL;

    INSERT INTO "cms_pages_blocks_blog_locales" ("_locale", "_parent_id", "eyebrow", "title", "subtitle")
    SELECT 'es'::"public"."_locales", "id", "eyebrow_es", "title_es", "subtitle_es" FROM "cms_pages_blocks_blog"
    WHERE "eyebrow_es" IS NOT NULL OR "title_es" IS NOT NULL OR "subtitle_es" IS NOT NULL
    UNION ALL
    SELECT 'en'::"public"."_locales", "id", "eyebrow_en", "title_en", "subtitle_en" FROM "cms_pages_blocks_blog"
    WHERE "eyebrow_en" IS NOT NULL OR "title_en" IS NOT NULL OR "subtitle_en" IS NOT NULL;

    INSERT INTO "cms_pages_blocks_contact_locales" ("_locale", "_parent_id", "title", "subtitle")
    SELECT 'es'::"public"."_locales", "id", "title_es", "subtitle_es" FROM "cms_pages_blocks_contact"
    WHERE "title_es" IS NOT NULL OR "subtitle_es" IS NOT NULL
    UNION ALL
    SELECT 'en'::"public"."_locales", "id", "title_en", "subtitle_en" FROM "cms_pages_blocks_contact"
    WHERE "title_en" IS NOT NULL OR "subtitle_en" IS NOT NULL;
  `)

  // No richText backfill loop and no intermediate NOT-NULL relaxation are
  // needed here (unlike A1/A2) — the legacy columns can be dropped outright
  // in the same migration since nothing else still targets them.
  await db.execute(sql`
    ALTER TABLE "cms_pages_blocks_case_studies" DROP COLUMN "eyebrow_es";
    ALTER TABLE "cms_pages_blocks_case_studies" DROP COLUMN "eyebrow_en";
    ALTER TABLE "cms_pages_blocks_case_studies" DROP COLUMN "title_es";
    ALTER TABLE "cms_pages_blocks_case_studies" DROP COLUMN "title_en";
    ALTER TABLE "cms_pages_blocks_case_studies" DROP COLUMN "subtitle_es";
    ALTER TABLE "cms_pages_blocks_case_studies" DROP COLUMN "subtitle_en";
    ALTER TABLE "cms_pages_blocks_blog" DROP COLUMN "eyebrow_es";
    ALTER TABLE "cms_pages_blocks_blog" DROP COLUMN "eyebrow_en";
    ALTER TABLE "cms_pages_blocks_blog" DROP COLUMN "title_es";
    ALTER TABLE "cms_pages_blocks_blog" DROP COLUMN "title_en";
    ALTER TABLE "cms_pages_blocks_blog" DROP COLUMN "subtitle_es";
    ALTER TABLE "cms_pages_blocks_blog" DROP COLUMN "subtitle_en";
    ALTER TABLE "cms_pages_blocks_contact" DROP COLUMN "title_es";
    ALTER TABLE "cms_pages_blocks_contact" DROP COLUMN "title_en";
    ALTER TABLE "cms_pages_blocks_contact" DROP COLUMN "subtitle_es";
    ALTER TABLE "cms_pages_blocks_contact" DROP COLUMN "subtitle_en";
  `)
}

// down() is restorative, not a guarantee of exact pre-migration schema
// state: it re-adds the legacy columns as NULLABLE (never re-asserts a NOT
// NULL constraint — none of these 8 fields was ever `required` in the first
// place) and backfills each locale independently via its OWN
// `UPDATE ... FROM` statement per block table — NOT a single UPDATE joining
// both locale rows via an implicit inner join. Design D4 legalizes
// partial-locale docs (only `es` or only `en` translated, or neither for a
// given field) going forward, so by the time a rollback runs there may be no
// matching row for one locale in a given `_locales` table. Two independent
// per-locale UPDATEs recover whichever locale(s) still exist; an inner-join
// UPDATE would require BOTH locale rows to exist per parent and would
// silently discard the one locale that WAS present for any partial-locale
// block — the exact data-loss bug found and fixed in A1 (Engram obs #222)
// and confirmed as a live risk again in A1's (`452b767`)/A2's (`8c62cc0`)
// up()-side NOT NULL bugs.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cms_pages_blocks_case_studies" ADD COLUMN "eyebrow_es" varchar;
    ALTER TABLE "cms_pages_blocks_case_studies" ADD COLUMN "eyebrow_en" varchar;
    ALTER TABLE "cms_pages_blocks_case_studies" ADD COLUMN "title_es" varchar;
    ALTER TABLE "cms_pages_blocks_case_studies" ADD COLUMN "title_en" varchar;
    ALTER TABLE "cms_pages_blocks_case_studies" ADD COLUMN "subtitle_es" varchar;
    ALTER TABLE "cms_pages_blocks_case_studies" ADD COLUMN "subtitle_en" varchar;
    ALTER TABLE "cms_pages_blocks_blog" ADD COLUMN "eyebrow_es" varchar;
    ALTER TABLE "cms_pages_blocks_blog" ADD COLUMN "eyebrow_en" varchar;
    ALTER TABLE "cms_pages_blocks_blog" ADD COLUMN "title_es" varchar;
    ALTER TABLE "cms_pages_blocks_blog" ADD COLUMN "title_en" varchar;
    ALTER TABLE "cms_pages_blocks_blog" ADD COLUMN "subtitle_es" varchar;
    ALTER TABLE "cms_pages_blocks_blog" ADD COLUMN "subtitle_en" varchar;
    ALTER TABLE "cms_pages_blocks_contact" ADD COLUMN "title_es" varchar;
    ALTER TABLE "cms_pages_blocks_contact" ADD COLUMN "title_en" varchar;
    ALTER TABLE "cms_pages_blocks_contact" ADD COLUMN "subtitle_es" varchar;
    ALTER TABLE "cms_pages_blocks_contact" ADD COLUMN "subtitle_en" varchar;

    UPDATE "cms_pages_blocks_case_studies" AS p SET
      eyebrow_es = l_es.eyebrow, title_es = l_es.title, subtitle_es = l_es.subtitle
    FROM "cms_pages_blocks_case_studies_locales" AS l_es
    WHERE l_es."_parent_id" = p.id AND l_es."_locale" = 'es';
    UPDATE "cms_pages_blocks_case_studies" AS p SET
      eyebrow_en = l_en.eyebrow, title_en = l_en.title, subtitle_en = l_en.subtitle
    FROM "cms_pages_blocks_case_studies_locales" AS l_en
    WHERE l_en."_parent_id" = p.id AND l_en."_locale" = 'en';

    UPDATE "cms_pages_blocks_blog" AS p SET
      eyebrow_es = l_es.eyebrow, title_es = l_es.title, subtitle_es = l_es.subtitle
    FROM "cms_pages_blocks_blog_locales" AS l_es
    WHERE l_es."_parent_id" = p.id AND l_es."_locale" = 'es';
    UPDATE "cms_pages_blocks_blog" AS p SET
      eyebrow_en = l_en.eyebrow, title_en = l_en.title, subtitle_en = l_en.subtitle
    FROM "cms_pages_blocks_blog_locales" AS l_en
    WHERE l_en."_parent_id" = p.id AND l_en."_locale" = 'en';

    UPDATE "cms_pages_blocks_contact" AS p SET
      title_es = l_es.title, subtitle_es = l_es.subtitle
    FROM "cms_pages_blocks_contact_locales" AS l_es
    WHERE l_es."_parent_id" = p.id AND l_es."_locale" = 'es';
    UPDATE "cms_pages_blocks_contact" AS p SET
      title_en = l_en.title, subtitle_en = l_en.subtitle
    FROM "cms_pages_blocks_contact_locales" AS l_en
    WHERE l_en."_parent_id" = p.id AND l_en."_locale" = 'en';

    DROP TABLE "cms_pages_blocks_case_studies_locales" CASCADE;
    DROP TABLE "cms_pages_blocks_blog_locales" CASCADE;
    DROP TABLE "cms_pages_blocks_contact_locales" CASCADE;
  `)
}
