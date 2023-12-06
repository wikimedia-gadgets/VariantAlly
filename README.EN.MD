# Variant Ally
[中文](./README.MD)

Variant Ally is a gadget aimed at better handling Chinese variant problems when MediaWiki can't do well itself.

## The problem
Chinese Wikipedia utilized MediaWiki's LanguageConverter widely, to serve content for readers from various cultural backgrounds. Consequently, every page is stored in a mixture of Simplified and Traditional Chinese, and is converted on the fly when read, according to the user's variant preference.

Normally, MediaWiki is able to infer a user's preferred Chinese language variant when they view an article at `https://zh.wikipedia.org/wiki/<article>` (via [`Accept-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) header), but it may not work when:

1. User may open a link with variant specified (e.g. `https://zh.wikipedia.org/zh-tw/<article>`) from external sites or browsers. If the variant is not what user expected, it may worsen user experience.
2. User's browser language may not always be Chinese (for instance, Tor browser recommends to set browser language to English), resulting in seeing a mixture of Simplified and Traditional Chinese content.
3. `zh-hant` and `zh-hans` do not have full conversion rules applied, and should be only used for technical purposes. If a user opens link with this two variants, it will cause problems.
4. Even the user manually specified a language variant, clicks on internal links still navigates user to unconverted pages.

## The solution
Variant Ally fixes this by storing user's variant preference in the local storage of the browser. When the user clicks on a link, the gadget will automatically adjust its variant. It will also redirect user to the correct variant when a link with an incorrect variant is opened from external sites and apps.

A prompt is shown if Variant Ally cannot detect a user's preferred variant. Once the user makes a selection this prompt will not be shown again.

**This gadget is only enabled for anonymous users.**

## FAQ
### Why I keep seeing the prompt?
The gadget stores your language variant preference in the browser. If your browser has a language different from Chinese, and clears browsing data automatically or is in incognito mode, you may keep seeing this prompt.

To fix the problem, try these solutions:
1. Add Chinese Wikipedia to the allow list of preserving site data.
2. The gadget can recognize special "bootstrap links" ([China Mainland (Simplified)](https://zh.wikipedia.org/?va-variant=zh-cn), [Singapore (Simplified)](https://zh.wikipedia.org/?va-variant=zh-sg), [Malaysia (Simplified)](https://zh.wikipedia.org/?va-variant=zh-my), [Taiwan (Traditional)](https://zh.wikipedia.org/?va-variant=zh-tw), [Hong Kong(Traditional)](https://zh.wikipedia.org/?va-variant=zh-hk), [Macau (Traditional)](https://zh.wikipedia.org/?va-variant=zh-mo)). Bookmark one of these. When browsing in incognito, open the bookmark first and your variant preference is saved automatically.
3. Click the "X" button when the prompt pops up. This will close it for the rest of the browsing session.
4. Use an ad-blocker to block the prompt.

### I don't want to use this gadget.
This gadget is now disabled for logged-in users.

### There is a bug in this gadget.
Issue submissions are welcome! Create a new issue [here](https://github.com/wikimedia-gadgets/VariantAlly/issues/new).

## Non-goal
1. This gadget will not try to solve inconsistencies e.g. "Google indexing mobile versions of Wikipedia".
2. This gadget' interface will not support other languages except Chinese, as it's mainly aimed at Chinese readers.

## Development
See [CONTRIBUTING.MD](./CONTRIBUTING.MD).

## License
Variant Ally is licensed under GPLv2, see [LICENSE](./LICENSE) for more info.
