# How to contribute
## Prerequisites
1. Node.js >= 18 (you can use nvm and automatically read `.nvmrc` at project root)
2. pnpm as package manager
3. Code editor e.g. Visual Studio Code

## Architecture
This monorepo consists of two packages (gadgets). `variant-ally` contains the main functionality (auto redirection and link correction) while `variant-ally-dialog` contains code of the variant selection prompt and is built using Vue.js.

To talk more about `variant-ally-dialog`, it is built using Vue and Vite, but it does not depend on Codex, due to the fact that Codex was not production ready at the time of writing this gadget. It uses Vue version 3 provided by MediaWiki.

## Setup
To setup, run `pnpm i`.

Run `pnpm build` at project root will build both gadgets. Results can be found at each gadget's `dist` folder. By default it builds the gadget in production mode which is suitable for production wikis, and a special `build:debug` script is provided for `variant-ally` package will builds the gadget in development mode which is suitable for beta/test wikis.

## Deployment
Each gadget's definition is in their respective `.gadgetdefinition` file. Add these definitions and distribution files to the wiki and it should work.
