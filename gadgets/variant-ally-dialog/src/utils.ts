const VALID_VARIANTS = [
  'zh-cn',
  'zh-sg',
  'zh-my',
  'zh-tw',
  'zh-hk',
  'zh-mo',
] as const;

function isMobile(): boolean {
  return !!mw.config.get('wgMFMode');
}

export { VALID_VARIANTS, isMobile };
