import { output, showDebugInformation } from './debug';
import { checkThisPage, rewriteAnchors, showDialog } from './controller';
import { calculatePreferredVariant, getMediaWikiVariant, getPageVariant } from './model';
import { isExperiencedUser, isWikitextPage } from './utils';

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
    // For a wikitext page pageVariant cannot be null
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pageVariant = getPageVariant()!;
    if (!isExperiencedUser()) {
      checkThisPage(preferredVariant, normalizationTargetVariant, pageVariant);
    }
    rewriteAnchors(pageVariant, normalizationTargetVariant);
  }
}

// Expose for VariantAllyDialog's use
export { getMediaWikiVariant, setLocalVariant } from './model';
export { redirect } from './controller';
