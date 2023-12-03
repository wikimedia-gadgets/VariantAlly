import { isLoggedIn } from './utils';

const LOCAL_VARIANT_KEY = 'va-var';
const OPTOUT_KEY = 'va-optout';
const VALID_VARIANTS = [
  'zh-cn',
  'zh-sg',
  'zh-my',
  'zh-tw',
  'zh-hk',
  'zh-mo',
] as const;
const VARIANTS = [
  'zh',
  'zh-hans',
  'zh-hant',
  ...VALID_VARIANTS,
] as const;
// Maps additional lang codes to MediaWiki variants
const BCP47_MAPPING: Record<string, ValidVariant> = {
  'zh-hans-cn': 'zh-cn',
  'zh-hans-sg': 'zh-sg',
  'zh-hans-my': 'zh-my',
  'zh-hant-tw': 'zh-tw',
  'zh-hant-hk': 'zh-hk',
  'zh-hant-mo': 'zh-mo',
};

type ValidVariant = typeof VALID_VARIANTS[number];
type Variant = typeof VARIANTS[number];

function isVariant(str: string): str is Variant {
  return (VARIANTS as ReadonlyArray<string>).includes(str);
}

function isValidVariant(str: string): str is ValidVariant {
  return (VALID_VARIANTS as ReadonlyArray<string>).includes(str);
}

function isSpecialPage(): boolean {
  return mw.config.get('wgCanonicalNamespace') === 'Special';
}

/**
 * Get current variant of the page (don't be misled by config naming).
 * @returns variant, null for non-wikitext page
 */
function getPageVariant(): Variant | null {
  const result = mw.config.get('wgUserVariant');
  return isVariant(result) ? result : null;
}

/**
 * Get account variant.
 * @returns account variant, null for anonymous user
 */
function getAccountVariant(): Variant | null {
  if (isLoggedIn()) {
    const result = mw.user.options.get('variant');
    return isVariant(result) ? result : null;
  }
  return null;
}

function getLocalVariant(): Variant | null {
  const result = localStorage.getItem(LOCAL_VARIANT_KEY);
  if (result === null || !isVariant(result)) {
    return null;
  }
  return result;
}

/**
 * Return browser language if it's a Chinese variant.
 * @returns browser variant
 */
function getBrowserVariant(): Variant | null {
  return navigator.languages
    .map((lang) => lang.toLowerCase())
    .map((lang) => BCP47_MAPPING[lang] ?? lang)
    .find((lang) => isVariant(lang)) as Variant
    ?? null;
}

/**
 * Get the "natural" variant inferred by MediaWiki when the link doesn't specify a variant.
 *
 * Used in link normalization.
 *
 * Only return valid variants, null otherwise.
 *
 * @returns variant
 */
function getMediaWikiVariant(): Variant | null {
  return getAccountVariant() ?? getBrowserVariant();
}

/**
 * Calculate preferred variant from browser variant, local variant and account variant.
 *
 * Priority: account variant > browser variant > local variant
 *
 * @returns preferred variant
 */
function calculatePreferredVariant(): ValidVariant | null {
  const result = getAccountVariant() ?? getBrowserVariant() ?? getLocalVariant();
  if (result === null || !isValidVariant(result)) {
    return null;
  }
  // Optimistically set local variant to be equal to browser variant
  // In case the user's browser language becomes invalid in the future,
  // this reduces the possibility to show prompt to disrupt users.
  setLocalVariant(result);
  return result;
}

function setLocalVariant(variant: Variant): void {
  localStorage.setItem(LOCAL_VARIANT_KEY, variant);
}

function setOptOut(): void {
  localStorage.setItem(OPTOUT_KEY, '');
}

function isOptOuted(): boolean {
  return localStorage.getItem(OPTOUT_KEY) !== null;
}

export {
  type ValidVariant,
  type Variant,
  isVariant,
  isValidVariant,
  isSpecialPage,
  getPageVariant,
  getAccountVariant,
  getLocalVariant,
  getBrowserVariant,
  getMediaWikiVariant,
  calculatePreferredVariant,
  setLocalVariant,
  setOptOut,
  isOptOuted,
};
