import { Cache } from 'cache-manager';

const DEFAULT_INITIAL_TAG = 1;

export const REHAB_ORG_LIST_TAG_KEY = 'rehabOrg:listTag';

export const REHAB_CAMPUS_LIST_TAG_KEY = 'rehabCampus:listTag';

export const REHAB_PROGRAM_LIST_TAG_KEY = 'rehabProgram:listTag';

export const PARENT_COMPANY_LIST_TAG_KEY = 'parentCompany:listTag';
/**
 * Get or initialize the current "list tag" (version) for a given stable key.
 *
 * stableKey is your namespace, e.g.:
 *  - "rehabOrgs"
 *  - "rehabPrograms"
 *  - "rehabCampuses"
 */
export async function getListTag(
  cache: Cache,
  stableKey: string,
): Promise<number> {
  const tagKey = `${stableKey}:listTag`;

  const existing = await cache.get<number>(tagKey);

  if (typeof existing === 'number' && Number.isFinite(existing)) {
    return existing;
  }

  // Initialize tag if it's missing
  await cache.set(tagKey, DEFAULT_INITIAL_TAG, 0); // ttl 0 => no expiry
  return DEFAULT_INITIAL_TAG;
}

/**
 * Bump the list tag (version) for the given stable key.
 * Call this after any mutation that invalidates list caches
 * for that namespace.
 */
export async function bumpListTag(
  cache: Cache,
  stableKey: string,
): Promise<void> {
  const tagKey = `${stableKey}:listTag`;
  const current = await getListTag(cache, stableKey);

  await cache.set(tagKey, current + 1, 0); // keep it non-expiring
}

/**
 * Simple hash for filter objects so they’re usable in a cache key.
 * You can swap this for a real hash lib later if you want.
 */
function hashFilters(obj: unknown): string {
  const json = JSON.stringify(obj ?? {});
  let hash = 0;

  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) | 0;
  }

  return hash.toString(16);
}

/**
 * Build a versioned list cache key for any model.
 *
 * stableKey:  namespace for the model, e.g. "rehabOrgs"
 * operation:  e.g. "findMany" (default) but can be "search", etc.
 */
export async function makeListCacheKey(
  cache: Cache,
  stableKey: string,
  filtersWithoutPagination: unknown,
  operation = 'findMany',
): Promise<string> {
  const tag = await getListTag(cache, stableKey);
  const filtersHash = hashFilters(filtersWithoutPagination);

  // Example result: "rehabOrgs:findMany:v3:a1b2c3"
  return `${stableKey}:${operation}:v${tag}:${filtersHash}`;
}
