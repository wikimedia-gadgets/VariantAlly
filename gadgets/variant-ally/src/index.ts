import { checkDebugURLParam, output, showDebugInfo } from './debug';
import { checkThisPage, rewriteAnchors, applyURLVariant, showVariantPrompt, isEligibleForRewriting } from './controller';
import { calculatePreferredVariant, getPageVariant, isOptOuted, setLocalVariant } from './model';
import { isLoggedIn, isLangChinese, isReferrerBlocked, isWikitextPage, isViewingPage, isReferrerSelf } from './utils';

showDebugInfo();
checkDebugURLParam();
applyURLVariant();

function main() {
  // Manually opt outed users
  if (isOptOuted()) {
    output('main', 'Opt-outed. Stop.');
    return;
  }

  if (isLoggedIn()) {
    output('main', 'Logged in. Stop.');
    return;
  }

  // Non-Chinese pages/users
  if (!isLangChinese()) {
    output('main', 'Current lang is not Chinese. Stop.');
    return;
  }

  const preferredVariant = calculatePreferredVariant();
  if (preferredVariant !== null) {
    // Optimistically set local variant to be equal to browser variant
    // In case the user's browser language becomes invalid in the future,
    // this reduces the possibility to show prompt to disrupt users.
    setLocalVariant(preferredVariant);
  }

  const pageVariant = getPageVariant();

  // Non-article page (JS/CSS pages, Special pages etc.)
  if (pageVariant === null || !isWikitextPage()) {
    output('main', 'Non-article page.');
    // Such page can't have variant, but preferred variant may be available
    // So still rewrite links
    if (preferredVariant !== null) {
      output('main', 'Preferred variant is not null, continue.');
      rewriteAnchors(preferredVariant);
    }
    return;
  }

  // Preferred variant unavailable
  if (preferredVariant === null) {
    if (isViewingPage()) {
      output('main', 'Preferred variant is null, show variant prompt');
      showVariantPrompt();
      return;
    }

    output('main', 'Preferred variant is null, do nothing.');
    return;
  }

  if (isReferrerBlocked()) {
    output('main', 'Referred is in blocklist. No checking redirection.');
    rewriteAnchors(preferredVariant);
    return;
  }

  // On-site navigation to links ineligible for writing
  // The eligibility check is require because user may click on a link with variant intentionally
  // e.g. variant dropdown and {{Variant-cnhktwsg}}
  if (isReferrerSelf() && !isEligibleForRewriting(location.href)) {
    output('main', 'On-site navigation to links ineligible for writing. No checking redirection.');
    rewriteAnchors(preferredVariant);
    return;
  }

  checkThisPage(preferredVariant, pageVariant);
  rewriteAnchors(preferredVariant);
}

main();

// Expose for VariantAllyDialog's use
export { setLocalVariant, setOptOut, type ValidVariant, type Variant } from './model';
export { redirect } from './controller';
export { default as stat } from './stats';
