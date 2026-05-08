import { getChatMessages } from './chatController.js';

export async function handleHistory(req, res) {
  try {
    const { documentId } = req.query;
    if (!documentId) {
      return res.status(400).json({ error: 'documentId query parameter is required.' });
    }

    const chatMessages = getChatMessages();
    const history = chatMessages.filter(msg => msg.documentId === parseInt(documentId)).sort((a, b) => a.createdAt - b.createdAt);
    return res.status(200).json({ history });
  } catch (error) {
    console.error('History controller error:', error);
    return res.status(500).json({ error: 'Failed to fetch history.' });
  }
}
