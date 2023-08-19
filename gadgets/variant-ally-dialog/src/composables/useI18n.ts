import { Ref } from 'vue';
import msgsByLang from '../../assets/messages.json';
import useSyncedRef from './useSyncedRef';

const LANG_CYCLE = {
  'zh-hans': 'en',
  en: 'zh-hant',
  'zh-hant': 'zh-hans',
} as const;

type Lang = keyof typeof msgsByLang;

/**
 * Get default language. Has a 50% chance of zh-hans and otherwise zh-hant.
 * @returns default language
 */
function getDefaultLang(): Lang {
  if (Math.random() > 0.5) {
    return 'zh-hans';
  }
  return 'zh-hant';
}

const currentLang: Ref<Lang> = useSyncedRef('lang', getDefaultLang());

function cycleThroughLangs(): void {
  currentLang.value = LANG_CYCLE[currentLang.value];
}

function useI18n(key: string): string {
  const currentMsgsGroup: Record<string, string> = msgsByLang[currentLang.value];
  return currentMsgsGroup[key] ?? key;
}

// Export currentLang for debugging purposes
export { useI18n as default, currentLang, cycleThroughLangs };
