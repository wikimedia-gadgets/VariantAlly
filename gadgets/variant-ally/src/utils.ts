// Including:
// - w.wiki
const BLOCKED_REFERRER_HOST = /^w\.wiki$/i;

// Used to suppress exceptions of URL constructor
const DUMMY_REFERRER = 'a:';

function isLoggedIn(): boolean {
  return mw.config.exists('wgUserId');
}

function isReferrerBlocked(): boolean {
  const referrerHostname = new URL(document.referrer || DUMMY_REFERRER).hostname;
  return referrerHostname === location.hostname
    || BLOCKED_REFERRER_HOST.test(referrerHostname);
}

/**
 * Check whether the current language (set in user preference or by ?uselang=xxx)
 * is Chinese or not.
 */
function isLangChinese(): boolean {
  return mw.config.get('wgUserLanguage').startsWith('zh');
}

export { isLoggedIn, isReferrerBlocked, isLangChinese };
