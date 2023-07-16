// Lib entry point.

import { output, showDebugInformation } from './debug';
import { checkThisPage, redirectAnchors } from './intervention';
import { calculatePreferredVariant, showDialog } from './management';

showDebugInformation();

const preferrerVariant = calculatePreferredVariant();
if (preferrerVariant === null) {
  output(() => ['index', 'Preferred variant is null, show dialog']);
  showDialog();
} else {
  checkThisPage(preferrerVariant);
  redirectAnchors(preferrerVariant);
}
