type StatName =
  | 'variant-prompt-show'
  | 'variant-prompt-optout'
  | 'variant-prompt-dismiss'
  | 'variant-prompt-select'
  | 'variant-prompt-mobile-show'
  | 'variant-prompt-mobile-optout'
  | 'variant-prompt-mobile-dismiss'
  | 'variant-prompt-mobile-select';

function stat(name: StatName) {
  if (STAT_ENABLE) {
    mw.track(`counter.gadget_VariantAlly.${name}`);
  }
}

export { stat as default, type StatName };
