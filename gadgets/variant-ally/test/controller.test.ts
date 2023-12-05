import { isRewritingRequired, rewriteLink } from '../src/controller';
import { getMediaWikiVariant } from '../src/model';

const VARIANTS = [
  'zh',
  'zh-hans',
  'zh-hant',
  'zh-cn',
  'zh-sg',
  'zh-my',
  'zh-hk',
  'zh-mo',
  'zh-tw',
] as const;

jest.mock('../src/model');

// For type inference
const mockedGetMediaWikiVariant = jest.mocked(getMediaWikiVariant);

describe('rewriteLink', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rewrites article links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);

      expect(rewriteLink('https://zh.wikipedia.org/zh/Article', variant))
        .toEqual(`https://zh.wikipedia.org/${variant}/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/wiki/Article', variant))
        .toEqual(`https://zh.wikipedia.org/${variant}/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hans/Article', variant))
        .toEqual(`https://zh.wikipedia.org/${variant}/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hant/Article', variant))
        .toEqual(`https://zh.wikipedia.org/${variant}/Article`);
    });
  });

  describe('normalizes article links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(variant);

      expect(rewriteLink('https://zh.wikipedia.org/zh/Article', variant))
        .toEqual(`https://zh.wikipedia.org/wiki/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/wiki/Article', variant))
        .toEqual(`https://zh.wikipedia.org/wiki/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hans/Article', variant))
        .toEqual(`https://zh.wikipedia.org/wiki/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hant/Article', variant))
        .toEqual(`https://zh.wikipedia.org/wiki/Article`);
    });
  });

  describe('rewrites index.php links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);
      expect(
        new URL(rewriteLink('https://zh.wikipedia.org/w/index.php?title=Article&action=edit', variant))
          .searchParams.get('variant'),
      ).toEqual(variant);
    });
  });

  describe('normalizes index.php links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(variant);
      expect(
        new URL(rewriteLink('https://zh.wikipedia.org/w/index.php?title=Article&action=edit', variant))
          .searchParams.get('variant'),
      ).toBeNull();
    });
  });

  describe('rewrites weird links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);
      expect(
        new URL(rewriteLink('https://zh.wikipedia.org/?debug=1', variant))
          .searchParams.get('variant'),
      ).toEqual(variant);
    });
  });

  describe('normalizes weird links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(variant);
      expect(
        new URL(rewriteLink('https://zh.wikipedia.org/?debug=1', variant))
          .searchParams.get('variant'),
      ).toBeNull();
    });
  });

  describe('rewrites links with duplicate variant params correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);
      expect(rewriteLink('https://zh.wikipedia.org/zh-cn/Article?variant=zh-hk', variant))
        .toEqual(`https://zh.wikipedia.org/${variant}/Article`);
    });
  });

  describe('normalizes links with duplicate variant params correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(variant);
      expect(rewriteLink('https://zh.wikipedia.org/zh-cn/Article?variant=zh-hk', variant))
        .toEqual('https://zh.wikipedia.org/wiki/Article');
    });
  });

  describe('correctly handles search result links', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);
      expect(rewriteLink(
        'https://zh.wikipedia.org/w/index.php?title=Special:Search&search=Article&wprov=acrw1_0',
        variant,
      )).toEqual(`https://zh.wikipedia.org/${variant}/Article?wprov=acrw1_0`);
    });
  });
});

describe('isRewritingRequired', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('return true for normal links', () => {
    expect(isRewritingRequired('https://zh.wikipedia.org/wiki/Article')).toBe(true);
  });

  describe('return false for links with /variant/', () => {
    test.each(VARIANTS)('for %s link', (variant) => {
      expect(isRewritingRequired(`https://zh.wikipedia.org/${variant}/Article`))
        .toBe(false);
    });
  });

  describe('return false for links with ?variant', () => {
    test.each(VARIANTS)('for %s link', (variant) => {
      expect(isRewritingRequired(`https://zh.wikipedia.org/wiki/Article?variant=${variant}`))
        .toBe(false);
    });
  });

  test('return false for foreign links', () => {
    expect(isRewritingRequired('https://meta.wikimedia.org/wiki/Article')).toBe(false);
  });

  test('return false for empty links', () => {
    expect(isRewritingRequired('')).toBe(false);
  });

  test('return false for javascript links', () => {
    expect(isRewritingRequired('javascript:void(0)')).toBe(false);
  });
});
