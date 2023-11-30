import { output, showDebugInfo } from './debug';
import { checkThisPage, rewriteAnchors, applyURLVariant, showVariantPrompt } from './controller';
import { calculatePreferredVariant, getPageVariant, isOptOuted } from './model';
import { isLoggedIn, isLangChinese, isReferrerBlocked } from './utils';

showDebugInfo();
applyURLVariant();

if (isOptOuted()) {
  // Manually opt outed users: disable everything
  output('index', 'Opt-outed. Stop.');
} else {
  const pageVariant = getPageVariant();
  if (pageVariant === null) {
    // Non-article page (JS/CSS pages etc.): disable everything
    output('index', 'Non-article page. Stop.');
  } else {
    const preferredVariant = calculatePreferredVariant();
    if (preferredVariant === null) {
      // Preferred variant unavailable: disable everything and show prompt
      output('index', 'Preferred variant is null, show variant prompt');
      showVariantPrompt();
    } else {
      if (isLoggedIn()) {
        // Logged-in users: disable page redirection
        // Anchor rewriting can be disabled by turning off the gadget itself
        output('index', 'checkThisPage', 'Logged in. Stop.');
      } else if (isReferrerBlocked()) {
        // On-site navigation: disable page redirection
        output('index', 'checkThisPage', `Referrer is in blocklist. Stop.`);
      } else if (!isLangChinese()) {
        // Non-Chinese pages/users: disable page redirection
        output('index', 'Current lang is not Chinese. Stop.');
      } else {
        // The rest: run page redirection
        checkThisPage(preferredVariant, pageVariant);
      }

      rewriteAnchors(pageVariant);
    }
  }
}

// Expose for VariantAllyDialog's use
export { setLocalVariant, setOptOut } from './model';
export { redirect } from './controller';
