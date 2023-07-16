// Show debug information.

import {
  getAccountVariant,
  getLocalVariant,
  getPageVariant,
  calculatePreferredVariant,
  isLoggedIn,
  isExperiencedUser,
  getBrowserVariant,
} from './management';

function showDebugInformation(): void {
  if (!DEBUG) {
    return;
  }
  console.log(`[VariantAlly]
Referrer: ${document.referrer || '(empty)'}
Browser variant: ${getBrowserVariant()}
Local (cached) variant: ${getLocalVariant()}
Account variant: ${getAccountVariant()}
Page variant: ${getPageVariant()}
User logged in: ${isLoggedIn()}
User experienced: ${isExperiencedUser()}
Calculated preferred variant: ${calculatePreferredVariant()}
`);
}

function output(outputFunc: () => string[]): void {
  if (!DEBUG) {
    return;
  }
  const outputs = outputFunc();
  console.log(`[VariantAlly] ${outputs.slice(0, -1).join('/')}: ${outputs.pop()}`);
}

export { showDebugInformation, output };
