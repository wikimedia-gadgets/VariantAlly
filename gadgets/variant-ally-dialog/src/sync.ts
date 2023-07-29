import { Ref, WritableComputedRef, computed } from 'vue';

const CHANNEL_NAME = 'gadget-va-sync';

function syncRef(openRef: Ref<boolean>): Ref<boolean> | WritableComputedRef<boolean> {
  if (!window.BroadcastChannel) {
    // Silently fails if browser doesn't support BroadcastChannel
    return openRef;
  }

  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.addEventListener('message', (ev) => {
    openRef.value = ev.data as boolean;
  });

  return computed({
    get() {
      return openRef.value;
    },
    set(newValue) {
      openRef.value = newValue;
      channel.postMessage(newValue);
    },
  });
}

export default syncRef;
