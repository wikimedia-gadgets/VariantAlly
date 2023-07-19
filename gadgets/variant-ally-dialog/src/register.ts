import { defineCustomElement } from 'vue';

function getCustomElementName(path: string): string {
  return path
    .split('/')
    .reverse()[0]
    .slice(0, -'.ce.vue'.length)
    .replaceAll(/[A-Z]/g, (value) => `-${value.toLowerCase()}`)
    .slice(1); // Remove first '-'
}

function registerComponents() {
  const components = import.meta.glob('./components/**/*.ce.vue', { eager: true });
  Object.entries(components).forEach(async ([path, importContent]) => {
    customElements.define(
      getCustomElementName(path),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defineCustomElement((importContent as any).default),
    );
  });
}

export default registerComponents;
