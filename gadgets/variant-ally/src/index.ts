import { checkDebugURLParam, output, showDebugInfo } from './debug';
import { checkThisPage, rewriteAnchors, applyURLVariant, showVariantPrompt } from './controller';
import { calculatePreferredVariant, getPageVariant, isOptOuted, isSpecialPage } from './model';
import { isLoggedIn, isLangChinese, isReferrerBlocked } from './utils';

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
    output('main', 'checkThisPage', 'Logged in. Stop.');
    return;
  }

  // Non-Chinese pages/users
  if (!isLangChinese()) {
    output('main', 'Current lang is not Chinese. Stop.');
    return;
  }

  const preferredVariant = calculatePreferredVariant();
  // Preferred variant unavailable
  if (preferredVariant === null) {
    output('main', 'Preferred variant is null, show variant prompt');
    showVariantPrompt();
    return;
  }

  const pageVariant = getPageVariant();
  // Non-article page (JS/CSS pages, Special pages etc.)
  if (pageVariant === null || !isSpecialPage()) {
    output('main', 'Non-article page. Stop.');
    // Such page can't have variant, but if preferred variant can be calculated,
    // then use it to rewrite links
    if (preferredVariant !== null) {
      rewriteAnchors(preferredVariant);
    }
    return;
  }

  // On-site navigation
  if (isReferrerBlocked()) {
    output('main', 'checkThisPage', 'Referrer is in blocklist. Stop.');
    rewriteAnchors(pageVariant);
    return;
  }

  checkThisPage(preferredVariant, pageVariant);
  rewriteAnchors(pageVariant);
}

main();

// Expose for VariantAllyDialog's use
export { setLocalVariant, setOptOut, type ValidVariant, type Variant } from './model';
export { redirect } from './controller';
export { default as stat } from './stats';
