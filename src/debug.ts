// Show debug information.

import { getAccountVariant, getLocalVariant, getPageVariant, calculatePreferredVariant, isLoggedIn, isExperiencedUser } from './variant';

function showDebugInformation(): void {
  if (!DEBUG) {
    return;
  }
  console.log(`[VariantAlly]
Referrer: ${document.referrer || '(empty)'}
Local (cached) variant: ${getLocalVariant()}
Account variant: ${getAccountVariant()}
Page variant: ${getPageVariant()}
Logged in: ${isLoggedIn()}
Experienced: ${isExperiencedUser()}
Calculated preferred variant: ${calculatePreferredVariant()}
`);
}

function output(str: string): void {
  if (!DEBUG) {
    return;
  }
  console.log(`[VariantAlly] ${str}`);
}

export { showDebugInformation, output }
