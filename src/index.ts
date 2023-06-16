// Lib entry point.

import { output, showDebugInformation } from './debug';
import { checkThisPage, redirect, redirectAnchors } from './intervention';
import { calculatePreferredVariant, showPrompt } from './management';

showDebugInformation();

const preferrerVariant = calculatePreferredVariant();
if (preferrerVariant === null) {
  output('index', 'Preferred variant is null, show prompt');
  showPrompt().then((variant) => { redirect(variant); });
} else {
  checkThisPage(preferrerVariant);
  redirectAnchors(preferrerVariant);
}
