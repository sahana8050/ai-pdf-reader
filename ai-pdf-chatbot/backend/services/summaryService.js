import { getChatCompletion, isAIReady } from './aiService.js';

function buildSummaryPrompt(documentName, text, summaryType) {
  let instruction = '';
  switch (summaryType) {
    case 'detailed':
      instruction = 'Provide a comprehensive and detailed summary of this document. Organize it with clear headings and bullet points. Explain complex concepts in simple terms. Ensure all key sections and findings are covered.';
      break;
    case 'bullet':
      instruction = 'Generate a list of the most important bullet points from this document. Focus on key takeaways, action items, and critical facts. Keep it concise and highly scannable.';
      break;
    case 'interview':
      instruction = 'Based on the document, generate 5-7 thought-provoking interview questions. For each question, provide a brief, insightful "Ideal Answer" based on the document\'s content. This is great for prep or deep comprehension.';
      break;
    case 'quick':
    default:
      instruction = 'Write a concise, high-level summary (4-6 lines) that explains what this document is about and its main purpose.';
      break;
  }

  // Context window management
  const contextLimit = 15000; 
  const safeText = text.length > contextLimit 
    ? `${text.slice(0, contextLimit)}\n\n...(Note: Document truncated for summary context)`
    : text;

  return [
    `DOCUMENT NAME: ${documentName}`,
    `TYPE OF ANALYSIS REQUESTED: ${summaryType.toUpperCase()}`,
    '',
    'DOCUMENT CONTENT:',
    safeText,
    '',
    `FINAL INSTRUCTION: ${instruction}`,
    'Use Markdown for formatting. Be natural, intelligent, and insightful.'
  ].join('\n');
}

export async function generateSummary(document, summaryType = 'quick', aiKey = null) {
  if (!isAIReady(aiKey)) {
    // Demo Mode: Provide a basic preview of the document instead of an error
    const textPreview = (document.text || '').slice(0, 800).trim();
    return `### 📄 Demo Mode: Document Preview (${summaryType})

I've extracted the beginning of the document for you to preview:

> "${textPreview}..."

---
💡 **Full AI Analysis**: To generate a real ${summaryType} summary, please add an **OpenAI** or **Gemini** API key to the Settings sidebar!`;
  }

  console.log(`[Summary Service] Generating '${summaryType}' for: ${document.name}`);

  const systemPrompt = 'You are an elite document analyst. Your goal is to provide intelligent, clear, and highly useful summaries and insights from documents.';
  const userPrompt = buildSummaryPrompt(document.name, document.text || '', summaryType);
  
  try {
    const result = await getChatCompletion({
      systemPrompt,
      userPrompt,
      temperature: 0.5,
      maxTokens: 1000,
      dynamicKey: aiKey
    });

    if (!result) {
      throw new Error('The AI returned an empty response. Please try again.');
    }

    return result;
  } catch (error) {
    console.error(`[Summary Service] Error:`, error.message);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
}
