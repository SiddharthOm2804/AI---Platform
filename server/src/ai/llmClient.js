import { askLocalLLM } from './ollamaClient.js';
import { templateEngine } from './templateEngine.js';

export const askLLM = async (prompt, opts = {}) => {
  const result = await askLocalLLM(prompt, opts);
  if (result.text) {
    return result;
  }
  return {
    text: templateEngine(prompt, opts),
    source: 'template',
  };
};

export default { askLLM };
