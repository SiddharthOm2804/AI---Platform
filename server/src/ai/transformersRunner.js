import { pipeline, env } from '@xenova/transformers';

env.cacheDir = './.models-cache';

let embedder = null;

export const getEmbedding = async (text) => {
  if (!text || typeof text !== 'string') return null;

  try {
    if (!embedder) {
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    // Truncate to reasonable length to avoid memory spikes
    const truncatedText = text.slice(0, 4000);
    const out = await embedder(truncatedText, { pooling: 'mean', normalize: true });
    return Array.from(out.data);
  } catch (error) {
    console.error('Transformers getEmbedding error:', error.message);
    return null;
  }
};

export const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dotProduct / denom;
};

export default { getEmbedding, cosineSimilarity };
