const VALID_VARIANTS = [
  'zh-cn',
  'zh-sg',
  'zh-my',
  'zh-tw',
  'zh-hk',
  'zh-mo',
] as const;

function isMobileSite(): boolean {
  return !!mw.config.get('wgMFMode');
}

function getMountPoint(): Element {
  switch (mw.config.get('skin')) {
    case 'vector-2022':
      return document.getElementsByClassName('mw-page-container')[0] ?? document.body;
    case 'timeless':
      return document.getElementById('mw-content-block') ?? document.body;
    case 'vector':
    case 'minerva':
    case 'monobook':
    default:
      return document.body;
  }
}


export { VALID_VARIANTS, isMobileSite, getMountPoint };
