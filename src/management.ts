// Variant-management related code.

const LOCAL_STORAGE_KEY = 'var-pref';
const EXPERIENCED_USERS = [
  'TheresNoTime',
  'WMFOffice',
];

function isExperiencedUser(): boolean {
  if (!isLoggedIn()) {
    return false;
  }
  const username = mw.config.get('wgUserName');
  return mw.config.get('wgUserGroups').includes('extendedconfirmed')
    || username.endsWith(' (WMF)')
    || username.endsWith(' (WMDE)')
    || EXPERIENCED_USERS.includes(username);
}

function isLoggedIn(): boolean {
  return mw.config.exists('wgUserId');
}

/**
 * Get current variant of the page (don't be misled by config naming).
 * @returns variant, null for non-wikitext page
 */
function getPageVariant(): string | null {
  return mw.config.get('wgUserVariant');
}

/**
 * Get account variant.
 * @returns account variant, null for anonymous user
 */
function getAccountVariant(): string | null {
  if (isLoggedIn()) {
    return mw.user.options.get('variant');
  }
  return null;
}

function getLocalVariant(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

/**
 * Calculate preferred variant from Special:Preferences (logged-in users)
 * or local storage (anonymous users). Resets local storage if there's a conflict.
 * @returns preferred variant
 */
function calculatePreferredVariant(): string | null {
  const localVariant = getLocalVariant();
  const accountVariant = getAccountVariant();

  if (accountVariant !== null) {
    if (localVariant === null) {
      setPreferredVariant(accountVariant);
    }
    return accountVariant;
  }

  return localVariant;
}

function setPreferredVariant(variant: string): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, variant);
}

async function showDialog(): Promise<void> {
  // Use dynamic import to improve performance
  const { default: DialogVue } = await import('./components/Dialog.vue');
  const { createMwApp } = await import('vue');
  createMwApp(DialogVue).mount(document.body);
}

export {
  isExperiencedUser,
  isLoggedIn,
  getPageVariant,
  getAccountVariant,
  getLocalVariant,
  calculatePreferredVariant,
  setPreferredVariant,
  showDialog,
};
