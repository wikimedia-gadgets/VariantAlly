# How to contribute
## Prerequisites
1. Node.js >= 18 (you can use nvm and automatically read `.nvmrc` at project root)
2. pnpm as package manager
3. Code editor e.g. Visual Studio Code

## Setup
To setup, run `pnpm i`.

This monorepo consists of two packages (gadgets). `variant-ally` contains the main functionality (auto redirection and link correction) while `variant-ally-dialog` contains code of the variant selection prompt and is built using Vue.js.

Run `pnpm build:xxx` at project root will build both gadgets. Results can be found at each gadget's `dist` folder. `build:debug` builds the gadget in development mode which is suitable for beta/test wikis while `build:prod` builds the gadget in production mode which is suitable for production wikis.

## Deployment
Each gadget's definition is in their respective `.gadgetdefinition` file. Add these definitions and distribution files to the wiki and it should work.
