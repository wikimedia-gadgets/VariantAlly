import { output, showDebugInformation } from './debug';
import showPrompt from './prompt';
import { checkThisPage, redirect, redirectAnchors } from './redirect';
import { calculatePreferredVariant } from './variant';

showDebugInformation();

const preferrerVariant = calculatePreferredVariant();
if (preferrerVariant === null) {
  output('index', 'Preferred variant is null, show prompt');
  showPrompt().then((variant) => { redirect(variant); });
} else {
  checkThisPage(preferrerVariant);
  redirectAnchors(preferrerVariant);
}
