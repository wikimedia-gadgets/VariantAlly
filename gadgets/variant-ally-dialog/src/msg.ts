// Dialog i18n logic.

import { Ref, readonly, ref } from 'vue';
import msgsByLocale from '../assets/msg.json';

const DEFAULT_LANG = 'zh-hans';
const LANG_CYCLE = {
  'zh-hans': 'en',
  en: 'zh-hant',
  'zh-hant': 'zh-hans',
} as const;

const currentLocale: Ref<keyof typeof msgsByLocale> = ref(DEFAULT_LANG);

function switchLang(): void {
  currentLocale.value = LANG_CYCLE[currentLocale.value];
}

function msg(key: string): string {
  const currentMsgsGroup: Record<string, string> = msgsByLocale[currentLocale.value];
  return currentMsgsGroup[key] ?? key;
}

export { currentLocale, msg, switchLang };
