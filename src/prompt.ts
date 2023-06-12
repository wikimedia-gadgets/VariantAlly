// TODO: Replace with a formal dialog

import { setPreferredVariant } from './variant';

async function showPrompt(): Promise<string> {
  const result = await OO.ui.prompt('Enter variant', { textInput: { value: 'zh-cn' } });
  if (result === null) {
    prompt('variant cannot be null!');
    throw new Error();
  } else {
    setPreferredVariant(result);
    return result;
  }
}

export default showPrompt;
