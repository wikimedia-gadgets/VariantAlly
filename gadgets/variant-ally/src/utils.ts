// Including:
// - w.wiki (preserve short link destination)
const BLOCKED_REFERRER_HOST = /^w\.wiki$/i;

function isLoggedIn(): boolean {
  return mw.user.isNamed();
}

/**
 * Check whether referrer originates from the same domain.
 */
function isReferrerSelf(): boolean {
  try {
    return new URL(document.referrer).hostname === location.hostname;
  } catch {
    // Invalid URL
    return false;
  }
}

function isReferrerBlocked(): boolean {
  try {
    return BLOCKED_REFERRER_HOST.test(new URL(document.referrer).hostname);
  } catch {
    // Invalid URL
    return false;
  }
}

function isViewingPage(): boolean {
  return mw.config.get('wgAction') === 'view';
}

/**
 * Check whether the current language (set in user preference or by ?uselang=xxx)
 * is Chinese or not.
 */
function isLangChinese(): boolean {
  return mw.config.get('wgUserLanguage').startsWith('zh');
}

function isWikitextPage(): boolean {
  return mw.config.get('wgCanonicalNamespace') !== 'Special'
    && mw.config.get('wgPageContentModel') === 'wikitext';
}

export {
  isLoggedIn,
  isReferrerSelf,
  isReferrerBlocked,
  isViewingPage,
  isLangChinese,
  isWikitextPage,
};
