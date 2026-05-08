import { getDocumentById } from '../services/documentService.js';
import { generateSummary } from '../services/summaryService.js';

async function processSummary(req, res, summaryType) {
  try {
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required.' });
    }

    const document = await getDocumentById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (!document.text || document.text.trim().length === 0) {
      return res.status(400).json({ error: 'The document contains no extracted text to summarize. It might be scanned or protected.' });
    }

    const aiKey = req.headers['x-ai-key'];
    const summaryText = await generateSummary(document, summaryType, aiKey);
    return res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error(`Summary controller error (${summaryType}):`, error);
    return res.status(500).json({ 
      error: 'Failed to generate summary.', 
      details: error.message 
    });
  }
}

export const handleQuickSummary = (req, res) => processSummary(req, res, 'quick');
export const handleDetailedSummary = (req, res) => processSummary(req, res, 'detailed');
export const handleBulletNotes = (req, res) => processSummary(req, res, 'bullet');
export const handleInterviewQuestions = (req, res) => processSummary(req, res, 'interview');
