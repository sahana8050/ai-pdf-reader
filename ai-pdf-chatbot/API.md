# API Reference - AI PDF Document Assistant

## Base URL
```
http://localhost:5000/api
```

## Authentication
No authentication required for MVP (add JWT later if needed)

---

## 📤 Upload API

### POST /upload
Upload one or more PDF files with optional context

**Request:**
```javascript
const formData = new FormData();
formData.append('pdfs', pdfFile1);
formData.append('pdfs', pdfFile2);
formData.append('extraText', 'Optional context for the AI...');

const response = await axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

**Response (201 Created):**
```json
{
  "message": "PDFs uploaded and indexed successfully.",
  "documents": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "research-paper.pdf",
      "filename": "1699564800000-research-paper.pdf",
      "createdAt": "2023-11-09T10:00:00Z",
      "preview": "Abstract: This paper explores..."
    }
  ]
}
```

**Error (400/500):**
```json
{
  "error": "Failed to upload PDFs.",
  "details": "Only PDF files allowed or max 10MB per file"
}
```

---

## 💬 Chat API

### POST /chat
Send a question about a document and receive an AI-powered answer

**Request:**
```javascript
const response = await axios.post('/api/chat', {
  documentId: "507f1f77bcf86cd799439011",
  question: "What are the main findings?",
  noteText: "Focus on methodology section"  // optional
});
```

**Response (200 OK):**
```json
{
  "answer": "The study found that... [answer grounded in document content]",
  "sources": [
    {
      "source": "research-paper.pdf",
      "snippet": "We conducted interviews with 50 participants...",
      "score": "0.912"
    },
    {
      "source": "research-paper.pdf",
      "snippet": "Results showed significant correlation...",
      "score": "0.845"
    }
  ],
  "summary": null
}
```

**Error (400/500):**
```json
{
  "error": "Failed to generate chat response.",
  "details": "Document not found or AI service unavailable"
}
```

---

## 📋 Summary API

### POST /summary
Generate different types of summaries for a document

**Request:**
```javascript
const response = await axios.post('/api/summary', {
  documentId: "507f1f77bcf86cd799439011",
  summaryType: "quick"  // or "detailed", "bullet", "questions"
});
```

**Response (200 OK):**
```json
{
  "summary": "This research paper investigates the impact of remote work on productivity. Key findings include: 1) 23% increase in output... 2) Improved work-life balance... 3) Challenges with team collaboration..."
}
```

**Summary Types:**
- `quick` - 2-3 sentence overview
- `detailed` - Full comprehensive summary
- `bullet` - Key bullet points
- `questions` - Interview-style questions

---

## 📁 Documents API

### GET /documents
List all uploaded documents

**Response (200 OK):**
```json
{
  "documents": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "research-paper.pdf",
      "filename": "1699564800000-research-paper.pdf",
      "createdAt": "2023-11-09T10:00:00Z",
      "notes": "Important for section 3 analysis",
      "preview": "Abstract: This paper explores..."
    }
  ]
}
```

### DELETE /documents/:id
Delete a document (file + DB record)

**Request:**
```javascript
await axios.delete(`/api/documents/507f1f77bcf86cd799439011`);
```

**Response (200 OK):**
```json
{
  "message": "Document deleted successfully."
}
```

---

## 📝 Notes API

### POST /notes
Save custom notes/instructions for a document

**Request:**
```javascript
await axios.post('/api/notes', {
  documentId: "507f1f77bcf86cd799439011",
  content: "Focus on Chapter 2. This is a product roadmap for Q1 2024."
});
```

**Response (201 Created):**
```json
{
  "note": {
    "_id": "507f1f77bcf86cd799439012",
    "documentId": "507f1f77bcf86cd799439011",
    "content": "Focus on Chapter 2...",
    "createdAt": "2023-11-09T10:05:00Z"
  },
  "message": "Note saved successfully."
}
```

### GET /notes/:documentId
Retrieve all notes for a document

**Response (200 OK):**
```json
{
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "documentId": "507f1f77bcf86cd799439011",
      "content": "Focus on Chapter 2",
      "createdAt": "2023-11-09T10:05:00Z"
    }
  ]
}
```

---

## 💾 History API

### GET /history
Retrieve chat history for a document

**Query Parameters:**
- `documentId` (required) - Document ID

**Request:**
```javascript
const response = await axios.get('/api/history', {
  params: { documentId: "507f1f77bcf86cd799439011" }
});
```

**Response (200 OK):**
```json
{
  "history": [
    {
      "_id": "...",
      "documentId": "507f1f77bcf86cd799439011",
      "role": "user",
      "content": "What is the main topic?",
      "createdAt": "2023-11-09T10:00:00Z"
    },
    {
      "_id": "...",
      "documentId": "507f1f77bcf86cd799439011",
      "role": "assistant",
      "content": "The main topic is... [answer based on document]",
      "createdAt": "2023-11-09T10:00:05Z"
    }
  ]
}
```

---

## ⚡ Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400  | Bad Request | Check required parameters |
| 404  | Not Found | Document/resource doesn't exist |
| 500  | Server Error | Check backend logs, API key, MongoDB |
| 401  | Unauthorized | (Future) Implement JWT if needed |

---

## 🔄 Complete Chat Flow

```javascript
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// 1. Upload PDFs
const uploadRes = await api.post('/upload', formData);
const docId = uploadRes.data.documents[0].id;

// 2. Send a question
const chatRes = await api.post('/chat', {
  documentId: docId,
  question: 'What is the main idea?'
});

console.log(chatRes.data.answer);        // AI answer
console.log(chatRes.data.sources);       // Source excerpts

// 3. Generate summary
const summaryRes = await api.post('/summary', {
  documentId: docId,
  summaryType: 'detailed'
});

console.log(summaryRes.data.summary);

// 4. Save custom notes
await api.post('/notes', {
  documentId: docId,
  content: 'Important context for this document'
});

// 5. Retrieve chat history
const historyRes = await api.get('/history', {
  params: { documentId: docId }
});

console.log(historyRes.data.history);
```

---

## 📊 Database Schema Reference

### Document
```javascript
{
  _id: ObjectId,
  name: String,
  filename: String,
  storagePath: String,
  text: String,
  notes: String,
  chunks: [{
    chunkId: String,
    text: String,
    embedding: [Number],
    source: String,
    page: Number
  }],
  metadata: Object,
  createdAt: Date
}
```

### ChatMessage
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref: Document),
  role: String, // 'user' or 'assistant'
  content: String,
  createdAt: Date
}
```

### Note
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref: Document),
  content: String,
  createdAt: Date
}
```

---

**API Version:** 1.0  
**Last Updated:** November 2024  
**Status:** Production Ready
