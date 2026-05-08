import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { splitTextToChunks } from '../utils/textSplitter.js';
import { addEmbeddingsToChunks } from './vectorService.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for demo
let documents = [];
let nextId = 1;

function cleanText(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n?/g, '\n') // Normalize line endings
    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
    .replace(/[ \t]+/g, ' ') // Collapse multiple spaces
    .replace(/([a-z])-\n([a-z])/ig, '$1$2') // Fix hyphenated words broken across lines
    .replace(/(?<!\n)\n(?!\n)/g, ' ') // Merge single line breaks (fragmented sentences)
    .replace(/\n{3,}/g, '\n\n') // Collapse multiple line breaks into double
    .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
    .trim();
}

export async function createDocumentFromUpload(file, extraText) {
  console.log('Creating document from upload:', file.originalname);
  const filePath = path.join(__dirname, '..', 'uploads', file.filename);
  console.log('File path:', filePath);

  const fileBuffer = fs.readFileSync(filePath);
  console.log('File buffer size:', fileBuffer.length);

  const parsed = await pdfParse(fileBuffer);
  console.log('PDF parsed, pages:', parsed.numpages, 'text length:', parsed.text.length);

  let rawText = parsed.text || '';
  let completeText = `${cleanText(rawText)}\n\n${cleanText(extraText || '')}`.trim();
  
  if (!completeText || completeText.length < 10) {
    throw new Error('Could not extract meaningful text from the PDF. It might be empty, scanned, or protected.');
  }
  console.log('Complete text length:', completeText.length);

  const chunks = await splitTextToChunks(completeText, parsed.numpages || null);
  console.log('Text split into', chunks.length, 'chunks');

  const chunksWithEmbeddings = await addEmbeddingsToChunks(chunks, file.originalname);
  console.log('Embeddings added to chunks');

  const document = {
    _id: nextId++,
    name: file.originalname,
    filename: file.filename,
    storagePath: filePath,
    text: completeText,
    chunks: chunksWithEmbeddings,
    notes: extraText || '',
    createdAt: new Date()
  };

  documents.push(document);
  console.log('Document created with ID:', document._id);
  return document;
}

export async function getAllDocuments() {
  return documents;
}

export async function getDocumentById(id) {
  return documents.find(doc => doc._id === parseInt(id));
}

export async function deleteDocument(id) {
  const index = documents.findIndex(doc => doc._id === parseInt(id));
  if (index !== -1) {
    const doc = documents[index];
    documents.splice(index, 1);
    try {
      fs.unlinkSync(doc.storagePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    return true;
  }
  return false;
}
