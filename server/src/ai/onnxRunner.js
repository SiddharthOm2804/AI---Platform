import ort from 'onnxruntime-node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessions = new Map();

async function loadModel(name, filename) {
  if (sessions.has(name)) {
    return sessions.get(name);
  }

  let modelPath = path.resolve(__dirname, '../models/onnx', filename);
  if (!fs.existsSync(modelPath)) {
    modelPath = path.resolve(process.cwd(), 'src/models/onnx', filename);
  }
  if (!fs.existsSync(modelPath)) {
    modelPath = path.resolve(process.cwd(), 'server/src/models/onnx', filename);
  }

  if (!fs.existsSync(modelPath)) {
    console.warn(`ONNX model file not found at ${modelPath}. Model '${name}' will be skipped.`);
    return null;
  }

  try {
    const session = await ort.InferenceSession.create(modelPath);
    sessions.set(name, session);
    console.log(`Loaded ONNX model: ${name}`);
    return session;
  } catch (error) {
    console.error(`Failed to load ONNX model '${name}':`, error.message);
    return null;
  }
}

export const predictATSScore = async (features) => {
  try {
    const session = await loadModel('ats', 'ats_model.onnx');
    if (!session || !features || features.length === 0) return null;

    const tensor = new ort.Tensor('float32', Float32Array.from(features), [1, features.length]);
    const feeds = { input: tensor };
    const out = await session.run(feeds);
    const firstOutput = Object.values(out)[0];
    return Number(firstOutput.data[0]);
  } catch (error) {
    console.warn('predictATSScore failed or model not available:', error.message);
    return null;
  }
};

export const scoreAnswer = async (text) => {
  // Skeleton for Phase 4 answer scoring
  return null;
};

export const getLoadedModels = () => {
  return Array.from(sessions.keys());
};

export default { predictATSScore, scoreAnswer, getLoadedModels };
