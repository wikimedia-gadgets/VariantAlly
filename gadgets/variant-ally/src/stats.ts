type StatName = 'variant-prompt-show'
  | 'variant-prompt-optout'
  | 'variant-prompt-dismiss'
  | 'variant-prompt-select';

function stat(name: StatName) {
  mw.track(`counter.gadget_VariantAlly.${name}`);
}

export { stat as default, type StatName };
