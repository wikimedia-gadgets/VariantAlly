type StatName = 'variant-prompt-show';

function stat(name: StatName) {
  mw.track(`counter.gadget_VariantAlly.${name}`);
}

export { stat as default, type StatName };
