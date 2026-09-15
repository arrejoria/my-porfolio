import * as migration_20260829_024817_initial_schema from './20260829_024817_initial_schema';
import * as migration_20260908_213915_formalize_case_studies_status_result_columns from './20260908_213915_formalize_case_studies_status_result_columns';
import * as migration_20260908_214527_add_pages_layout_blocks_and_seo from './20260908_214527_add_pages_layout_blocks_and_seo';
import * as migration_20260914_204003_localize_case_studies from './20260914_204003_localize_case_studies';
import * as migration_20260914_204004_drop_case_studies_legacy_locale_columns from './20260914_204004_drop_case_studies_legacy_locale_columns';
import * as migration_20260914_215045_localize_posts from './20260914_215045_localize_posts';
import * as migration_20260914_215046_drop_posts_legacy_locale_columns from './20260914_215046_drop_posts_legacy_locale_columns';
import * as migration_20260915_035412_localize_projects from './20260915_035412_localize_projects';
import * as migration_20260915_141558_localize_homepage_blocks from './20260915_141558_localize_homepage_blocks';

export const migrations = [
  {
    up: migration_20260829_024817_initial_schema.up,
    down: migration_20260829_024817_initial_schema.down,
    name: '20260829_024817_initial_schema',
  },
  {
    up: migration_20260908_213915_formalize_case_studies_status_result_columns.up,
    down: migration_20260908_213915_formalize_case_studies_status_result_columns.down,
    name: '20260908_213915_formalize_case_studies_status_result_columns',
  },
  {
    up: migration_20260908_214527_add_pages_layout_blocks_and_seo.up,
    down: migration_20260908_214527_add_pages_layout_blocks_and_seo.down,
    name: '20260908_214527_add_pages_layout_blocks_and_seo',
  },
  {
    up: migration_20260914_204003_localize_case_studies.up,
    down: migration_20260914_204003_localize_case_studies.down,
    name: '20260914_204003_localize_case_studies',
  },
  {
    up: migration_20260914_204004_drop_case_studies_legacy_locale_columns.up,
    down: migration_20260914_204004_drop_case_studies_legacy_locale_columns.down,
    name: '20260914_204004_drop_case_studies_legacy_locale_columns',
  },
  {
    up: migration_20260914_215045_localize_posts.up,
    down: migration_20260914_215045_localize_posts.down,
    name: '20260914_215045_localize_posts',
  },
  {
    up: migration_20260914_215046_drop_posts_legacy_locale_columns.up,
    down: migration_20260914_215046_drop_posts_legacy_locale_columns.down,
    name: '20260914_215046_drop_posts_legacy_locale_columns',
  },
  {
    up: migration_20260915_035412_localize_projects.up,
    down: migration_20260915_035412_localize_projects.down,
    name: '20260915_035412_localize_projects',
  },
  {
    up: migration_20260915_141558_localize_homepage_blocks.up,
    down: migration_20260915_141558_localize_homepage_blocks.down,
    name: '20260915_141558_localize_homepage_blocks',
  },
];
