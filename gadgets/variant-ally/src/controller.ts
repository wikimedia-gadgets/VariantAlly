import { output } from './debug';
import { Variant, getMediaWikiVariant, isValidVariant, setLocalVariant } from './model';

const REGEX_WIKI_URL = /^\/(?:wiki|zh(?:-\w+)?)\//i;
const REGEX_VARIANT_URL = /^\/zh(?:-\w+)?\//i;
const VARIANT_PARAM = 'va-variant';

function isEligibleForRewriting(link: string): boolean {
  try {
    // No rewriting for empty links
    if (link === '') {
      return false;
    }
    const url = new URL(link, location.origin);
    // No rewriting if link itself has variant info
    if (REGEX_VARIANT_URL.test(url.pathname)) {
      return false;
    }
    if (url.searchParams.has('variant')) {
      return false;
    }
    // No rewriting for foreign origin URLs
    // Note that links like javascript:void(0) are blocked by this
    if (url.host !== location.host) {
      return false;
    }

    return true;
  } catch {
    output('isEligibleForRewriting', `Exception occurs when checking ${link}!`);
    return false;
  }
}

function rewriteLink(link: string, variant: Variant): string {
  try {
    const normalizationTargetVariant = getMediaWikiVariant();
    const url = new URL(link, location.origin);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    if (REGEX_WIKI_URL.test(pathname)) {
      url.pathname = `/${variant}/${url.pathname.replace(REGEX_WIKI_URL, '')}`;
      searchParams.delete('variant'); // For things like /zh-cn/A?variant=zh-hk
    } else {
      searchParams.set('variant', variant);
    }

    if (variant === normalizationTargetVariant) {
      // Normalize the link.
      //
      // For example, for link /zh-tw/Title and normalization variant zh-tw, the result is /wiki/Title,
      // while for the same link and normalization variant zh-cn, the result is /zh-tw/Title (unchanged).
      url.pathname = url.pathname.replace(REGEX_WIKI_URL, '/wiki/');
      url.searchParams.delete('variant');
    }

    const result = url.toString();
    output('rewriteLink', `${link} + ${variant} - ${normalizationTargetVariant} => ${result}`);

    return result;
  } catch {
    output('rewriteLink', `Exception occurs when rewriting ${link} + ${variant}!`);
    return link;
  }
}

interface RedirectionOptions {
  link?: string;
  /** Should still redirect even destination link is the same as current page */
  forced?: boolean;
}

function redirect(preferredVariant: Variant, options: RedirectionOptions = {}): void {
  const origLink = options.link ?? location.href;
  const newLink = rewriteLink(origLink, preferredVariant);

  // Prevent infinite redirects
  // This could happen occasionally, see getMediaWikiVariant()'s comments
  if (options.forced || newLink !== location.href) {
    // Use replace() to prevent navigating back
    location.replace(newLink);
  } else {
    output('redirect', 'newLink === location.href. No refreshing page.');
  }
}

function checkThisPage(preferredVariant: Variant, pageVariant?: Variant): void {
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
  redirect(preferredVariant, { link: redirectionURL.toString() });
}

function rewriteNavigation(variant: Variant): void {
  ['click', 'auxclick', 'dragstart'].forEach((name) => {
    document.addEventListener(name, (ev) => {
      const target = ev.target;

      if (target instanceof Element) {
        // Do not write <a> with hash only href or no href
        // which is known to cause breakage in e.g. Visual Editor
        const anchor: HTMLAnchorElement | null = target.closest('a[href]:not([href^="#"])');

        if (anchor !== null) {
          output('rewriteNavigation', `Event ${ev.type} on ${anchor.href}`);

          const origLink = anchor.href;
          if (!isEligibleForRewriting(origLink)) {
            output('rewriteNavigation', 'Anchor does not require rewriting. Stop.');
            return;
          }

          const newLink = rewriteLink(origLink, variant);
          if (newLink === origLink) {
            output('rewriteNavigation', 'Anchor link is unchanged. Stop.');
            return;
          }

          // Browser support: Safari < 14
          // Fail silently when DragEvent is not present
          if (window.DragEvent && ev instanceof DragEvent && ev.dataTransfer) {
            // Modify drag data directly because setting href has no effect in drag event
            ev.dataTransfer.types.forEach((type) => {
              ev.dataTransfer!.setData(type, newLink);
            });

            output('rewriteNavigation', 'dragHandler', `Drop data changed!`);
          } else {
            // Use a mutex to avoid being overwritten by overlapped handler calls
            if (anchor.dataset.vaMutex === undefined) {
              anchor.dataset.vaMutex = '';

              output('rewriteNavigation', 'clickHandler', 'Anchor locked.');
            }

            anchor.href = newLink;
            output('rewriteNavigation', 'clickHandler', `href ${anchor.href}, origLink ${origLink}`);

            // HACK: workaround popups not working on modified links
            // Add handler to <a> directly so it was triggered before anything else
            ['mouseover', 'mouseleave', 'keyup'].forEach((innerName) => {
              anchor.addEventListener(innerName, (innerEv) => {
                output(
                  'rewriteNavigation',
                  'clickHandler',
                  'restorationHandler',
                  `Event ${innerEv.type} on ${anchor.href}, origLink ${origLink}`,
                );

                if (anchor.dataset.vaMutex !== undefined) {
                  anchor.href = origLink;
                  delete anchor.dataset.vaMutex;

                  output('rewriteNavigation', 'clickHandler', 'restorationHandler', 'Anchor unlocked.');
                }
              }, { once: true });
            });
          }
        }
      }
    });
  });

  // Alter <form> submission actions, especially for edit forms
  // to prevent a later refresh causing loss of the edit buffer
  document.addEventListener('submit', (ev) => {
    const target = ev.target;

    if (target instanceof HTMLFormElement) {
      // Use getAttribute & setAttribute to work around https://github.com/wikimedia-gadgets/VariantAlly/issues/14
      const submitUrl = target.getAttribute('action');
      if (submitUrl && isEligibleForRewriting(submitUrl)) {
        const method = target.getAttribute('method') ?? 'get';

        output('rewriteNavigation', `Event ${ev.type} on ${method} <form> of ${submitUrl}`);

        if (method === 'get') {
          // In GET forms, query parameters in action are striped, so add it via a hidden <input>
          // See https://stackoverflow.com/questions/1116019/when-submitting-a-get-form-the-query-string-is-removed-from-the-action-url
          const variantInput = document.createElement('input');
          variantInput.type = 'hidden';
          variantInput.name = 'variant';
          variantInput.value = variant;
          target.append(variantInput);

          output('rewriteNavigation', 'Hidden <input> added.');
        } else {
          target.setAttribute('action', rewriteLink(submitUrl, variant));

          output('rewriteNavigation', 'Submit URL changed.');
        }
      }
    }
  });
}

function showVariantPrompt(): void {
  import('ext.gadget.VariantAllyDialog');
}

/**
 * Set local variant according to URL query parameters.
 *
 * e.g. a URL with ?va-variant=zh-cn will set local variant to zh-cn
 */
function applyURLVariant(): void {
  const variant = new URL(location.href).searchParams.get(VARIANT_PARAM);
  if (variant !== null && isValidVariant(variant)) {
    output('applyURLVariant', `${VARIANT_PARAM}=${variant}, setting local variant...`);
    setLocalVariant(variant);
  }
}

export {
  isEligibleForRewriting,
  rewriteLink,
  redirect,
  checkThisPage,
  rewriteNavigation,
  showVariantPrompt,
  applyURLVariant,
};
