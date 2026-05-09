# AI PDF Document Assistant - Setup & Installation Guide

## Project Overview
Your AI PDF Chatbot has been upgraded to a **fully-featured intelligent document assistant** with RAG (Retrieval Augmented Generation), vector search, MongoDB persistence, and natural language chat powered by OpenAI.

## ⚙️ Installation & Setup

### 1. **Prerequisites**
- Node.js v18+ installed
- MongoDB running locally or MongoDB Atlas account
- OpenAI API key
- Python 3.8+ (optional, for database tools)

### 2. **Backend Setup**

```bash
cd ai-pdf-chatbot/backend
npm install
```

#### Configure Environment Variables (.env)
```bash
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/pdf-assistant

# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-large

# Server Port (Local)
PORT=5000

# Production URL (Optional for backend itself, but good to know)
# https://ai-pdf-reader-4.onrender.com
```

**How to get your OpenAI API Key:**
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it and paste into the .env file
4. Keep it secure and never commit to Git

#### Install MongoDB Locally (Windows)
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow prompts
3. MongoDB will start automatically
4. Verify: `mongosh` (should connect to local database)

Or use **MongoDB Atlas** (Cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://...`
4. Paste into MONGODB_URI

### 3. **Frontend Setup**

```bash
cd ../frontend
npm install
```

API configuration is centralized in `frontend/src/apiConfig.js`. It defaults to the production URL (`https://ai-pdf-reader-4.onrender.com`) but can be overridden by the `VITE_API_URL` environment variable.

### 4. **Starting the Application**

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
# Output: Server running on port 5000
# Connected to MongoDB
```

#### Terminal 2 - Frontend Dev Server
```bash
cd frontend
npm run dev
# Output: Local: http://localhost:5173
```

#### Open in Browser
```
http://localhost:5173
```

## 🚀 Features & Usage

### 1. **Upload PDFs**
- Click "Select PDFs" to choose one or more PDF files
- Add optional context in the notes field
- Click "Upload & Index Documents"
- PDFs are extracted, chunked, and vectorized

### 2. **Chat with Your Documents**
- Select a document from the list
- Ask natural language questions
- AI analyzes document content and provides grounded answers
- See relevant source excerpts

### 3. **Generate Summaries**
- Quick: Fast overview
- Detailed: Comprehensive analysis
- Bullet: Key points summary
- Interview Qs: Practice questions

### 4. **Manage Custom Notes**
- Add instructions for the AI
- Include important context
- Save notes for each document

### 5. **Document Management**
- View all uploaded documents
- Switch between documents
- Delete documents (removes file + DB record)

## 📁 Project Structure

```
ai-pdf-chatbot/
├── backend/
│   ├── controllers/        # API request handlers
│   │   ├── uploadController.js
│   │   ├── chatController.js
│   │   ├── summaryController.js
│   │   ├── documentController.js
│   │   ├── notesController.js
│   │   └── historyController.js
│   ├── models/            # MongoDB schemas
│   │   ├── Document.js
│   │   ├── ChatMessage.js
│   │   ├── Note.js
│   │   └── Summary.js
│   ├── services/          # Business logic
│   │   ├── documentService.js   # PDF processing
│   │   ├── vectorService.js     # Embeddings & search
│   │   ├── chatService.js       # RAG & AI responses
│   │   └── summaryService.js    # Summary generation
│   ├── routes/            # API endpoints
│   │   ├── uploadRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── summaryRoutes.js
│   │   ├── notesRoutes.js
│   │   └── historyRoutes.js
│   ├── utils/
│   │   └── textSplitter.js      # Text chunking
│   ├── uploads/           # PDF storage
│   ├── server.js          # Express entry point
│   ├── package.json
│   └── .env              # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Document management & upload
    │   │   └── ChatArea.jsx      # Chat interface
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🔌 API Endpoints

### Documents
- `GET /api/documents` - List all documents
- `DELETE /api/documents/:id` - Delete a document

### Chat
- `POST /api/chat` - Send question and get AI answer
  ```json
  {
    "documentId": "...",
    "question": "What is the summary?",
    "noteText": "Optional custom context"
  }
  ```

### Summary
- `POST /api/summary` - Generate document summary
  ```json
  {
    "documentId": "...",
    "summaryType": "quick|detailed|bullet|questions"
  }
  ```

### Upload
- `POST /api/upload` - Upload PDFs
  - Form data: `pdfs` (multipart), `extraText` (optional)

### Notes
- `POST /api/notes` - Save custom notes
- `GET /api/notes/:documentId` - Get document notes

### History
- `GET /api/history?documentId=...` - Get chat history

## 🤖 How the AI Works

### 1. **PDF Processing**
```
Upload PDF → Extract Text → Split into Chunks → Create Embeddings
```

### 2. **Semantic Search (RAG)**
```
User Question → Convert to Embedding → Find Similar Document Chunks → 
Retrieve Top 5 Matches → Pass to AI as Context
```

### 3. **Intelligent Response**
```
AI Receives:
- Document chunks (context)
- User question
- Chat history
- Custom notes

AI Generates:
- Grounded answer (from document only)
- Source references
- Conversational tone
```

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
Error: MongooseError: Can't connect to MongoDB
```
**Solution:**
- Verify MongoDB is running: `mongosh`
- Check MONGODB_URI in .env
- For Atlas: ensure IP whitelist includes your IP

### OpenAI API Error
```
Error: 401 Unauthorized - Invalid API key
```
**Solution:**
- Get fresh API key from https://platform.openai.com/api-keys
- Ensure key is copied completely
- Check rate limits: https://platform.openai.com/account/usage/overview

### PDF Upload Fails
```
Error: Failed to process PDF
```
**Solution:**
- Verify PDF is not corrupted
- Check file size (max 10MB)
- Try a simple PDF first (no embedded images)

### Port Already in Use
```
Error: EADDRINUSE - Port 5000 is already in use
```
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill process (replace PID)
taskkill /PID [PID] /F
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set `VITE_API_URL=your-backend-url`
4. Deploy

### Backend (Render/Railway)
1. Create account on Render.com or Railway.app
2. Connect GitHub repo
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create free cluster on MongoDB Atlas
2. Get connection string
3. Update MONGODB_URI in backend .env

## 📚 Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS (dark theme)
- Axios (HTTP client)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- OpenAI API
- LangChain (text processing)
- Multer (file upload)

**AI/Search:**
- OpenAI Embeddings (text-embedding-3-large)
- Semantic similarity search
- Retrieval Augmented Generation (RAG)

## 🎯 Next Steps

1. ✅ Install MongoDB locally or use Atlas
2. ✅ Add your OpenAI API key to .env
3. ✅ Run `npm install` in both folders
4. ✅ Start backend: `npm run dev`
5. ✅ Start frontend: `npm run dev`
6. ✅ Open http://localhost:5173
7. ✅ Upload a PDF and start chatting!

## 💡 Example Questions to Ask

- "Summarize this document"
- "What are the key points?"
- "Explain section 2 simply"
- "What does the author say about X?"
- "Generate 5 interview questions"
- "What are the main topics?"

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check backend logs (Terminal)
3. Verify .env variables are set
4. Check MongoDB connection
5. Check OpenAI API key validity

---

**Happy documenting! Your AI PDF assistant is ready to work.** 🎉
