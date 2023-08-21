import { output, showDebugInformation } from './debug';
import { checkThisPage, rewriteAnchors, showDialog } from './controller';
import { calculatePreferredVariant, getPageVariant } from './model';
import { isExperiencedUser, isLangSpecified, isReferrerBlocked } from './utils';

showDebugInformation();

const pageVariant = getPageVariant();

if (pageVariant === null) {
  output('index', 'Non-article page. Stop.');
} else {
  const preferredVariant = calculatePreferredVariant();

  if (preferredVariant === null) {
    output('index', 'Preferred variant is null, show variant dialog');
    showDialog();
  } else if (isExperiencedUser()) {
    output('index', 'User is experienced. Stop.');
  } else if (isReferrerBlocked()) {
    output('index', `Referrer is in blocklist. Stop.`);
  } else if (isLangSpecified()) {
    output('index', `uselang is specified. Stop.`);
  } else {
    checkThisPage(preferredVariant, pageVariant);
  }

  rewriteAnchors(pageVariant);
}

// Expose for VariantAllyDialog's use
export { setLocalVariant } from './model';
export { redirect } from './controller';
