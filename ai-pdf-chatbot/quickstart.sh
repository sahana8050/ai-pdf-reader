#!/bin/bash

# AI PDF Document Assistant - Quick Start Script

echo "🚀 Starting AI PDF Document Assistant..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install from https://nodejs.org/"
    exit 1
fi

# Check MongoDB
echo "Checking MongoDB..."
if ! command -v mongosh &> /dev/null; then
    echo "⚠️  MongoDB shell not found. Install from https://www.mongodb.com/try/download/community"
    echo "   Continuing anyway - ensure MongoDB is running on localhost:27017"
else
    echo "✅ MongoDB shell found"
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend ready"

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend ready"

echo ""
echo "⚙️ Configuration Check..."
cd ../backend
if grep -q "your-key" .env 2>/dev/null; then
    echo "⚠️  IMPORTANT: Update your OpenAI API key in backend/.env"
    echo "   Get it from: https://platform.openai.com/api-keys"
fi

echo ""
echo "🎯 Ready to start!"
echo ""
echo "In Terminal 1, run:"
echo "  cd ai-pdf-chatbot/backend"
echo "  npm run dev"
echo ""
echo "In Terminal 2, run:"
echo "  cd ai-pdf-chatbot/frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
