import 'dotenv/config';
console.log('Starting server...');
import express from 'express';
console.log('Express imported...');
import cors from 'cors';
console.log('CORS imported...');
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/uploadRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import AI service to check status
import { getActiveProvider, isAIReady } from './services/aiService.js';
const app = express();

// Removed in-memory storage flag
// global.useInMemoryStorage = true;

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pdf-assistant';

console.log('Server setup starting...');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-ai-key']
}));

// Debug middleware to log AI key status (sanitized)
app.use((req, res, next) => {
  const aiKey = req.headers['x-ai-key'];
  if (aiKey) {
    console.log(`[Request] AI Key detected (${aiKey.length} chars)`);
  }
  next();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);

// Root route for server status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'AI PDF Chatbot Backend is running correctly',
    endpoints: {
      auth: '/api/auth',
      documents: '/api/documents',
      chat: '/api/chat',
      summary: '/api/summary'
    },
    ai: {
      ready: isAIReady(),
      provider: getActiveProvider()
    }
  });
});

async function createUploadsFolder() {
  const uploadsPath = path.join(__dirname, 'uploads');
  try {
    await fs.promises.mkdir(uploadsPath, { recursive: true });
  } catch (error) {
    console.error('Failed to create uploads directory:', error);
  }
}

async function startServer() {
  console.log('startServer function called');
  try {
    console.log('Connecting to MongoDB...');
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB successfully');
    } catch (err) {
      console.log('Failed to connect to local MongoDB. Starting in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Connected to in-memory MongoDB successfully');
    }

    console.log('Creating uploads folder...');
    await createUploadsFolder();
    console.log('Uploads folder created');

    console.log('Starting server on port', PORT);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`AI Integration: ${isAIReady() ? 'READY' : 'NOT CONFIGURED'}`);
      console.log(`AI Provider: ${getActiveProvider().toUpperCase()}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
