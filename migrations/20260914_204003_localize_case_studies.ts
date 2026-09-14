import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { CaseStudy } from '../lib/payload/payload-types'

// payload-i18n-migration A1 (pilot slice) — design D6 split. This migration
// (N) creates the `cms_case_studies_locales` satellite table (the shape
// Payload's native `localization` uses for `localized: true` fields) and
// backfills it from the legacy `summary_es`/`summary_en`/`content_es`/
// `content_en`/`result_es`/`result_en` columns. The paired migration N+1
// (`drop_case_studies_legacy_locale_columns`) drops those now-redundant
// columns. Splitting the two keeps a real rollback point between "new
// storage exists and is backfilled" and "old storage is gone" — see that
// migration's own header for the down() asymmetry this implies.
//
// `payload migrate:create` also proposed an unrelated `cms_pages_locales`
// table + drop of `cms_pages.meta_title/meta_description/meta_image_id` in
// the same diff. That is NOT case-studies — it is `@payloadcms/plugin-seo`'s
// `meta` fields (hardcoded `localized: true` in the plugin itself) finally
// taking effect now that `payload.config.ts`'s `localization` block landed
// in A0/PR1 (previously a no-op with no locale config to key off of). That
// change belongs to the `pages` collection, which slice B1 owns per the
// design's file-change table — it is intentionally excluded here and will
// surface again the next time `payload migrate:create` runs against a DB
// that has this migration applied but no `cms_pages_locales` migration yet.
//
// IMPORTANT for whoever runs the next `payload migrate:create` (A2/A3/A4/
// B1): `buildCreateMigration` (@payloadcms/drizzle) diffs against the
// alphabetically LATEST `.json` snapshot file on disk, not live DB
// introspection (see node_modules/@payloadcms/drizzle/dist/utilities/
// buildCreateMigration.js). The snapshot `payload migrate:create` originally
// generated alongside this file included the `cms_pages_locales`/meta diff
// above — left as-is, the NEXT `migrate:create` would have silently treated
// that pending drift as "already applied" (since the snapshot said so) and
// never proposed it again, permanently losing it. This file's companion
// `.json` has been hand-corrected to represent ONLY what actually ran:
// `cms_case_studies_locales` created, the 6 legacy `cms_case_studies`
// columns fully dropped (i.e. the combined end-state of THIS migration and
// the paired `drop_case_studies_legacy_locale_columns` migration — there is
// no separate `.json` for that second file), and `cms_pages`/
// `cms_pages_locales` restored to their pre-A1 shape. Verified by running
// `payload migrate:create` again after the correction and confirming it
// proposed only the `cms_pages_locales`/meta diff, with zero case-studies
// noise and no redundant `_locales` enum re-creation.
//
// `content` is `richText` (lexical jsonb) and per the spec's "RichText
// backfill uses Local API" requirement MUST NOT be backfilled with
// hand-written SQL against lexical JSON. The `cms_case_studies_locales`
// row is inserted with a placeholder empty lexical document (to satisfy the
// column's NOT NULL constraint at insert time, matching `content`'s
// `required: true` field config) and then overwritten per-locale via
// `payload.update()`, passing `req` so both writes join this migration's
// transaction.
//
// Gotcha discovered running this migration: `payload.update()` upserts the
// ENTIRE `cms_case_studies` row using the CURRENT config's column set, which
// no longer includes the legacy `summary_es`/`summary_en`/`content_es`/
// `content_en` columns (they were removed from the field config, only
// `result_es`/`result_en` stay nullable since `result` was never
// `required`). Those legacy columns are still physically NOT NULL at this
// point in migration N (they aren't dropped until N+1), so Postgres rejects
// the upsert's implicit NULLs. They're relaxed to nullable below — a
// deliberate, temporary intermediate state; N+1 drops them outright.
const emptyLexicalDoc = {
  root: {
    type: 'root',
    children: [],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TABLE "cms_case_studies_locales" (
  	"summary" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"result" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  ALTER TABLE "cms_case_studies_locales" ADD CONSTRAINT "cms_case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_case_studies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "cms_case_studies_locales_locale_parent_id_unique" ON "cms_case_studies_locales" USING btree ("_locale","_parent_id");`)

  // Backfill summary/result (plain text) via SQL — safe per the spec's
  // "Plain text backfill" scenario. `content` gets the placeholder here;
  // real values are written below via the Local API.
  const placeholder = JSON.stringify(emptyLexicalDoc)
  await db.execute(sql`
    INSERT INTO "cms_case_studies_locales" ("_locale", "_parent_id", "summary", "result", "content")
    SELECT 'es'::"public"."_locales", "id", "summary_es", "result_es", ${placeholder}::jsonb FROM "cms_case_studies"
    UNION ALL
    SELECT 'en'::"public"."_locales", "id", "summary_en", "result_en", ${placeholder}::jsonb FROM "cms_case_studies";
  `)

  // Relax the legacy columns' NOT NULL constraint so the Local API upsert
  // below (which no longer targets these columns) doesn't violate it. N+1
  // drops the columns entirely.
  await db.execute(sql`
    ALTER TABLE "cms_case_studies" ALTER COLUMN "summary_es" DROP NOT NULL;
    ALTER TABLE "cms_case_studies" ALTER COLUMN "summary_en" DROP NOT NULL;
    ALTER TABLE "cms_case_studies" ALTER COLUMN "content_es" DROP NOT NULL;
    ALTER TABLE "cms_case_studies" ALTER COLUMN "content_en" DROP NOT NULL;
  `)

  // Backfill content (lexical richText) via the Local API — never
  // hand-write lexical JSON.
  const { rows } = await db.execute(
    sql`SELECT "id", "content_es", "content_en" FROM "cms_case_studies"`,
  )
  for (const row of rows as {
    id: number
    content_es: CaseStudy['content']
    content_en: CaseStudy['content']
  }[]) {
    await payload.update({
      collection: 'case-studies',
      id: row.id,
      locale: 'es',
      depth: 0,
      overrideAccess: true,
      req,
      data: { content: row.content_es },
    })
    await payload.update({
      collection: 'case-studies',
      id: row.id,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
      req,
      data: { content: row.content_en },
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_case_studies_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms_case_studies_locales" CASCADE;
  DROP TYPE "public"."_locales";
  ALTER TABLE "cms_case_studies" ALTER COLUMN "summary_es" SET NOT NULL;
  ALTER TABLE "cms_case_studies" ALTER COLUMN "summary_en" SET NOT NULL;
  ALTER TABLE "cms_case_studies" ALTER COLUMN "content_es" SET NOT NULL;
  ALTER TABLE "cms_case_studies" ALTER COLUMN "content_en" SET NOT NULL;`)
}
