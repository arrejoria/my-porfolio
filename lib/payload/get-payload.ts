import { getPayload as getPayloadInstance } from 'payload'
import config from '@payload-config'

// Payload caches its own instance internally, but memoizing the resolved
// config promise here avoids re-importing/re-building it on every call
// within the same server process.
let cached: ReturnType<typeof getPayloadInstance> | null = null

export function getPayload() {
  if (!cached) {
    cached = getPayloadInstance({ config })
  }
  return cached
}
