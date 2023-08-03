Object.defineProperties(globalThis, {
  location: {
    value: new URL('https://zh.wikipedia.org/'),
  },
  navigator: {
    value: {
      languages: [],
      language: '',
    },
  },
  DEBUG: {
    value: false,
  },
});
