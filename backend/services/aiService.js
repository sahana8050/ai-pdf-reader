import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key Validation Helpers
const isPlaceholder = (key) => {
  if (!key) return true;
  const placeholders = ['your_real_openai_key_here', 'your_real_gemini_key_here', 'your-openai-key-here'];
  return placeholders.includes(key.toLowerCase().trim());
};

const getProvider = () => {
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if (openAiKey && !isPlaceholder(openAiKey)) {
    return { name: 'openai', key: openAiKey };
  }
  if (geminiKey && !isPlaceholder(geminiKey)) {
    return { name: 'gemini', key: geminiKey };
  }
  return null;
};

const provider = getProvider();
let openai = null;
let gemini = null;

if (provider) {
  console.log(`[AI Service] API Key Loaded: ${provider.name.toUpperCase()}`);
  if (provider.name === 'openai') {
    openai = new OpenAI({ apiKey: provider.key });
  } else if (provider.name === 'gemini') {
    gemini = new GoogleGenerativeAI(provider.key);
    console.log('[AI Service] Gemini SDK Initialized');
  }
} else {
  console.warn('[AI Service] No valid AI API key found. System will run in fallback mode.');
}

// Cache for available Gemini models to avoid repeated API calls
let cachedGeminiModels = null;

/**
 * Fetches available models from Gemini API
 */
async function fetchAvailableGeminiModels(apiKey) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const modelNames = data.models.map(m => m.name.replace('models/', ''));
    console.log(`[AI Service] Available Gemini Models: ${modelNames.join(', ')}`);
    return modelNames;
  } catch (error) {
    console.error('[AI Service] Failed to fetch Gemini models:', error.message);
    return [];
  }
}

/**
 * Selects the best supported Gemini model
 */
async function getBestGeminiModel(apiKey) {
  const preferredModels = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  if (!cachedGeminiModels) {
    cachedGeminiModels = await fetchAvailableGeminiModels(apiKey);
  }

  // If we fetched models, find the first preferred one that exists
  if (cachedGeminiModels && cachedGeminiModels.length > 0) {
    for (const pref of preferredModels) {
      if (cachedGeminiModels.includes(pref)) {
        console.log(`[AI Service] Selected Supported Model: ${pref}`);
        return pref;
      }
    }
    // Fallback to the first available model if none of preferred match
    console.log(`[AI Service] No preferred model found, falling back to: ${cachedGeminiModels[0]}`);
    return cachedGeminiModels[0];
  }

  // Final hardcoded fallback if listing failed
  console.log('[AI Service] Listing failed or empty, using hardcoded fallback: gemini-1.5-flash');
  return 'gemini-1.5-flash';
}

/**
 * Generates a chat completion using the configured AI provider.
 * Supports an optional dynamic key passed from the frontend.
 */
export async function getChatCompletion({ systemPrompt, userPrompt, messages = [], temperature = 0.7, maxTokens = 1000, dynamicKey = null }) {
  const activeKey = dynamicKey && !isPlaceholder(dynamicKey) ? dynamicKey : (provider?.key);
  const activeProvider = dynamicKey && !isPlaceholder(dynamicKey) ? (dynamicKey.startsWith('sk-') ? 'openai' : 'gemini') : (provider?.name);

  if (!activeKey) {
    throw new Error('AI Provider not configured. Please add an API key in the Settings sidebar.');
  }

  try {
    if (activeProvider === 'openai') {
      const client = dynamicKey ? new OpenAI({ apiKey: activeKey }) : openai;
      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
        { role: 'user', content: userPrompt }
      ];

      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: chatMessages,
        temperature,
        max_tokens: maxTokens
      });

      console.log(`[AI Service] OpenAI Request Success`);
      return response.choices[0]?.message?.content || '';
    }

    if (activeProvider === 'gemini') {
      const client = dynamicKey ? new GoogleGenerativeAI(activeKey) : gemini;

      // Dynamically select the best model
      const modelName = await getBestGeminiModel(activeKey);

      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt
      });

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessage(userPrompt);
      const response = await result.response;
      console.log(`[AI Service] Gemini Request Success (Model: ${modelName})`);
      return response.text();
    }
  } catch (error) {
    const providerName = activeProvider ? activeProvider.toUpperCase() : 'AI';
    console.error(`[AI Service] ${providerName} Error:`, error.message);

    // Log full error for debugging
    if (activeProvider === 'gemini') {
      console.error(`[Gemini Debug] Full Error:`, error);
    }

    // Better error messages for the user
    if (error.message.includes('401') || error.message.includes('API key')) {
      throw new Error('AI Authentication Failed: The API key provided is invalid or expired.');
    }
    if (error.message.includes('not found') || error.message.includes('model') || error.message.includes('unsupported')) {
      // Clear cache to force a refresh on next attempt
      cachedGeminiModels = null;
      throw new Error(`AI Model Error: The model was not found or is unsupported. We are automatically trying a fallback.`);
    }
    if (error.message.includes('quota') || error.message.includes('limit')) {
      throw new Error('AI Rate Limit: You have exceeded your API quota. Please try again later.');
    }

    throw new Error(`AI generation failed: ${error.message}`);
  }
}

/**
 * Generates embeddings for a piece of text.
 */
export async function getEmbeddings(text, dynamicKey = null) {
  const activeKey = dynamicKey && !isPlaceholder(dynamicKey) ? dynamicKey : (provider?.key);
  const activeProvider = dynamicKey && !isPlaceholder(dynamicKey) ? (dynamicKey.startsWith('sk-') ? 'openai' : 'gemini') : (provider?.name);

  if (!activeKey) return null;

  try {
    if (activeProvider === 'openai') {
      const client = dynamicKey ? new OpenAI({ apiKey: activeKey }) : openai;
      const response = await client.embeddings.create({
        model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large',
        input: text
      });
      return response.data[0].embedding;
    }

    if (activeProvider === 'gemini') {
      const client = dynamicKey ? new GoogleGenerativeAI(activeKey) : gemini;
      const model = client.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    }
  } catch (error) {
    console.error(`[AI Service] Embedding error:`, error.message);
    return null;
  }
}

export const isAIReady = (dynamicKey = null) => !!(dynamicKey && !isPlaceholder(dynamicKey)) || !!provider;
export const getActiveProvider = (dynamicKey = null) => {
  if (dynamicKey && !isPlaceholder(dynamicKey)) {
    return dynamicKey.startsWith('sk-') ? 'openai (Dynamic)' : 'gemini (Dynamic)';
  }
  return provider?.name || 'none';
};
