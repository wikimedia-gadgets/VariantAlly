import { Ref, computed, ref } from 'vue';

const CHANNEL_NAME = 'gadget-va';

/**
 * Return a "synced" ref which automatically synchronize with other tabs
 * when either ref of the same key is changed.
 * @param key key
 * @param defaultValue default value (not synced initially)
 * @returns synced ref
 */
function useSyncedRef<T>(key: string, defaultValue: T): Ref<T> {
  const originalRef = ref<T>(defaultValue) as Ref<T>;

  // Silently fails if browser doesn't support BroadcastChannel
  if (!window.BroadcastChannel) {
    return originalRef;
  }

  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.addEventListener('message', (ev) => {
    const [dataKey, dataValue]: [string, T] = ev.data;
    if (dataKey === key) {
      originalRef.value = dataValue;
    }
  });

  return computed({
    get() {
      return originalRef.value;
    },
    set(newValue) {
      originalRef.value = newValue;
      channel.postMessage([key, newValue]);
    },
  });
}

export default useSyncedRef;
