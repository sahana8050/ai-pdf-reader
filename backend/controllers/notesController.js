import { getDocumentById } from '../services/documentService.js';

// In-memory storage for demo
let notes = [];
let nextNoteId = 1;

export async function handleNoteCreate(req, res) {
  try {
    const { documentId, content } = req.body;
    if (!documentId || !content) {
      return res.status(400).json({ error: 'documentId and content are required.' });
    }

    const document = await getDocumentById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const note = {
      _id: nextNoteId++,
      documentId: parseInt(documentId),
      content,
      createdAt: new Date()
    };

    notes.push(note);
    document.notes = `${document.notes || ''}\n${content}`.trim();

    return res.status(201).json({ note, message: 'Note saved successfully.' });
  } catch (error) {
    console.error('Note controller error:', error);
    return res.status(500).json({ error: 'Failed to save note.' });
  }
}

export async function handleGetNotes(req, res) {
  try {
    const { documentId } = req.params;
    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required.' });
    }

    const documentNotes = notes.filter(note => note.documentId === parseInt(documentId)).sort((a, b) => b.createdAt - a.createdAt);
    return res.status(200).json({ notes: documentNotes });
  } catch (error) {
    console.error('Get notes error:', error);
    return res.status(500).json({ error: 'Failed to load notes.' });
  }
}
