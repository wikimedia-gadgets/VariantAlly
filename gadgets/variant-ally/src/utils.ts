// Trusted users who have activity in zh.wp but are not yet extendedconfirmed
const EXPERIENCED_USERS = [
  'TheresNoTime',
  'WMFOffice',
];

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
    // WMDE members
    || username.endsWith(' (WMDE)')
    // Trusted users
    || EXPERIENCED_USERS.includes(username)
  );
}

function isLoggedIn(): boolean {
  return mw.config.exists('wgUserId');
}

export { isExperiencedUser, isLoggedIn };
