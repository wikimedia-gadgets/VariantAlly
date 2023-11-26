import { output } from './debug';
import { getMediaWikiVariant, setLocalVariant } from './model';

const WIKIURL_REGEX = /^\/(?:wiki|zh(?:-\w+)?)\//i;
const REDIRECTED_FROM_KEY = 'va-rf';
const VARIANT_PARAM = 'va-variant';

function rewriteLink(link: string, variant: string): string {
  const normalizationTargetVariant = getMediaWikiVariant();
  const url = new URL(link);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // Only handle same origin urls
  if (url.host === location.host) {
    if (WIKIURL_REGEX.test(pathname)) {
      url.pathname = `/${variant}/${url.pathname.replace(WIKIURL_REGEX, '')}`;
      searchParams.delete('variant'); // For things like /zh-cn/A?variant=zh-hk
    } else {
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
        pathname.startsWith('/w/index.php')
        && searchQuery !== null
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
  output('rewriteLink', `${link} + ${variant} - ${normalizationTargetVariant} => ${result}`);
  return result;
}

function redirect(preferredVariant: string, link?: string): void {
  sessionStorage.setItem(REDIRECTED_FROM_KEY, preferredVariant);

  // Use replace() to prevent navigating back
  location.replace(rewriteLink(link ?? location.href, preferredVariant));
}

function checkThisPage(preferredVariant: string, pageVariant: string): void {
  if (pageVariant === preferredVariant) {
    output('checkThisPage', 'Variant is correct :)');
    return;
  }

  output('checkThisPage', `Redirecting to ${preferredVariant}...`);

  const redirectionOrigin: string | null = mw.config.get('wgRedirectedFrom');
  if (redirectionOrigin === null) {
    redirect(preferredVariant);
    return;
  }

  // If current page is redirected from another page, rewrite link to point to
  // the original redirect so the "redirected from XXX" hint is correctly displayed
  output('checkThisPage', `Detected redirection from ${redirectionOrigin}`);

  // Use URL to reserve other parts of the link
  const redirectionURL = new URL(location.href);
  redirectionURL.pathname = `/wiki/${redirectionOrigin}`;
  redirect(preferredVariant, redirectionURL.toString());
}

function rewriteAnchors(pageVariant: string): void {

  ['click', 'auxclick', 'dragstart'].forEach((name) => {
    document.addEventListener(name, (ev) => {
      const target = ev.target;

      if (target instanceof Element) {
        const anchor = target.closest('a');

        if (anchor) {
          output('rewriteAnchors', `Event ${ev.type} on ${anchor.href}`);

          // Prevent variant dropdown/list links being overridden
          // Vector/Vector 2022: in #p-variants
          // Timeless: in #p-variants-desktop
          // Minerva/MobileFrontend: in .suggested-languages
          // Monobook: in .pBody
          if (anchor.closest('#p-variants, #p-variants-desktop, .suggested-languages, .pBody')) {
            output('rewriteAnchors', `Anchor is in variant dropdown list. Stop.`);
            return;
          }

          const newLink = rewriteLink(anchor.href, pageVariant);

          if (ev instanceof DragEvent && ev.dataTransfer) {
            // Modify drag data directly because setting href has no effect in drag event
            ev.dataTransfer.types.forEach((type) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ev.dataTransfer!.setData(type, newLink);
            });

            output('rewriteAnchors', 'dragHandler', `Drop data changed!`);
          } else {
            // Use a mutex to avoid being overwritten by overlapped handler calls
            if (anchor.dataset.vaMutex === undefined) {
              anchor.dataset.vaMutex = '';

              output('rewriteAnchors', 'clickHandler', 'Anchor locked.');
            }

            const origLink = anchor.href;
            anchor.href = newLink;

            output('rewriteAnchors', 'clickHandler', `href ${anchor.href}, origLink ${origLink}`);

            // HACK: workaround popups not working on modified links
            // Add handler to <a> directly so it was triggered before anything else
            ['mouseover', 'mouseleave', 'keyup'].forEach((innerName) => {
              anchor.addEventListener(innerName, (innerEv) => {
                output(
                  'rewriteAnchors',
                  'clickHandler',
                  'restorationHandler',
                  `Event ${innerEv.type} on ${anchor.href}, origLink ${origLink}`,
                );

                if (anchor.dataset.vaMutex !== undefined) {
                  anchor.href = origLink;
                  delete anchor.dataset.vaMutex;

                  output('rewriteAnchors', 'clickHandler', 'restorationHandler', 'Anchor unlocked.');
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

function setVariantFromURL(): void {
  const variant = new URL(location.href).searchParams.get(VARIANT_PARAM);
  if (variant !== null) {
    output('setVariantFromURL', `${VARIANT_PARAM}=${variant}, setting local variant...`);
    setLocalVariant(variant);
  }
}

export { rewriteLink, redirect, checkThisPage, rewriteAnchors, showDialog, setVariantFromURL };
