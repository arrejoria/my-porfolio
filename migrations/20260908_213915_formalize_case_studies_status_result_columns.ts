import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// This migration formalizes schema that was already applied to every real
// database (local dev + any environment provisioned before `db.push:false`
// landed) via Payload's dev-mode auto-push, but was never captured by a
// committed migration file. `status`/`result` were added to
// lib/payload/collections/case-studies.ts in commit 7adcc59; auto-push kept
// dev DBs in sync silently, so the columns already exist everywhere this
// migration will run. The generated SQL is therefore guarded (`IF NOT
// EXISTS`, duplicate-object exception) so it is a no-op on a DB that already
// has the drift (the expected case) while still being a real, executable
// migration for a hypothetical DB that started from a clean
// `initial_schema` and never had auto-push run against it.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_cms_case_studies_status" AS ENUM('live', 'in-progress');
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;
  ALTER TABLE "cms_case_studies" ADD COLUMN IF NOT EXISTS "status" "enum_cms_case_studies_status" DEFAULT 'live' NOT NULL;
  ALTER TABLE "cms_case_studies" ADD COLUMN IF NOT EXISTS "result_es" varchar;
  ALTER TABLE "cms_case_studies" ADD COLUMN IF NOT EXISTS "result_en" varchar;`)
}

// NOTE — up()/down() are NOT symmetric, and that's intentional.
// up() is a catch-up no-op on every real database (the columns already
// exist there via old dev auto-push), so running it does not touch any
// data. down(), however, is NOT guarded: it unconditionally DROPs the
// `status`/`result_es`/`result_en` columns and the enum type, which WILL
// permanently delete live case-study status/result data if this migration
// is ever rolled back (e.g. `payload migrate:down` during a bad-deploy
// rollback). This migration doesn't "own" that data — it only formalizes
// pre-existing schema — but reversing it still destroys whatever is
// currently stored in those columns. Do not roll this back without first
// confirming that data loss is acceptable or has been backed up.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_case_studies" DROP COLUMN "status";
  ALTER TABLE "cms_case_studies" DROP COLUMN "result_es";
  ALTER TABLE "cms_case_studies" DROP COLUMN "result_en";
  DROP TYPE "public"."enum_cms_case_studies_status";`)
}
