import { output, showDebugInformation } from './debug';
import { checkThisPage, rewriteAnchors, showDialog } from './controller';
import { calculatePreferredVariant, getMediaWikiVariant } from './model';
import { isWikitextPage } from './utils';

showDebugInformation();

if (!isWikitextPage()) {
  output(() => ['index', 'Non-wikitext page. Stop.']);
} else {
  const preferredVariant = calculatePreferredVariant();
  if (preferredVariant === null) {
    output(() => ['index', 'Preferred variant is null, show variant dialog']);
    showDialog();
  } else {
    const normalizationTargetVariant = getMediaWikiVariant();
    checkThisPage(preferredVariant, normalizationTargetVariant);
    rewriteAnchors(preferredVariant, normalizationTargetVariant);
  }
}

// Expose for VariantAllyDialog's use
export { setLocalVariant } from './model';
export { redirect } from './controller';
