# AI PDF Document Assistant 🤖📄

A production-ready **intelligent PDF chat application** that uses AI embeddings and semantic search to answer questions about your documents with sources. Upload PDFs, ask questions naturally, and get answers grounded in the document content—just like ChatGPT but trained only on YOUR documents.

## ✨ Features

### 🎯 Core Capabilities
- ✅ **Upload Multiple PDFs** - Support for up to 10 files per upload (10MB each)
- ✅ **AI-Powered Chat** - Ask questions and get answers from document content
- ✅ **Semantic Search** - Vector embeddings find relevant document sections (RAG)
- ✅ **Source Attribution** - Every answer includes relevant document excerpts
- ✅ **Multi-Document Support** - Switch between documents, manage collections
- ✅ **Custom Notes** - Add instructions/context for the AI to reference
- ✅ **Smart Summaries** - Quick, detailed, bullet points, or interview questions
- ✅ **Chat History** - Maintain conversation memory within documents
- ✅ **Document Management** - Delete documents, view metadata

### 🎨 UI/UX
- **Modern Dark Theme** - Professional glassmorphism design
- **Responsive Layout** - Sidebar + main chat area
- **Loading States** - Visual feedback for uploads, AI processing
- **Smooth Animations** - Gradient backgrounds, hover effects
- **Intuitive Controls** - Simple upload, document selection, note saving

### 🧠 AI Intelligence
- **RAG (Retrieval Augmented Generation)** - Ground answers in actual document content
- **Vector Embeddings** - OpenAI text-embedding-3-large for semantic understanding
- **Context Injection** - Feed AI the 5 most relevant document chunks per question
- **Never Hallucinate** - AI only answers from what's in the documents
- **Conversation Memory** - Follow-up questions aware of chat history

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **OpenAI API Key** (free trial available)

### Setup (5 minutes)

```bash
# 1. Clone and navigate
cd ai-pdf-chatbot

# 2. Backend setup
cd backend
npm install
# Edit .env with your OpenAI API key
npm run dev
# Runs on https://ai-pdf-reader-4.onrender.com (Production)

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

### Get Your OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy it into `backend/.env` under `OPENAI_API_KEY`

---

## 📊 How It Works

### The RAG Pipeline

```
┌─ User Uploads PDF ──────────────────┐
│                                     ▼
│  Extract Text → Split into Chunks → Create Embeddings
│                                     │
│                 ┌────────────────────┘
│                 ▼
│  Store in MongoDB with Vector Embeddings
│
└──────────────────────────────────────┘

┌─ User Asks Question ────────────────┐
│                                     ▼
│  Question Embedding → Semantic Search (cosine similarity)
│                                     │
│         ┌───────────────────────────┘
│         ▼
│  Retrieve Top 5 Matching Chunks
│         │
│         ▼
│  Pass to OpenAI with Context
│         │
│         ▼
│  Generate Grounded Answer
│         │
│         ▼
│  Return Answer + Source Attribution
└─────────────────────────────────────┘
```

### Key Components

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite + Tailwind | UI for uploading, chatting, notes |
| **API** | Express.js | REST endpoints for all operations |
| **AI** | OpenAI + LangChain | Embeddings, chat completion |
| **Database** | MongoDB + Mongoose | Store docs, chunks, chat history |
| **Vector Search** | In-memory cosine similarity | Find relevant document sections |
| **File Storage** | Local filesystem | Store uploaded PDFs |

---

## 📁 Project Structure

```
ai-pdf-chatbot/
├── backend/                    # Node.js + Express server
│   ├── controllers/           # API handlers
│   ├── models/               # MongoDB schemas
│   ├── services/             # Business logic (RAG, embeddings)
│   ├── routes/               # API endpoints
│   ├── utils/                # Helpers (text splitting)
│   ├── uploads/              # Uploaded PDF storage
│   ├── server.js             # Express entry point
│   ├── package.json
│   └── .env                  # Config (API keys, DB URI)
│
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx           # Main component
│   │   ├── index.css         # Tailwind styles
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── SETUP.md                  # Detailed setup guide
├── API.md                    # API reference
└── README.md                 # This file
```

---

## 🔌 API Overview

### Key Endpoints

```bash
# Upload PDFs
POST /api/upload
Content-Type: multipart/form-data
Params: pdfs (files), extraText (optional context)

# Ask a question
POST /api/chat
Body: { documentId, question, noteText }

# Generate summary
POST /api/summary
Body: { documentId, summaryType: "quick|detailed|bullet|questions" }

# Manage documents
GET /api/documents
DELETE /api/documents/:id

# Save notes
POST /api/notes
Body: { documentId, content }

# Get chat history
GET /api/history?documentId=...
```

Full API reference: See [API.md](./API.md)

---

## 🎯 Example Interactions

### Example 1: Research Paper
```
User: "What is the research methodology?"
AI: "The study used mixed-methods approach combining surveys 
    (n=200) and interviews (n=30). Participants were recruited 
    from three geographic regions..."
