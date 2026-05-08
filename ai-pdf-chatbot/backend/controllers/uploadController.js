import Document from '../models/Document.js';
import { createDocumentFromUpload } from '../services/documentService.js';

export async function handleUpload(req, res) {
  try {
    console.log('Upload request received');
    console.log('Files:', req.files ? req.files.length : 'none');
    console.log('Body:', req.body);

    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ error: 'No PDF files uploaded.' });
    }

    const extraText = req.body.extraText || '';
    const createdDocuments = [];

    for (const file of req.files) {
      console.log('Processing file:', file.originalname, file.filename);
      const document = await createDocumentFromUpload(file, extraText);
      createdDocuments.push({
        _id: document._id,
        name: document.name,
        filename: document.filename,
        createdAt: document.createdAt,
        notes: document.notes || '',
        preview: document.text.slice(0, 300),
        text: document.text
      });
    }

    console.log('Upload successful, created', createdDocuments.length, 'documents');
    return res.status(201).json({
      message: 'PDFs uploaded and indexed successfully.',
      documents: createdDocuments
    });
  } catch (error) {
    console.error('Upload controller error:', error);
    return res.status(500).json({
      error: 'Failed to upload PDFs.',
      details: error.message
    });
  }
}
