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
  return ['sysop', 'extendedconfirmed'].some((i) => groups.includes(i))
    || username.endsWith(' (WMF)')
    || username.endsWith(' (WMDE)')
    || EXPERIENCED_USERS.includes(username);
}

function isLoggedIn(): boolean {
  return mw.config.exists('wgUserId');
}

export { isExperiencedUser, isLoggedIn };
