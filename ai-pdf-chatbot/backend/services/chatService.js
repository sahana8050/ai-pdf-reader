import { getChatCompletion, getEmbeddings, isAIReady } from './aiService.js';
import { findRelevantChunks } from './vectorService.js';

function buildSystemPrompt() {
  return [
    'You are a highly intelligent, friendly, and conversational AI assistant, like ChatGPT or Gemini.',
    'Your goal is to help the user understand their uploaded document deeply and naturally.',
    '',
    'GUIDELINES:',
    '1. TONE: Be warm, professional, and helpful. Use emojis occasionally to sound friendly (e.g., 👋, 😊).',
    '2. CONTEXT: Use the provided document excerpts to answer questions. If the answer isn\'t explicitly there, use your general knowledge to provide a helpful, related answer while noting that it\'s based on general knowledge.',
    '3. NO ROBOTIC PHRASES: Never say "I don\'t have access to that" or "The document does not mention". Instead, say something like "From what I can see, the document doesn\'t explicitly state X, but it does discuss Y which is related..."',
    '4. FORMATTING: Use Markdown (headers, bolding, lists) to make your answers beautiful and easy to read.',
    '5. CASUAL CHAT: If the user says "hi", "thanks", or other casual things, respond naturally and warmly.',
    '',
    'Remember: You are an expert analyst who makes complex information easy to understand.'
  ].join('\n');
}

function buildUserPrompt(question, documentName, notes, chunks) {
  const chunkText = chunks.length > 0 
    ? chunks.map((c, i) => `Excerpt ${i+1}: ${c.text}`).join('\n\n')
    : 'No relevant excerpts found.';

  return [
    `Document: ${documentName}`,
    notes ? `User's added notes: ${notes}` : '',
    '',
    'CONTEXT FROM DOCUMENT:',
    chunkText,
    '',
    `USER QUESTION: ${question}`,
    '',
    'Please provide a natural, conversational response based on the above context.'
  ].join('\n');
}

export async function generateChatResponse({ document, question, noteText, history, aiKey = null }) {
  // Handle basic casual requests immediately if AI is not ready
  const casualMap = {
    'hi': 'Hey there! 👋 How can I help you with your document today?',
    'hello': 'Hello! 😊 I\'m ready to help you analyze your PDF. What would you like to know?',
    'thanks': 'You\'re very welcome! Let me know if you have more questions.',
    'thank you': 'Happy to help! Let me know if there\'s anything else in the document you\'d like to explore.'
  };

  const normalized = question.toLowerCase().trim();
  const ready = isAIReady(aiKey);

  if (!ready && casualMap[normalized]) {
    return { text: casualMap[normalized], sources: [] };
  }

  const allChunks = document.chunks || [];
  const relevantChunks = await findRelevantChunks(question, allChunks);

  if (!ready) {
    // Demo Mode Fallback: Synthesize a response from the best relevant chunk
    if (relevantChunks.length > 0) {
      const bestChunk = relevantChunks[0].text;
      return { 
        text: `### 🤖 Demo Mode: Context Preview\n\nI've analyzed the document and found this relevant section:\n\n> "${bestChunk.slice(0, 500)}..."\n\n---\n💡 **Full AI Experience**: To get a natural conversational answer like ChatGPT, please add your **OpenAI** or **Gemini** API key to the Settings sidebar!`, 
        sources: relevantChunks.slice(0, 2).map(c => ({ source: c.source, snippet: c.text.slice(0, 150) }))
      };
    }
    
    // Casual response demo
    if (casualMap[normalized]) {
        return { text: casualMap[normalized] + "\n\n*(Note: I'm running in Demo Mode. Add an API key for full document analysis!)*", sources: [] };
    }

    return { 
      text: "### 🚀 Welcome to AI PDF Chatbot!\n\nI see you've uploaded a document. To start a full conversation about it, you'll need to add an API key in the sidebar settings.\n\n**Current Status:** Running in Demo Mode. I can show you excerpts from the document, but full AI reasoning is disabled.", 
      sources: [] 
    };
  }

  try {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(question, document.name, noteText, relevantChunks);

    const answer = await getChatCompletion({
      systemPrompt,
      userPrompt,
      messages: history.slice(-5), // Send last 5 messages for context
      temperature: 0.7,
      dynamicKey: aiKey
    });

    const sources = relevantChunks.map((chunk) => ({
      source: chunk.source,
      snippet: chunk.text.slice(0, 240),
      score: chunk.score ? Number(chunk.score).toFixed(3) : '0.000'
    }));

    return { text: answer, sources };
  } catch (error) {
    console.error('Chat generation error:', error);
    return { 
      text: `Oops! I ran into a bit of trouble: ${error.message}. Please check your API key and connection.`, 
      sources: [] 
    };
  }
}
