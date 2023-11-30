import { computed, ref } from 'vue';
import messages from '../../assets/messages.json';

// Wrap wgUserVariant in a ref for debugging purposes.
// It has no reactivity in production. (changes to wgUserVariant will not be reflected)
// wgUserVariant can be null, so falls back to an empty string.
const wgUserVariant = ref(mw.config.get('wgUserVariant') ?? '');

const currentVariant = computed(() => {
  if (wgUserVariant.value === 'zh') {
    // No conversion: use randomly selected variant
    return Math.random() > 0.5 ? 'hans' : 'hant';
  }
  if (['zh-hant', 'zh-tw', 'zh-hk', 'zh-mo'].includes(wgUserVariant.value)) {
    return 'hant';
  }

  return 'hans';
});

function useI18n(key: string): string {
  const currentMsgsGroup: Record<string, string> = messages[currentVariant.value];
  return currentMsgsGroup[key] ?? key;
}

// Export wgUserVariant for debugging purposes
export { useI18n as default, currentVariant, wgUserVariant };
