# 中文变体助手（Variant Ally）

本小工具旨在解决中文维基百科中 MediaWiki 无法顾及的变体处理问题。

## 要解决什么问题？
中文维基百科广泛使用了 MediaWiki 的字词转换功能，从而做到向简体和繁体用户分别显示相应版本的条目。作为代价，每个条目的源代码都是简体中文和繁体中文的混合体，只有在显示的时候才会根据用户的语言设置自动转换。

通常情况下，当用户通过 `https://zh.wikipedia.org/wiki/<条目名>` 访问条目时，MediaWiki 能根据用户的浏览器网页语言设置（[`Accept-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) 头部）自动判断用户偏好的语言变体。但仍然存在许多不足：

1. 用户可能从应用中或其他地方打开了一个指定变体的外部链接（如 `https://zh.wikipedia.org/zh-tw/<条目名>`），而此变体恰巧不是用户偏好的变体，从而导致糟糕的阅读体验。
2. 用户的浏览器可能没有正确配置语言设置（比如 Tor 浏览器推荐将网页语言设置为英文），从而导致用户看到简繁混杂的原始内容。
3. `zh-hant` 和 `zh-hans` 这两个变体只为技术目的保留，且这两个变体下的简繁转换不完全，总之永远不应该呈现给用户。但如果出现上述 1、2 中的情况，则会影响阅读体验。
4. 即使用户手动选择偏好的变体，但导航时仍会回退至无转换版本。

站内现有 [NotifyConversion](https://zh.wikipedia.org/wiki/MediaWiki:Gadget-notifyConversion.js)、[variant-link-fix](https://zh.wikipedia.org/wiki/MediaWiki:Gadget-variant-link-fix.js)、[preserve-variant](https://zh.wikipedia.org/wiki/MediaWiki:Gadget-preserve-variant.js) 小工具可以解决部分问题，但又引入了若干新问题：
1. 无法解决上述第一条列出的问题。
2. 由于小工具在页面底部呈现，呈现次数多了之后容易被用户主动忽略，从而起不到效果。
3. 对于站内用户而言，编辑时可能有切换到不转换等变体的需求，此时弹出提示框反而适得其反。
4. 仅仅解决了 Google 跳转的问题，而未解决其他相似情况。
5. 相关的功能用多个小工具实现，显得碎片化且难以维护。

## 是如何解决的？

## 协议
本项目以 3 Clause BSD 协议授权。
