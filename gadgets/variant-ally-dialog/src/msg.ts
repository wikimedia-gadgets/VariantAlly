// Dialog i18n logic.

import { Ref, ref } from 'vue';
import msgsByLocale from '../assets/msg.json';

const DEFAULT_LANG = 'zh-hans';

const currentLocale: Ref<keyof typeof msgsByLocale> = ref(DEFAULT_LANG);

function msg(key: string): string {
  const currentMsgsGroup: Record<string, string> = msgsByLocale[currentLocale.value];
  return currentMsgsGroup[key] ?? key;
}

export { currentLocale, msg };
