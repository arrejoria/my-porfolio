import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// payload-i18n-migration A1 (pilot slice) — design D6 split, second half.
// Migration N (`localize_case_studies`) created `cms_case_studies_locales`
// and backfilled it. This migration (N+1) drops the now-redundant legacy
// `_es`/`_en` columns on `cms_case_studies` once the satellite table is the
// source of truth.
//
// NOTE — up()/down() are NOT symmetric in effort, matching the convention
// established in migrations/20260908_213915_formalize_case_studies_status_
// result_columns.ts. down() re-adds the legacy columns and back-copies data
// from `cms_case_studies_locales`, so a rollback (e.g. `payload migrate:down`
// during a bad-deploy) restores a fully populated legacy shape rather than
// empty columns — but only for rows that still have both an `es` and an
// `en` row in `cms_case_studies_locales` at rollback time. This migration
// doesn't need to run before its own `up()`'s companion N migration is ever
// rolled back independently; the two are meant to be rolled back together.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_case_studies" DROP COLUMN "summary_es";
  ALTER TABLE "cms_case_studies" DROP COLUMN "summary_en";
  ALTER TABLE "cms_case_studies" DROP COLUMN "content_es";
  ALTER TABLE "cms_case_studies" DROP COLUMN "content_en";
  ALTER TABLE "cms_case_studies" DROP COLUMN "result_es";
  ALTER TABLE "cms_case_studies" DROP COLUMN "result_en";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_case_studies" ADD COLUMN "summary_es" varchar;
  ALTER TABLE "cms_case_studies" ADD COLUMN "summary_en" varchar;
  ALTER TABLE "cms_case_studies" ADD COLUMN "content_es" jsonb;
  ALTER TABLE "cms_case_studies" ADD COLUMN "content_en" jsonb;
  ALTER TABLE "cms_case_studies" ADD COLUMN "result_es" varchar;
  ALTER TABLE "cms_case_studies" ADD COLUMN "result_en" varchar;
  UPDATE "cms_case_studies" AS cs SET
    summary_es = l_es.summary, content_es = l_es.content, result_es = l_es.result,
    summary_en = l_en.summary, content_en = l_en.content, result_en = l_en.result
  FROM "cms_case_studies_locales" AS l_es, "cms_case_studies_locales" AS l_en
  WHERE l_es."_parent_id" = cs.id AND l_es."_locale" = 'es'
    AND l_en."_parent_id" = cs.id AND l_en."_locale" = 'en';`)
}
