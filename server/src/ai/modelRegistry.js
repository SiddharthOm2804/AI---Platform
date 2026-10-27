import { getLoadedModels } from './onnxRunner.js';

export const getRegistry = () => {
  return {
    loaded: getLoadedModels(),
    timestamp: new Date(),
  };
};

export default { getRegistry };
