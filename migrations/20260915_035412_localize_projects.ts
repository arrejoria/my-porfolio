import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// payload-i18n-migration A3 (projects) — design D6. Unlike case-studies (A1)
// and posts (A2), `description` is plain `text` with no `richText` field on
// this collection, so a single additive migration is sufficient — no N/N+1
// split, no NOT-NULL-relaxation dance, and no Local API backfill loop (see
// the A1/A2 apply-progress "Reusable playbook" section for why those steps
// exist only when richText is involved). This migration creates the
// `cms_projects_locales` satellite table, backfills it via plain SQL
// (`INSERT ... SELECT`, safe per the spec's "Plain text backfill" scenario),
// and drops the now-redundant `description_es`/`description_en` legacy
// columns, all in `up()`.
//
// `payload migrate:create` produced a CLEAN single-collection diff for this
// slice — no `cms_pages_locales`/SEO-meta noise (that drift was already
// fixed out-of-band, commit `91dcd51`, before A2 started). No `.json`
// snapshot hand-correction was needed.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cms_projects_locales" (
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "cms_projects_locales" ADD CONSTRAINT "cms_projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "cms_projects_locales_locale_parent_id_unique" ON "cms_projects_locales" USING btree ("_locale","_parent_id");`)

  // Backfill (plain text) via SQL — safe per the spec's "Plain text
  // backfill" scenario. No richText field on this collection, so there is
  // no placeholder-then-Local-API-overwrite step like A1/A2's `content`.
  //
  // `description` IS NOT NULL is filtered per locale rather than inserted
  // unconditionally: `cms_projects_locales.description` is itself NOT NULL
  // (mirrors the field's `required: true`), and design D4 legalizes
  // partial-locale docs — a legacy `description_es`/`description_en` value
  // can legitimately be NULL (e.g. after a down()+up() round-trip on a doc
  // that was only ever translated in one locale). Inserting unconditionally
  // would violate the NOT NULL constraint and abort the whole migration;
  // skipping the row for the untranslated locale instead matches Payload's
  // own runtime representation of "not translated" — an absent row, not a
  // NULL value in a NOT NULL column — which is exactly what a fresh Payload
  // write for an untranslated locale would produce.
  await db.execute(sql`
    INSERT INTO "cms_projects_locales" ("_locale", "_parent_id", "description")
    SELECT 'es'::"public"."_locales", "id", "description_es" FROM "cms_projects" WHERE "description_es" IS NOT NULL
    UNION ALL
    SELECT 'en'::"public"."_locales", "id", "description_en" FROM "cms_projects" WHERE "description_en" IS NOT NULL;
  `)

  // No richText backfill loop and no intermediate NOT-NULL relaxation are
  // needed here (unlike A1/A2) — the legacy columns can be dropped outright
  // in the same migration since nothing else still targets them.
  await db.execute(sql`
    ALTER TABLE "cms_projects" DROP COLUMN "description_es";
    ALTER TABLE "cms_projects" DROP COLUMN "description_en";
  `)
}

// down() is restorative, not a guarantee of exact pre-migration schema
// state: it re-adds the legacy columns as NULLABLE (never re-asserts the
// original NOT NULL constraint) and backfills each locale independently via
// its OWN `UPDATE ... FROM` statement — NOT a single UPDATE joining both
// locale rows via an implicit inner join. Design D4 legalizes partial-locale
// docs (only `es` or only `en` translated) going forward, so by the time a
// rollback runs there may be no matching row for one locale in
// `cms_projects_locales`. Two independent per-locale UPDATEs recover
// whichever locale(s) still exist; an inner-join UPDATE would require BOTH
// locale rows to exist per parent and would silently discard the one locale
// that WAS present for any partial-locale doc — the exact data-loss bug
// found and fixed in A1 (Engram obs #222) and confirmed as a live risk again
// in A1's (`452b767`) and A2's (`8c62cc0`) `up()`-side NOT NULL bugs. Forcing
// NOT NULL back on these columns here would throw ("contains null values")
// for any genuinely-untranslated locale and abort the whole rollback
// transaction, leaving the DB in a broken hybrid state (legacy columns and
// the `_locales` satellite table both present simultaneously). A nullable
// column still correctly holds/returns whatever was actually backfilled.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_projects" ADD COLUMN "description_es" varchar;
  ALTER TABLE "cms_projects" ADD COLUMN "description_en" varchar;
  UPDATE "cms_projects" AS p SET
    description_es = l_es.description
  FROM "cms_projects_locales" AS l_es
  WHERE l_es."_parent_id" = p.id AND l_es."_locale" = 'es';
  UPDATE "cms_projects" AS p SET
    description_en = l_en.description
  FROM "cms_projects_locales" AS l_en
  WHERE l_en."_parent_id" = p.id AND l_en."_locale" = 'en';
  ALTER TABLE "cms_projects_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms_projects_locales" CASCADE;`)
}
