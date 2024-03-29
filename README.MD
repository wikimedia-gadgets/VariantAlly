# 变体小助手（Variant Ally）
[English](./README.EN.MD)

变体小助手工具旨在解决中文维基百科中 MediaWiki 无法顾及的变体处理问题。

## 要解决什么问题？
中文维基百科广泛使用了 MediaWiki 的字词转换功能，从而做到向简体和繁体用户分别显示相应版本的条目。作为代价，每个条目的源代码都是简体中文和繁体中文的混合体，只有在显示的时候才会根据用户的语言设置自动转换。

通常情况下，当用户通过 `https://zh.wikipedia.org/wiki/<条目名>` 访问条目时，MediaWiki 能根据用户的浏览器网页语言设置（[`Accept-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) 头部）自动判断用户偏好的语言变体。但仍然存在许多不足：

1. 用户可能从应用中或其他地方打开了一个指定变体的外部链接（如 `https://zh.wikipedia.org/zh-tw/<条目名>`），而此变体恰巧不是用户偏好的变体，从而导致糟糕的阅读体验。
2. 用户的浏览器语言可能不是中文（比如 Tor 浏览器推荐将网页语言设置为英文），从而导致用户看到简繁混杂的原始内容。
3. `zh-hant` 和 `zh-hans` 这两个变体只为技术目的保留，且这两个变体下的简繁转换不完全，总之永远不应该呈现给用户。但如果出现上述 1、2 中的情况，则会影响阅读体验。
4. 即使用户手动选择偏好的变体，但点击链接跳转时仍会回退至无转换版本。

## 是如何解决的？
变体小助手将用户的变体偏好设置存储于浏览器本地存储中来解决这一问题。用户在站内跳转时，小工具会自动将内链修正为正确变体的版本。如果用户从外部点开了一个不正确变体的链接，本小工具也会自动修正。

如果变体小助手无法确定用户的偏好变体，则会显示弹框以便用户选择。一旦用户作出选择，此弹框则不会再次显示。

**本小工具只对匿名用户启用。**

## 常见问题（FAQ）
### 为什么我总是看到弹窗？
小工具会将您的变体设置存储于浏览器中，如果您的浏览器语言不是中文，并且会自动清除网站数据或者使用了无痕模式，您可能会多次看到此弹窗。

要解决此问题，请尝试以下方案：
1. 将中文维基百科加入浏览器清除网站数据的白名单中。
2. 小工具可以识别特殊的“设置链接”（[大陆简体](https://zh.wikipedia.org/?va-variant=zh-cn)、[新加坡简体](https://zh.wikipedia.org/?va-variant=zh-sg)、[马来西亚简体](https://zh.wikipedia.org/?va-variant=zh-my)、[臺灣正體](https://zh.wikipedia.org/?va-variant=zh-tw)、[香港繁體](https://zh.wikipedia.org/?va-variant=zh-hk)、[澳門繁體](https://zh.wikipedia.org/?va-variant=zh-mo)）。将这些链接添加至书签，在使用无痕浏览模式前先打开这些链接，便会自动保存相应的变体设置。
3. 出现弹窗时点击右上角关闭按钮，即可在当前会话中不再显示弹窗。
4. 使用广告拦截插件屏蔽弹窗。

### 我不希望使用这个小工具。
变体小助手现在会对所有已登录用户禁用。

### 我发现这个小工具存在 bug。
欢迎提交问题反馈！[在此处](https://github.com/wikimedia-gadgets/VariantAlly/issues/new)新建 issue。

## 不会解决的问题
1. 本小工具不涉及桌面移动端跳转相关逻辑。
2. 不会支持除简体中文、繁体中文之外的其他语言。

## 开发和构建
参见 [CONTRIBUTING.MD](./CONTRIBUTING.MD)。

## 协议
变体小助手以 GPLv2 协议授权，详见 [LICENSE](./LICENSE)。
