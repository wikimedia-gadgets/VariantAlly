import { output, showDebugInformation } from './debug';
import { checkThisPage, rewriteAnchors, setVariantFromURL, showDialog } from './controller';
import { calculatePreferredVariant, getPageVariant } from './model';
import { isExperiencedUser, isLangChinese, isReferrerBlocked } from './utils';

showDebugInformation();

setVariantFromURL();

const pageVariant = getPageVariant();
if (pageVariant === null) {
  output('index', 'Non-article page. Stop.');
} else if (!isLangChinese()) {
  output('index', 'Page lang is not Chinese. Stop.');
} else {
  const preferredVariant = calculatePreferredVariant();

  if (preferredVariant === null) {
    output('index', 'Preferred variant is null, show variant dialog');
    showDialog();
  } else if (isExperiencedUser()) {
    output('index', 'User is experienced. Stop.');
  } else if (isReferrerBlocked()) {
    output('index', `Referrer is in blocklist. Stop.`);
  } else {
    checkThisPage(preferredVariant, pageVariant);
  }

  rewriteAnchors(pageVariant);
}

// Expose for VariantAllyDialog's use
export { setLocalVariant } from './model';
export { redirect } from './controller';
