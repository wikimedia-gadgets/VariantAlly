// Including:
// - w.wiki
const BLOCKED_REFERRER_HOST = /^w\.wiki$/i;

function isLoggedIn(): boolean {
  return mw.config.exists('wgUserId');
}

function isReferrerBlocked(): boolean {
  try {
    const referrerHostname = new URL(document.referrer).hostname;
    return referrerHostname === location.hostname
      || BLOCKED_REFERRER_HOST.test(referrerHostname);
  } catch {
    // Invalid URL
    return false;
  }
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

export { isLoggedIn, isReferrerBlocked, isLangChinese, isWikitextPage };
