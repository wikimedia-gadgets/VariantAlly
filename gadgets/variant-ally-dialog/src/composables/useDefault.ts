import { Ref, computed, shallowRef, watch } from 'vue';

/**
 * Create a ref that, can be independently updated, but when its default
 * value changes, it is restored to its (new) default value.
 *
 * Used for debugging.
 */
function useDefault<T>(defaultRef: Ref<T>): Ref<T> {
  const realRef = shallowRef<T>(defaultRef.value);

  watch(defaultRef, (newValue) => {
    realRef.value = newValue;
  });

  return computed({
    get() {
      return realRef.value;
    },
    set(newValue) {
      realRef.value = newValue;
    },
  });
}

export default useDefault;
