/// <reference types="vite/client" />

declare module 'ext.gadget.VariantAlly' {
  export function redirect(preferredVariant: string): void;
  export function setLocalVariant(variant: string): void;
}
