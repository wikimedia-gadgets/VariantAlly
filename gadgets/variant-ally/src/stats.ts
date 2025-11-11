/**
 * Collect metrics, visible at grafana.wikimedia.org
 *
 * @param name metric name
 * @param action action performed (metric label)
 */
function stat(name: string, action: string) {
  mw.track(
    `stats.mediawiki_gadget_VariantAlly_${name}_total`,
    1,
    { action },
  );
}

export { stat as default };
