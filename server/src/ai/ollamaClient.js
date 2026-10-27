const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

export const askLocalLLM = async (prompt, { system, json, temperature = 0.7 } = {}) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt,
        system,
        stream: false,
        format: json ? 'json' : undefined,
        options: { temperature },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}`);
    }

    const data = await response.json();
    return { text: data.response, source: 'ollama' };
  } catch (error) {
    console.warn(`Local Ollama unavailable (${error.message}). Falling back to internal engine.`);
    return { text: null, source: 'fallback' };
  }
};

export const pingOllama = async () => {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
};

export default { askLocalLLM, pingOllama };
