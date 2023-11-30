import { Ref, ref } from 'vue';

const VARIANTS = ['cn', 'sg', 'my', 'hk', 'mo', 'tw'] as const;
const INTERVAL = 5 * 1000;

type Variant = typeof VARIANTS[number];

function updateRef(ref: Ref<Variant>) {
  const randomIndex = Math.floor(Math.random() * VARIANTS.length);
  ref.value = VARIANTS[randomIndex];
}

/**
 * Return a ref which shuffle between all possible variants.
 */
function useShuffledVariant(): Ref<Variant> {
  // 'cn' is a dummy value that is never used
  const result = ref<Variant>('cn');

  setInterval(() => {
    updateRef(result);
  }, INTERVAL);
  updateRef(result);

  return result;
}

export default useShuffledVariant;
