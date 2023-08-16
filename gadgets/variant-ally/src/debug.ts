import {
  getAccountVariant,
  getLocalVariant,
  getPageVariant,
  calculatePreferredVariant,
  getBrowserVariant,
  getMediaWikiVariant,
} from './model';
import { isLoggedIn, isExperiencedUser } from './utils';

function showDebugInformation(): void {
  console.log(`[VariantAlly]
Build: ${BUILD_HASH}
Referrer: ${document.referrer || '(empty)'}
Browser variant: ${getBrowserVariant()}
Local (cached) variant: ${getLocalVariant()}
Account variant: ${getAccountVariant()}
Page variant: ${getPageVariant()}
MediaWiki variant: ${getMediaWikiVariant()}
User logged in: ${isLoggedIn()}
User experienced: ${isExperiencedUser()}
Calculated preferred variant: ${calculatePreferredVariant()}
`);
}

function output(...outputs: string[]): void {
  console.log(`[VariantAlly] ${outputs.slice(0, -1).join('/')}: ${outputs.pop()}`);
}

export { showDebugInformation, output };
