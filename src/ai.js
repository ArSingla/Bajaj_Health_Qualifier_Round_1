const { GoogleGenAI } = require('@google/genai');

const DEFAULT_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

let aiClient;

function getAiClient() {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return null;
  }

  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

async function askSingleWord(question) {
  if (typeof question !== 'string' || question.trim() === '') {
    throw new Error('AI must be a non-empty string question.');
  }

  const client = getAiClient();
  if (!client) {
    throw new Error('AI service is not configured. Set GEMINI_API_KEY.');
  }

  const configured = process.env.GEMINI_MODEL
    ? [process.env.GEMINI_MODEL]
    : (process.env.GEMINI_MODELS || '')
        .split(',')
        .map((model) => model.trim())
        .filter(Boolean);

  const modelsToTry = configured.length > 0 ? configured : DEFAULT_MODELS;
  let lastError;
  let response;

  for (const model of modelsToTry) {
    try {
      response = await client.models.generateContent({
        model,
        contents: `Answer in exactly one word with no punctuation. Question: ${question.trim()}`,
      });
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!response) {
    const detail = lastError?.message ? ` ${lastError.message}` : '';
    throw new Error(`AI request failed for models: ${modelsToTry.join(',')}.${detail}`);
  }

  const raw = (response.text || '').trim();
  const normalized = raw.split(/\s+/)[0]?.replace(/[^\p{L}\p{N}_-]/gu, '') || '';

  if (!normalized) {
    throw new Error('AI service returned an empty answer.');
  }

  return normalized;
}

module.exports = {
  askSingleWord,
};
