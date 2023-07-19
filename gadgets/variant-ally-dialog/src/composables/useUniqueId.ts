let counter = 0;

/**
 * Return a unique ID on each call.
 * @returns id
 */
function useUniqueId(): string {
  return `va-${counter++}`;
}

export default useUniqueId;
