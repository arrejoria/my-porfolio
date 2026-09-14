import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// payload-i18n-migration A2 (posts) — design D6 split, second half.
// Migration N (`localize_posts`) created `cms_posts_locales` and backfilled
// it. This migration (N+1) drops the now-redundant legacy `_es`/`_en`
// columns on `cms_posts` once the satellite table is the source of truth.
//
// NOTE — up()/down() are NOT symmetric in effort, same as the A1 pilot's
// companion migration (migrations/20260914_204004_drop_case_studies_
// legacy_locale_columns.ts). This migration's down() is restorative: it
// re-adds the legacy columns and attempts to recover their pre-conversion
// data by backfilling from `cms_posts_locales`. Each locale (`es`, `en`) is
// restored via its OWN independent `UPDATE ... FROM` statement — NOT a
// single UPDATE joining both locale rows via an implicit inner join — so a
// rollback recovers whichever locale(s) still have a matching row in
// `cms_posts_locales`, even for docs where only one locale was ever
// translated (design D4 allows partial-locale docs). A single joined
// UPDATE would require BOTH locale rows to exist per parent and would
// silently discard the one locale that WAS present for any partial-locale
// doc — this is the exact data-loss bug found and fixed in A1 (Engram
// obs #222), applied correctly here from the start. This migration doesn't
// need to run before its own `up()`'s companion N migration is ever rolled
// back independently; the two are meant to be rolled back together.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_posts" DROP COLUMN "title_es";
  ALTER TABLE "cms_posts" DROP COLUMN "title_en";
  ALTER TABLE "cms_posts" DROP COLUMN "excerpt_es";
  ALTER TABLE "cms_posts" DROP COLUMN "excerpt_en";
  ALTER TABLE "cms_posts" DROP COLUMN "content_es";
  ALTER TABLE "cms_posts" DROP COLUMN "content_en";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_posts" ADD COLUMN "title_es" varchar;
  ALTER TABLE "cms_posts" ADD COLUMN "title_en" varchar;
  ALTER TABLE "cms_posts" ADD COLUMN "excerpt_es" varchar;
  ALTER TABLE "cms_posts" ADD COLUMN "excerpt_en" varchar;
  ALTER TABLE "cms_posts" ADD COLUMN "content_es" jsonb;
  ALTER TABLE "cms_posts" ADD COLUMN "content_en" jsonb;
  UPDATE "cms_posts" AS p SET
    title_es = l_es.title, excerpt_es = l_es.excerpt, content_es = l_es.content
  FROM "cms_posts_locales" AS l_es
  WHERE l_es."_parent_id" = p.id AND l_es."_locale" = 'es';
  UPDATE "cms_posts" AS p SET
    title_en = l_en.title, excerpt_en = l_en.excerpt, content_en = l_en.content
  FROM "cms_posts_locales" AS l_en
  WHERE l_en."_parent_id" = p.id AND l_en."_locale" = 'en';`)
}
