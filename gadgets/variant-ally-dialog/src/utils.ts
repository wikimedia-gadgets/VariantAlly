import { ValidVariant } from 'ext.gadget.VariantAlly';
import { computed, ref } from 'vue';

const VALID_VARIANTS = [
  'zh-cn',
  'zh-sg',
  'zh-my',
  'zh-tw',
  'zh-hk',
  'zh-mo',
] as const;

// Wrap wgUserVariant in a ref for debugging purposes.
// It has no reactivity in production. (changes to wgUserVariant will not be reflected)
// wgUserVariant can be null, so falls back to an empty string.
const wgUserVariant = ref(mw.config.get('wgUserVariant') ?? '');

function isMobileDevice(): boolean {
  // Design decision: never be mobile on desktop sites
  // Browser support:
  // Chromium on some Android device (e.g. Samsung) has "(hover: hover)" set
  // So check pointer together
  return !!(mw.config.get('wgMFMode') as string)
    && matchMedia('(hover: none), (pointer: coarse)').matches;
}

function getMountPoint(): Element {
  switch (mw.config.get('skin')) {
    case 'vector-2022':
      return document.getElementsByClassName('mw-page-container')[0] ?? document.body;
    case 'timeless':
      return document.getElementById('mw-content-block') ?? document.body;
    case 'vector':
    case 'minerva':
    case 'monobook':
    default:
      return document.body;
  }
}

const inferredVariant = computed(() => {
  if ((VALID_VARIANTS as ReadonlyArray<string>).includes(wgUserVariant.value)) {
    return wgUserVariant.value as ValidVariant;
  }
  return null;
});

/**
 * Shuffle between all valid variants.
 * @param last last shuffled variant, used to prevent duplications
 * @returns shuffled variant
 */
function shuffleVariant(last?: ValidVariant): ValidVariant {
  const targetArray = [...VALID_VARIANTS].filter((i) => i !== last);
  const randomIndex = Math.floor(Math.random() * targetArray.length);
  return targetArray[randomIndex];
}

export {
  VALID_VARIANTS,
  wgUserVariant,
  isMobileDevice,
  getMountPoint,
  inferredVariant,
  shuffleVariant,
};
