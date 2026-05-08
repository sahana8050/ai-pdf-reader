import { getDocumentById } from '../services/documentService.js';
import { generateChatResponse } from '../services/chatService.js';

// In-memory storage for demo
export let chatMessages = [];
let nextChatId = 1;

export function getChatMessages() {
  return chatMessages;
}

export async function handleChat(req, res) {
  try {
    const { documentId, question, noteText = '' } = req.body;
    const parsedDocumentId = parseInt(documentId, 10);

    if (!parsedDocumentId || !question) {
      return res.status(400).json({ error: 'documentId and question are required.' });
    }

    const document = await getDocumentById(parsedDocumentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const history = chatMessages.filter(msg => msg.documentId === parsedDocumentId).sort((a, b) => a.createdAt - b.createdAt);

    const aiKey = req.headers['x-ai-key'];
    const assistantAnswer = await generateChatResponse({
      document,
      question,
      noteText,
      history,
      aiKey
    });

    chatMessages.push({
      _id: nextChatId++,
      documentId: parsedDocumentId,
      role: 'user',
      content: question,
      createdAt: new Date()
    });

    chatMessages.push({
      _id: nextChatId++,
      documentId: parsedDocumentId,
      role: 'assistant',
      content: assistantAnswer.text,
      createdAt: new Date()
    });

    return res.status(200).json({
      answer: assistantAnswer.text,
      sources: assistantAnswer.sources,
      summary: assistantAnswer.summary || null
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({ error: 'Failed to generate chat response.', details: error.message });
  }
}
