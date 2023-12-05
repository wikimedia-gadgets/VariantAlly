import { Ref, ref } from 'vue';
import { ValidVariant } from 'ext.gadget.VariantAlly';
import { shuffleVariant } from '../utils';

const INTERVAL = 5 * 1000;

/**
 * Return a ref which shuffle between all possible variants.
 */
function useShuffledVariant(): Ref<ValidVariant> {
  // 'zh-cn' is a dummy value that is never used
  const result = ref<ValidVariant>('zh-cn');

  setInterval(() => {
    result.value = shuffleVariant();
  }, INTERVAL);
  result.value = shuffleVariant();

  return result;
}

export { useShuffledVariant as default, shuffleVariant };
