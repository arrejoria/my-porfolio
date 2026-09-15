import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { Post } from '../lib/payload/payload-types'

// payload-i18n-migration A2 (posts) — design D6 split, replaying the A1
// case-studies pilot's playbook verbatim. This migration (N) creates the
// `cms_posts_locales` satellite table (the shape Payload's native
// `localization` uses for `localized: true` fields) and backfills it from
// the legacy `title_es`/`title_en`/`excerpt_es`/`excerpt_en`/`content_es`/
// `content_en` columns. The paired migration N+1
// (`drop_posts_legacy_locale_columns`) drops those now-redundant columns.
// Splitting the two keeps a real rollback point between "new storage
// exists and is backfilled" and "old storage is gone" — see that
// migration's own header for the down() asymmetry this implies.
//
// Unlike A1, `payload migrate:create` here proposed ONLY the posts diff —
// no `cms_pages_locales`/meta noise, since that pre-existing drift was
// already fixed out-of-band (commit 91dcd51, `payload.config.ts`'s
// `DELOCALIZED_SEO_META_FIELD_NAMES` strips `localized` from the SEO
// plugin's meta fields). No snapshot hand-correction was needed for this
// migration.
//
// `content` is `richText` (lexical jsonb) and per the spec's "RichText
// backfill uses Local API" requirement MUST NOT be backfilled with
// hand-written SQL against lexical JSON. The `cms_posts_locales` row is
// inserted with a placeholder empty lexical document (to satisfy the
// column's NOT NULL constraint at insert time, matching `content`'s
// `required: true` field config) and then overwritten per-locale via
// `payload.update()`, passing `req` so both writes join this migration's
// transaction.
//
// Same gotcha as A1: `payload.update()` upserts the ENTIRE `cms_posts` row
// using the CURRENT config's column set, which no longer includes the
// legacy `title_es`/`title_en`/`excerpt_es`/`excerpt_en`/`content_es`/
// `content_en` columns. Those legacy columns are still physically NOT NULL
// at this point in migration N (they aren't dropped until N+1), so
// Postgres rejects the upsert's implicit NULLs. They're relaxed to
// nullable below — a deliberate, temporary intermediate state; N+1 drops
// them outright.
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
   CREATE TABLE "cms_posts_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "cms_posts_locales" ADD CONSTRAINT "cms_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "cms_posts_locales_locale_parent_id_unique" ON "cms_posts_locales" USING btree ("_locale","_parent_id");`)

  // Backfill title/excerpt (plain text) via SQL — safe per the spec's
  // "Plain text backfill" scenario. `content` gets the placeholder here;
  // real values are written below via the Local API.
  //
  // The row's existence per locale is gated on "title_{locale}" IS NOT
  // NULL, not inserted unconditionally: `cms_posts_locales.title` and
  // `.excerpt` are both NOT NULL (mirroring the pre-migration fields'
  // `required: true` on both sub-fields), and design D4 legalizes
  // partial-locale docs — a legacy `title_es`/`title_en` (and its paired
  // `excerpt_{locale}`) value can legitimately be NULL (e.g. after a
  // down()+up() round-trip on a doc that was only ever translated in one
  // locale). Under the old bilingual() pattern, `title` and `excerpt` were
  // always written together per locale, so `title` alone is a reliable
  // proxy for "is this locale translated" — inserting unconditionally would
  // violate the NOT NULL constraint and abort the whole migration; skipping
  // the row for the untranslated locale instead matches Payload's own
  // runtime representation of "not translated" — an absent row, not a NULL
  // value in a NOT NULL column.
  const placeholder = JSON.stringify(emptyLexicalDoc)
  await db.execute(sql`
    INSERT INTO "cms_posts_locales" ("_locale", "_parent_id", "title", "excerpt", "content")
    SELECT 'es'::"public"."_locales", "id", "title_es", "excerpt_es", ${placeholder}::jsonb FROM "cms_posts" WHERE "title_es" IS NOT NULL
    UNION ALL
    SELECT 'en'::"public"."_locales", "id", "title_en", "excerpt_en", ${placeholder}::jsonb FROM "cms_posts" WHERE "title_en" IS NOT NULL;
  `)

  // Relax the legacy columns' NOT NULL constraint so the Local API upsert
  // below (which no longer targets these columns) doesn't violate it. N+1
  // drops the columns entirely.
  await db.execute(sql`
    ALTER TABLE "cms_posts" ALTER COLUMN "title_es" DROP NOT NULL;
    ALTER TABLE "cms_posts" ALTER COLUMN "title_en" DROP NOT NULL;
    ALTER TABLE "cms_posts" ALTER COLUMN "excerpt_es" DROP NOT NULL;
    ALTER TABLE "cms_posts" ALTER COLUMN "excerpt_en" DROP NOT NULL;
    ALTER TABLE "cms_posts" ALTER COLUMN "content_es" DROP NOT NULL;
    ALTER TABLE "cms_posts" ALTER COLUMN "content_en" DROP NOT NULL;
  `)

  // Backfill content (lexical richText) via the Local API — never
  // hand-write lexical JSON.
  const { rows } = await db.execute(
    sql`SELECT "id", "content_es", "content_en" FROM "cms_posts"`,
  )
  for (const row of rows as {
    id: number
    content_es: Post['content']
    content_en: Post['content']
  }[]) {
    await payload.update({
      collection: 'posts',
      id: row.id,
      locale: 'es',
      depth: 0,
      overrideAccess: true,
      req,
      data: { content: row.content_es },
    })
    await payload.update({
      collection: 'posts',
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
  // Intentionally does NOT restore the legacy columns' NOT NULL constraint.
  // Design D4 allows partial-locale docs (only `es` translated, `en` never
  // touched), so a genuinely-untranslated legacy column can legitimately be
  // NULL after rollback. Forcing NOT NULL here would throw on any such doc
  // and abort the transaction, leaving the DB in a broken hybrid state. This
  // down() is a best-effort restorative rollback, not a guarantee of exact
  // pre-migration schema state — nullable columns still hold and return
  // whatever data was actually backfilled.
  await db.execute(sql`
   ALTER TABLE "cms_posts_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms_posts_locales" CASCADE;`)
}
