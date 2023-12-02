import { Ref, ref } from 'vue';
import { ValidVariant } from 'ext.gadget.VariantAlly';
import { VALID_VARIANTS } from '../constants';

const INTERVAL = 5 * 1000;


function updateRef(ref: Ref<ValidVariant>) {
  const randomIndex = Math.floor(Math.random() * VALID_VARIANTS.length);
  ref.value = VALID_VARIANTS[randomIndex];
}

/**
 * Return a ref which shuffle between all possible variants.
 */
function useShuffledVariant(): Ref<ValidVariant> {
  // 'zh-cn' is a dummy value that is never used
  const result = ref<ValidVariant>('zh-cn');

  setInterval(() => {
    updateRef(result);
  }, INTERVAL);
  updateRef(result);

  return result;
}

export default useShuffledVariant;
