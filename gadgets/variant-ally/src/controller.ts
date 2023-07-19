import { output } from './debug';
import { getPageVariant } from './model';
import { isExperiencedUser } from './utils';

// Including:
// - w.wiki
const BLOCKED_REFERRER_HOST = /^w\.wiki$/i;

const WIKIURL_REGEX = /^\/(?:wiki|zh(?:-\w+)?)\//i;

// Used to suppress exceptions of URL constructor
const DUMMY_REFERRER = 'a:';

const REDIRECTED_FROM_KEY = 'va-rf';

function rewriteLink(
  link: string,
  variant: string,
  normalizationTargetVariant: string | null,
): string {
  const url = new URL(link);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // Only handle same origin urls
  if (url.host === location.host) {
    if (WIKIURL_REGEX.test(pathname)) {
      url.pathname = `/${variant}/${url.pathname.replace(WIKIURL_REGEX, '')}`;
      searchParams.delete('variant'); // For things like /zh-cn/A?variant=zh-hk
    } else if (pathname.startsWith('/w/index.php')) {
      // HACK: workaround search box redirection not respecting `variant` URL param
      // This should be eventually fixed in MediaWiki itself
      //
      // Example url: https://zh.wikipedia.org/w/index.php?title=Special:Search&search=Foo&wprov=acrw1_0
      // It should be replaced by https://zh.wikipedia.org/<variant>/Foo.
      //
      // Note that the "search for pages containing XXX" link is not covered by this hack
      // since the `variant` URL param works there
      const searchQuery = searchParams.get('search');

      if (
        searchQuery !== null
        && searchParams.get('title')?.startsWith('Special:')
        && searchParams.get('fulltext') !== '1'
      ) {
        url.pathname = `/${variant}/${searchQuery}`;
        url.search = '';
      } else {
        searchParams.set('variant', variant);
      }
    }

    if (variant === normalizationTargetVariant) {
      // Normalize the link.
      //
      // For example, for link /zh-tw/Title and normalization variant zh-tw, the result is /wiki/Title,
      // while for the same link and normalization variant zh-cn, the result is /zh-tw/Title (unchanged).
      url.pathname = url.pathname.replace(WIKIURL_REGEX, '/wiki/');
      url.searchParams.delete('variant');
    }
  }

  const result = url.toString();
  output(() => ['rewriteLink', `${link} + ${variant} + mw:${normalizationTargetVariant} => ${result}`]);
  return result;
}

function redirect(
  preferredVariant: string,
  normalizationTargetVariant: string | null,
): void {
  sessionStorage.setItem(REDIRECTED_FROM_KEY, preferredVariant);
  // Use replace() to prevent navigating back
  location.replace(rewriteLink(location.href, preferredVariant, normalizationTargetVariant));
}

function checkThisPage(
  preferredVariant: string,
  normalizationTargetVariant: string | null,
): void {
  const referrerHostname = new URL(document.referrer || DUMMY_REFERRER).hostname;
  if (isExperiencedUser()
    || referrerHostname === location.hostname
    || BLOCKED_REFERRER_HOST.test(referrerHostname)
  ) {
    // Assume this as user intention and do nothing
    output(() => ['checkThisPage', `Experienced or referrer in blocklist, do nothing.`]);
    return;
  }

  const pageVariant = getPageVariant();
  if (pageVariant === null) {
    output(() => ['checkThisPage', 'Non-wikitext page. Do nothing.']);
    return;
  }
  if (pageVariant !== preferredVariant) {
    output(() => ['checkThisPage', `Redirecting to ${preferredVariant}...`]);
    redirect(preferredVariant, normalizationTargetVariant);
  } else {
    output(() => ['checkThisPage', 'Variant is correct :)']);
  }
}

function rewriteAnchors(
  preferredVariant: string,
  normalizationTargetVariant: string | null,
): void {
  ['click', 'auxclick', 'dragstart'].forEach((name) => {
    document.addEventListener(name, (ev) => {
      if (ev.target instanceof Element) {
        const anchor = ev.target.closest('a');
        if (anchor) {
          output(() => ['redirectAnchors', `Event ${ev.type} on ${anchor.href}`]);

          // Prevent variant dropdown/list links being overridden
          // Vector/Vector 2022: in #p-variants
          // Timeless: in #p-variants-desktop
          // Minerva/MobileFrontend: in .suggested-languages
          // Monobook: in .pBody
          if (anchor.closest('#p-variants, #p-variants-desktop, .suggested-languages, .pBody')) {
            output(() => ['redirectAnchors', `Anchor is in variant dropdown list. Do nothing.`]);
            return;
          }

          const newLink = rewriteLink(anchor.href, preferredVariant, normalizationTargetVariant);
          if (ev instanceof DragEvent && ev.dataTransfer) {
            // Modify drag data directly because setting href has no effect in drag event
            for (const type of ev.dataTransfer.types) {
              ev.dataTransfer.setData(type, newLink);
            }
            output(() => ['redirectAnchors', 'drag-handler', `Drop data changed!`]);
          } else {
            // Use a mutex to avoid being overwritten by overlapped handler calls
            if (anchor.dataset.vaMutex === undefined) {
              anchor.dataset.vaMutex = '';
            }
            const origLink = anchor.href;
            anchor.href = newLink;
            output(() => [
              'redirectAnchors',
              'click-handler',
              `href ${anchor.href}, origHref ${anchor.dataset.origHref}`,
            ]);

            // HACK: workaround popups not working on modified links
            // Add handler to <a> directly so it was triggered before anything else
            ['mouseover', 'mouseleave', 'keyup'].forEach((innerName) => {
              anchor.addEventListener(innerName, (innerEv) => {
                output(() => [
                  'redirectAnchors',
                  'click-handler',
                  'restoration-handler',
                  `Event ${innerEv.type} on ${anchor.href}, origHref ${anchor.dataset.origHref}`,
                ]);

                if (anchor.dataset.vaMutex !== undefined) {
                  anchor.href = origLink;
                  delete anchor.dataset.vaMutex;
                }
              }, { once: true });
            });
          }
        }
      }
    });
  });
}

function showDialog(): void {
  import('ext.gadget.VariantAllyDialog');
}

export { redirect, checkThisPage, rewriteAnchors, showDialog };
