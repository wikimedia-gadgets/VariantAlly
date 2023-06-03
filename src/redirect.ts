// Handle redirection from incorrect language variants.

import showPrompt from './prompt';
import { getCurrentVariant, getPreferredVariant, isLoggedIn } from './variant';

// Including:
// - zh.wikipedia.org
// - w.wiki
// - Google (T305540)
const BLOCKED_REFERRER_HOST = /^zh\.wikipedia\.org$|^w\.wiki$|\bgoogle(?:\.\w{2,3}){1,2}$/i;
const WIKIURL_REGEX = /^\/(?:wiki|zh-\w+)\//i;

function rewriteLink(link: string, variant: string): string {
  const url = new URL(link);
  const pathname = url.pathname;
  const searchParams = url.searchParams
  if (WIKIURL_REGEX.test(pathname)) {
    url.pathname = `/${variant}/${url.pathname.replace(WIKIURL_REGEX, '')}`;
    searchParams.delete('variant'); // For things like /zh-cn/A?variant=zh-hk
  } else if (pathname.startsWith('/w/index.php')) {
    searchParams.set('variant', variant);
  }
  return url.toString();
}

async function checkCurrentPage(): Promise<void> {
  if (
    isLoggedIn()
    || (document.referrer !== '' && BLOCKED_REFERRER_HOST.test(new URL(document.referrer).hostname))
  ) {
    // Assume this is user intention and do nothing
    return;
  }

  const currentVariant = getCurrentVariant();
  const preferredVariant = getPreferredVariant();
  if (preferredVariant === null) {
    await showPrompt();
    location.href = rewriteLink(location.href, getPreferredVariant()!);
  } else if (currentVariant !== preferredVariant) {
    location.href = rewriteLink(location.href, preferredVariant);
  }
}

function redirectAnchors(): void {
  const preferredVariant = getPreferredVariant();
  if (preferredVariant === null) {
    return;
  }
  ['keydown', 'mousedown', 'touchstart'].forEach((name) => {
    document.addEventListener(name, (e) => {
      if (e.target instanceof HTMLAnchorElement) {
        e.target.href = rewriteLink(e.target.href, preferredVariant);
      }
    });
  });
}

export { checkCurrentPage, redirectAnchors };
