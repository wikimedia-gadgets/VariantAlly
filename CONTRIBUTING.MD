# How to contribute

## Prerequisites

1. Node.js >= 18 (you can use nvm and automatically read `.nvmrc` at project root)
2. pnpm as package manager
3. Code editor e.g. Visual Studio Code

## Setup

To setup, run `pnpm i`.

This (mono)repo consists of two packages (gadgets). `variant-ally` contains the main functionality (auto redirection and link correction). `variant-ally-dialog` contains code of the variant selection prompt and is built using Vue.

Run `pnpm build ` at project root will build both gadgets. Results can be found at each gadget's `dist` folder.

## Deployment
Each gadget's definition is in their respective `gadget-def.txt` file. Add these definitions and distribution files to the wiki and it should work.
