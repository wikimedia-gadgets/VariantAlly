import { Ref, ref } from 'vue';
import msgsByLocale from '../assets/messages.json';

const LANG_CYCLE = {
  'zh-hans': 'en',
  en: 'zh-hant',
  'zh-hant': 'zh-hans',
} as const;

type Locale = keyof typeof msgsByLocale;

/**
 * Get default locale. Has a 50% chance of zh-hans and otherwise zh-hant.
 * @returns default locale
 */
function getDefaultLocale(): Locale {
  if (Math.random() > 0.5) {
    return 'zh-hans';
  }
  return 'zh-hant';
}

const currentLocale: Ref<Locale> = ref(getDefaultLocale());

function cycleLocale(): void {
  currentLocale.value = LANG_CYCLE[currentLocale.value];
}

function msg(key: string): string {
  const currentMsgsGroup: Record<string, string> = msgsByLocale[currentLocale.value];
  return currentMsgsGroup[key] ?? key;
}

// Export currentLocale for debugging purposes
export { currentLocale, msg, cycleLocale };
