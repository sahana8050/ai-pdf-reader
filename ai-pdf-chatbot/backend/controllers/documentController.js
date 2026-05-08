import { getAllDocuments, getDocumentById, deleteDocument as deleteDocService } from '../services/documentService.js';

export async function listDocuments(req, res) {
  try {
    const documents = await getAllDocuments();
    const response = documents.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      filename: doc.filename,
      createdAt: doc.createdAt,
      notes: doc.notes || '',
      preview: doc.text ? doc.text.slice(0, 240) : ''
    }));
    return res.status(200).json({ documents: response });
  } catch (error) {
    console.error('List documents error:', error);
    return res.status(500).json({ error: 'Failed to fetch documents.' });
  }
}

export async function deleteDocument(req, res) {
  try {
    const { id } = req.params;
    const success = await deleteDocService(id);
    if (!success) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    return res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({ error: 'Failed to delete document.' });
  }
}
