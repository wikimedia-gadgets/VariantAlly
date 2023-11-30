// Shim mw object for dev server. This script is never run in production!

let wgUserVariant = 'zh';

window.mw = {
  config: {
    get(key) {
      if (key === 'wgUserVariant') {
        return wgUserVariant;
      }
    },
    set(key, value) {
      if (key === 'wgUserVariant') {
        wgUserVariant = value;
      }
    },
  },
};

export default {};
