// Show debug information.

import { getAccountVariant, getLocalVariant, getPageVariant, calculatePreferredVariant, isLoggedIn, isExperiencedUser } from './management';

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

function output(...outputs: string[]): void {
  console.log(`[VariantAlly] ${outputs.slice(0, -1).join('/')}: ${outputs.pop()}`);
}


export { showDebugInformation, output }
