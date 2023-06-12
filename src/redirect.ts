// Handle redirection from incorrect language variants.

import { output } from './debug';
import { getPageVariant, calculatePreferredVariant, isLoggedIn, isExperiencedUser } from './variant';

// Including:
// - w.wiki
// - Google (T305540)
const BLOCKED_REFERRER_HOST = /^w\.wiki$|\bgoogle(?:\.\w{2,3}){1,2}$/i;
const WIKIURL_REGEX = /^\/(?:wiki|zh-\w+)\//i;
const DUMMY_REFERRER = 'a:';

function rewriteLink(link: string, variant: string): string {
  const url = new URL(link);
  const pathname = url.pathname;
  const searchParams = url.searchParams

  // Only handle same origin
  if (url.host === location.host) {
    if (WIKIURL_REGEX.test(pathname)) {
      url.pathname = `/${variant}/${url.pathname.replace(WIKIURL_REGEX, '')}`;
      searchParams.delete('variant'); // For things like /zh-cn/A?variant=zh-hk
    } else if (pathname.startsWith('/w/index.php')) {
      searchParams.set('variant', variant);
    }
  }

  output(`${link} + ${variant} => ${url.toString()}`);
  return url.toString();
}

function redirect(variant: string): void {
  output('Redirecting...');
  location.href = rewriteLink(location.href, variant);
}

async function checkThisPage(variant: string): Promise<void> {
  const referrerHostname = new URL(document.referrer || DUMMY_REFERRER).hostname;
  if (isExperiencedUser()
    || referrerHostname === location.hostname
    || BLOCKED_REFERRER_HOST.test(referrerHostname)
  ) {
    // Assume this is user intention and do nothing
    output(`checkThisPage: Experienced in or referrer in blocklist, do nothing.`);
    return;
  }

  const pageVariant = getPageVariant();
  if (pageVariant === null) {
    return;
  }
  if (pageVariant !== variant) {
    redirect(variant);
  } else {
    output('checkThisPage: Variant is correct :)');
  }
}

function redirectAnchors(variant: string): void {
  ['click', 'auxclick'].forEach((i) => {
    document.addEventListener(i, (e) => {
      const target = e.target;

      if (target instanceof Element) {
        const anchor = target.closest('a');

        if (anchor !== null) {
          output('redirectAnchors: Navigation event');

          const originalHref = anchor.href;
          anchor.href = rewriteLink(anchor.href, variant);

          // HACK: workaround popups not working on modified links
          // Add handler to <a> directly so it was triggered before anything else
          ['mouseover', 'mouseout', 'keyup'].forEach((j) => {
            anchor.addEventListener(j, () => {
              anchor.href = originalHref;
            });
          });
        }
      }
    });
  });
}

export { redirect, checkThisPage, redirectAnchors };
