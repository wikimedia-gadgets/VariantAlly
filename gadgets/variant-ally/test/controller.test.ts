import { rewriteLink } from '../src/controller';
import { getMediaWikiVariant } from '../src/model';

const VARIANTS = ['zh-cn', 'zh-sg', 'zh-my', 'zh-hk', 'zh-mo', 'zh-tw'];

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
        .toMatch(`https://zh.wikipedia.org/${variant}/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/wiki/Article', variant))
        .toMatch(`https://zh.wikipedia.org/${variant}/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hans/Article', variant))
        .toMatch(`https://zh.wikipedia.org/${variant}/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hant/Article', variant))
        .toMatch(`https://zh.wikipedia.org/${variant}/Article`);
    });
  });

  describe('normalizes article links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(variant);

      expect(rewriteLink('https://zh.wikipedia.org/zh/Article', variant))
        .toMatch(`https://zh.wikipedia.org/wiki/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/wiki/Article', variant))
        .toMatch(`https://zh.wikipedia.org/wiki/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hans/Article', variant))
        .toMatch(`https://zh.wikipedia.org/wiki/Article`);
      expect(rewriteLink('https://zh.wikipedia.org/zh-hant/Article', variant))
        .toMatch(`https://zh.wikipedia.org/wiki/Article`);
    });
  });

  describe('rewrites index.php links correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);
      expect(
        new URL(rewriteLink('https://zh.wikipedia.org/w/index.php?title=Article&action=edit', variant))
          .searchParams.get('variant'),
      ).toMatch(variant);
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
      ).toMatch(variant);
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
        .toMatch(`https://zh.wikipedia.org/${variant}/Article`);
    });
  });

  describe('normalizes links with duplicate variant params correctly', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(variant);
      expect(rewriteLink('https://zh.wikipedia.org/zh-cn/Article?variant=zh-hk', variant))
        .toMatch('https://zh.wikipedia.org/wiki/Article');
    });
  });

  describe("leaves other wiki's links as-is", () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);
      expect(rewriteLink('https://meta.wikimedia.org/wiki/Article', variant))
        .toMatch('https://meta.wikimedia.org/wiki/Article');
    });
  });

  describe('correctly handles search result links', () => {
    test.each(VARIANTS)('in %s', (variant) => {
      mockedGetMediaWikiVariant.mockReturnValue(null);
      expect(rewriteLink(
        'https://zh.wikipedia.org/w/index.php?title=Special:Search&search=Article&wprov=acrw1_0',
        variant,
      )).toMatch(`https://zh.wikipedia.org/${variant}/Article`);
    });
  });
});
