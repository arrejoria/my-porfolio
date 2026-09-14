import { describe, expect, it } from 'vitest'
import { validateUniqueBlockTypes } from './pages'

// `Validate` expects the full Payload validate-options object as its second
// argument — cast through `unknown` since these tests only exercise the
// value-based duplicate check and don't need real options.
const validate = (value: unknown) =>
  validateUniqueBlockTypes(value as never, {} as never)

describe('validateUniqueBlockTypes', () => {
  it('accepts null/undefined (no layout configured)', () => {
    expect(validate(null)).toBe(true)
    expect(validate(undefined)).toBe(true)
  })

  it('accepts an empty layout', () => {
    expect(validate([])).toBe(true)
  })

  it('accepts one block per type', () => {
    expect(
      validate([{ blockType: 'caseStudies' }, { blockType: 'blog' }, { blockType: 'contact' }]),
    ).toBe(true)
  })

  it('rejects two blocks of the same type', () => {
    const result = validate([{ blockType: 'caseStudies' }, { blockType: 'caseStudies' }])
    expect(result).toBe('Only one "caseStudies" block is allowed in this layout.')
  })

  it('reports the first duplicated type when multiple types repeat', () => {
    const result = validate([
      { blockType: 'blog' },
      { blockType: 'caseStudies' },
      { blockType: 'blog' },
      { blockType: 'caseStudies' },
    ])
    expect(result).toBe('Only one "blog" block is allowed in this layout.')
  })

  it('ignores malformed entries without a string blockType', () => {
    expect(validate([{ blockType: 42 }, {}])).toBe(true)
  })
})
