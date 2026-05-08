import 'dotenv/config';
import { getChatCompletion, getEmbeddings, isAIReady, getActiveProvider } from './services/aiService.js';

async function runTests() {
  console.log('--- AI PDF Chatbot: AI Connectivity Test ---');
  console.log('Provider configured:', getActiveProvider().toUpperCase());
  console.log('Is AI Ready:', isAIReady());

  if (!isAIReady()) {
    console.error('❌ AI is NOT ready. Please check your .env file and ensure you have provided a valid API key.');
    console.log('Current keys (sanitized):');
    console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? (process.env.OPENAI_API_KEY.startsWith('sk-') ? 'Starts with sk- (Good)' : 'Invalid format') : 'Missing');
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    return;
  }

  console.log('\n1. Testing Chat Completion...');
  try {
    const response = await getChatCompletion({
      systemPrompt: 'You are a helpful assistant.',
      userPrompt: 'Say "AI is working!" followed by a friendly greeting.',
      temperature: 0.7
    });
    console.log('✅ Chat Response:', response);
  } catch (error) {
    console.error('❌ Chat Failed:', error.message);
  }

  console.log('\n2. Testing Embeddings...');
  try {
    const embedding = await getEmbeddings('This is a test sentence for embeddings.');
    if (embedding && Array.isArray(embedding) && embedding.length > 0) {
      console.log(`✅ Embedding successful! Dimension: ${embedding.length}`);
    } else {
      console.error('❌ Embedding failed: Returned empty or invalid result.');
    }
  } catch (error) {
    console.error('❌ Embedding Failed:', error.message);
  }

  console.log('\n--- Test Complete ---');
}

runTests();
