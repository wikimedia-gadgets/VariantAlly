// TODO: Replace with a formal dialog

import { setPreferredVariant } from './variant';

async function showPrompt(): Promise<void> {
  const result = await OO.ui.prompt('Enter variant', { textInput: { value: 'zh-cn' } });
  if (result === null) {
    prompt('variant cannot be null!');
  } else {
    setPreferredVariant(result);
  }
}

export default showPrompt;
