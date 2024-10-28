// Additional types.

/// <reference types="../../../node_modules/types-mediawiki"/>

/* eslint-disable @typescript-eslint/no-unused-vars */

// Temporary polyfill for types-mediawiki
// FIXME: Remove when present in that package
namespace mw.user {
  function isNamed(): boolean;
}

const DEBUG: boolean;

const BUILD_HASH: string;

module 'ext.gadget.VariantAllyDialog';
