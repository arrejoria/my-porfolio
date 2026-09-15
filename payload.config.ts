import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

// Relative imports (not the `@/*` tsconfig alias) so this config loads
// correctly under CLI tools that don't resolve tsconfig path aliases
// (e.g. `payload migrate:create --use-swc`), not just Next.js's bundler.
import { account, session, user, verification } from './lib/db/schema'
import { Admins } from './lib/payload/collections/admins'
import { CaseStudies } from './lib/payload/collections/case-studies'
import { Media } from './lib/payload/collections/media'
import { Pages } from './lib/payload/collections/pages'
import { Posts } from './lib/payload/collections/posts'
import { Projects } from './lib/payload/collections/projects'
import { SiteSettings } from './lib/payload/globals/site-settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// `@payloadcms/plugin-seo`'s MetaTitleField/MetaDescriptionField/
// MetaImageField hardcode `localized: true` in their own source, independent
// of whether the host app enables localization. Now that `localization` is
// configured below, those 3 fields would silently become locale-aware from
// Payload's perspective — but `cms_pages` still has flat, non-localized
// columns (no `cms_pages_locales` table). Strip `localized` from just those
// 3 stored fields (leaving the UI-only Overview/Preview fields untouched) to
// keep SEO meta single-language, matching both the DB schema and the
// deliberate design decision noted below.
const DELOCALIZED_SEO_META_FIELD_NAMES = new Set(['title', 'description', 'image'])

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app', '(payload)', 'admin'),
    },
    components: {
      beforeNavLinks: ['/components/ViewSiteDropdown#ViewSiteDropdown'],
    },
  },
  collections: [Admins, CaseStudies, Media, Pages, Posts, Projects],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  // `fallback: false` is deliberate (payload-i18n-migration design D1): with
  // fallback on, a server read that forgets `locale: 'all'` would silently
  // render Spanish text in the English UI with no error. With fallback off,
  // the same mistake yields absence, which routes into the already-built
  // `pick()`/`pickContent()` → lib/i18n/dictionary.ts fallback path instead.
  localization: {
    locales: [
      { label: 'Español', code: 'es' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'es',
    fallback: false,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'lib', 'payload', 'payload-types.ts'),
  },
  // Scoped to `pages` only — case-studies/posts/projects keep their own
  // dedicated bilingual copy fields and don't need a generic SEO tab.
  // NOTE: unlike every other bilingual field in this schema (all native
  // `localized: true` scalars as of payload-i18n-migration A1-A4), this
  // plugin's meta.title/meta.description/meta.image fields are
  // single-language only. Bilingual SEO support is deliberately deferred
  // to a future change, not implemented here.
  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => (doc && 'title' in doc ? doc.title : ''),
      // See DELOCALIZED_SEO_META_FIELD_NAMES above for why this is needed.
      fields: ({ defaultFields }) =>
        defaultFields.map((field) =>
          'name' in field && DELOCALIZED_SEO_META_FIELD_NAMES.has(field.name)
            ? { ...field, localized: false }
            : field,
        ),
    }),
  ],
  db: postgresAdapter({
    // Dev-mode auto-push was masking schema drift ("Pulling schema from
    // database..." on every request). Schema changes now require an
    // explicit, committed migration via `pnpm payload:migrate:create`.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    // Better Auth owns the `user`, `session`, `account` and `verification`
    // tables directly (see lib/db/schema.ts) and manages their own migrations.
    // Registering them here via beforeSchemaInit only makes Payload AWARE of
    // them (so its schema diffing doesn't think they're unmanaged/orphaned)
    // without Payload ever creating, altering, or dropping them itself —
    // no collection in this config maps to these slugs/table names.
    beforeSchemaInit: [
      ({ schema }) => ({
        ...schema,
        tables: {
          ...schema.tables,
          user,
          session,
          account,
          verification,
        },
      }),
    ],
  }),
  sharp,
})
