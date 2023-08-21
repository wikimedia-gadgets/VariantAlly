// Trusted users who have activity in zh.wp but are not yet extendedconfirmed
const EXPERIENCED_USERS = [
  'WMFOffice',
];

// Including:
// - w.wiki
const BLOCKED_REFERRER_HOST = /^w\.wiki$/i;

// Used to suppress exceptions of URL constructor
const DUMMY_REFERRER = 'a:';

function isExperiencedUser(): boolean {
  if (!isLoggedIn()) {
    return false;
  }

  const groups = mw.config.get('wgUserGroups');
  const username = mw.config.get('wgUserName');
  return (
    // Extended confirmed users (sysops aren't extendedconfirmed!!!)
    ['sysop', 'extendedconfirmed'].some((i) => groups.includes(i))
    // WMF staffs
    || username.endsWith(' (WMF)')
    || username.endsWith('-WMF')
    // WMDE members
    || username.endsWith(' (WMDE)')
    // Trusted users
    || EXPERIENCED_USERS.includes(username)
  );
}

function isLoggedIn(): boolean {
  return mw.config.exists('wgUserId');
}

function isReferrerBlocked(): boolean {
  const referrerHostname = new URL(document.referrer || DUMMY_REFERRER).hostname;
  return referrerHostname === location.hostname
    || BLOCKED_REFERRER_HOST.test(referrerHostname);
}

function isLangSpecified(): boolean {
  return new URL(location.href).searchParams.has('uselang');
}

export { isExperiencedUser, isLoggedIn, isReferrerBlocked, isLangSpecified };