Sources: 
- methodology-section.pdf (relevance: 0.94)
- study-design.pdf (relevance: 0.87)
```

### Example 2: Technical Documentation
```
User: "How do I install the package?"
AI: "Follow these steps:
1. Install via npm: npm install package-name
2. Import: const pkg = require('package-name')
3. Initialize: pkg.setup(config)"
Sources:
- getting-started.pdf (relevance: 0.98)
- installation-guide.pdf (relevance: 0.91)
```

### Example 3: Multi-Document Analysis
```
User: "Compare Chapter 3 across both documents"
AI: "Document A emphasizes X while Document B focuses on Y. 
    Both agree that Z is important, but differ in approach..."
```

---

## 🔐 Environment Variables

**backend/.env:**
```bash
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/pdf-assistant

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-large

# Server
PORT=5000
```

> **Security Note:** Never commit .env to Git. Add to .gitignore.

---

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev              # Start with auto-reload
npm run lint            # Check code quality
```

### Frontend Development
```bash
cd frontend
npm run dev             # Start dev server
npm run build          # Production build
npm run preview        # Preview build
```

### MongoDB
```bash
# Local development
mongosh                 # Connect to local MongoDB

# View documents
db.documents.find()
db.chatmessages.find()
db.notes.find()
```

---

## 🚀 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Connect repo to Vercel
3. Set `VITE_API_URL` environment variable
4. Auto-deploys on push

### Backend → Render/Railway
1. Create account & connect GitHub
2. Set environment variables
3. Deploy

### Database → MongoDB Atlas
1. Create free cluster
2. Update `MONGODB_URI`
3. Whitelist your server IP

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Solution: Ensure MongoDB is running
$ mongosh
# Should connect to local database
```

### OpenAI API Error
```
Solution: Verify API key in .env
$ curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-proj-..."
```

### Port 5000 Already in Use
```
# Find & kill process
$ netstat -ano | findstr :5000
$ taskkill /PID <PID> /F
```

### PDF Upload Fails
- Check file is valid PDF
- Ensure size < 10MB
- Verify uploads folder exists

See [SETUP.md](./SETUP.md) for more troubleshooting.

---

## 📚 Learning Resources

### Understanding RAG
- [What is RAG?](https://docs.llamaindex.ai/en/stable/module_guides/querying/retrieval_augmented_generation/)
- [Embeddings Explained](https://openai.com/blog/new-embedding-models-and-api-updates)
- [Semantic Search Guide](https://www.youtube.com/watch?v=0BRjSLRwQcs)

### Tech Stack Documentation
- [Express.js](https://expressjs.com/)
- [MongoDB/Mongoose](https://mongoosejs.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/docs)

---

## 🎓 Key Concepts

### Embeddings
Vector representations of text that capture semantic meaning. Similar texts have similar embeddings.

### RAG (Retrieval Augmented Generation)
Technique where relevant document sections are retrieved and passed to the LLM for better, grounded answers.

### Chunking
Breaking documents into overlapping chunks (~1000 tokens) to fit within AI model context windows.

### Cosine Similarity
Mathematical measure of how similar two vectors are (0-1 scale). Used to find relevant document chunks.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🎉 What You Can Build Next

- 🗣️ Voice input/output
- 🎨 Custom styling per document
- 📊 PDF visualization & annotations
- 🌍 Multi-language support
- 🤖 Custom AI models
- 📧 Email export of summaries
- 🔐 User authentication
- 🌙 Dark/light mode toggle
- 📱 Mobile app

---

## 💬 Support

- 📖 [Setup Guide](./SETUP.md)
- 🔌 [API Reference](./API.md)
- 🐛 Check backend console logs: `npm run dev` output
- 🌐 Check frontend console: F12 → Console tab

---

**Built with ❤️ using React, Node.js, and AI**

Transform how you interact with documents. Upload PDFs and have intelligent conversations with them.

```
Your AI PDF Assistant is ready to work! 🚀
```


A full-stack web application for uploading and chatting with PDF documents using AI.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- Multer
- pdf-parse
- CORS
- dotenv

## Features

- Modern dark UI with glassmorphism effects
- PDF upload and text extraction
- Responsive design
- Clean component-based architecture
- Production-ready structure

## Installation

1. Clone or download the project
2. Navigate to the project root directory

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Backend will run on https://ai-pdf-reader-4.onrender.com (Production)

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

## API Endpoints

### POST /upload
Upload a PDF file and extract text.

**Request:** Multipart form data with 'pdf' field
**Response:** JSON with extracted text

## Deployment

### Frontend (Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Vercel
3. Set environment variable `VITE_API_URL` to your backend URL

### Backend (Render)
1. Deploy the backend folder to Render
2. Set environment variables in Render dashboard
3. Use the deployed URL in frontend

### Connecting Frontend to Deployed Backend
- Use `import.meta.env.VITE_API_URL` (configured in `apiConfig.js`)

## Future Enhancements

- AI integration (OpenAI/Gemini)
- MongoDB for data storage
- Advanced chat features
- PDF preview
- Multiple file support