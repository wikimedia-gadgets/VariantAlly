/// <reference types="vite/client" />

declare module 'ext.gadget.VariantAlly' {
  export function redirect(
    preferredVariant: string,
    normalizationTargetVariant: string | null,
  ): void;
  export function setLocalVariant(variant: string): void;
  export function getMediaWikiVariant(): string | null;
}
