// Variant management related code.

const LOCAL_STORAGE_KEY = 'va-var';
const WIKIURL_REGEX = /^\/(?:wiki|zh-\w+)\//i;

function setPreferredVariant(variant: string): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, variant);
}

function rewriteCurrentURL(variant: string): string {
  const url = new URL(location.href);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  if (WIKIURL_REGEX.test(pathname)) {
    url.pathname = `/${variant}/${url.pathname.replace(WIKIURL_REGEX, '')}`;
    searchParams.delete('variant'); // For things like /zh-cn/A?variant=zh-hk
  } else if (pathname.startsWith('/w/index.php')) {
    searchParams.set('variant', variant);
  }

  return url.toString();
}

export { setPreferredVariant, rewriteCurrentURL };
