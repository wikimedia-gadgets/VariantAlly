// Variant related code.

const LOCAL_STORAGE_KEY = 'var-pref';

function isExperiencedUser(): boolean {
  return mw.config.get('wgUserGroups').includes('extendedconfirmed')
    || mw.config.get('wgUserName').endsWith(' (WMF)');
}

function isLoggedIn(): boolean {
  return mw.config.exists('wgUserId');
}

/**
 * Get current variant of the page.
 * @returns variant
 */
function getCurrentVariant(): string | null {
  return mw.config.get('wgUserVariant');
}

/**
 * Get preferred variant from Special:Preferences (logged-in users)
 * or local storage (anonymous users). Resets local storage if there's a conflict.
 * @returns preferred variant
 */
// TODO: Should we use isExperiencedUser?
function getPreferredVariant(): string | null {
  const localVariant = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (isLoggedIn()) {
    const accountVariant: string = mw.user.options.get('variant');
    if (localVariant !== null && accountVariant !== localVariant) {
      setPreferredVariant(accountVariant);
    }
    return accountVariant;
  }

  return localVariant;
}

function setPreferredVariant(variant: string): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, variant);
}

export {
  isLoggedIn,
  getCurrentVariant,
  getPreferredVariant,
  setPreferredVariant,
}
