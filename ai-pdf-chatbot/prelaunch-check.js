#!/usr/bin/env node

console.log(`
╔════════════════════════════════════════════════════════════════╗
║   AI PDF Document Assistant - Pre-Launch Checklist            ║
║   Complete the steps below to get your app running            ║
╚════════════════════════════════════════════════════════════════╝
`);

const fs = require('fs');
const path = require('path');

const checks = [
  {
    name: '✅ Node.js Installed',
    test: () => {
      try {
        require('child_process').execSync('node --version', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    fix: 'Install Node.js 18+ from https://nodejs.org/'
  },
  {
    name: '✅ MongoDB Available',
    test: () => {
      try {
        require('child_process').execSync('mongosh --version', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    fix: 'Install MongoDB or use MongoDB Atlas (https://www.mongodb.com/cloud/atlas)'
  },
  {
    name: '✅ Backend Dependencies',
    test: () => fs.existsSync(path.join(__dirname, 'backend', 'node_modules')),
    fix: 'Run: cd backend && npm install'
  },
  {
    name: '✅ Frontend Dependencies',
    test: () => fs.existsSync(path.join(__dirname, 'frontend', 'node_modules')),
    fix: 'Run: cd frontend && npm install'
  },
  {
    name: '✅ Backend .env File',
    test: () => fs.existsSync(path.join(__dirname, 'backend', '.env')),
    fix: 'Create backend/.env with OPENAI_API_KEY and MONGODB_URI'
  },
  {
    name: '✅ OpenAI API Key Set',
    test: () => {
      const envFile = path.join(__dirname, 'backend', '.env');
      if (!fs.existsSync(envFile)) return false;
      const content = fs.readFileSync(envFile, 'utf-8');
      return content.includes('OPENAI_API_KEY') && !content.includes('your-key');
    },
    fix: 'Get key from https://platform.openai.com/api-keys and add to .env'
  },
  {
    name: '✅ MongoDB URI Set',
    test: () => {
      const envFile = path.join(__dirname, 'backend', '.env');
      if (!fs.existsSync(envFile)) return false;
      const content = fs.readFileSync(envFile, 'utf-8');
      return content.includes('MONGODB_URI') && content.includes('mongodb');
    },
    fix: 'Add MONGODB_URI to backend/.env (local or Atlas)'
  }
];

console.log('Running pre-launch checks...\n');

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const result = check.test();
  if (result) {
    console.log(`  ${check.name.padEnd(40)} PASS`);
    passed++;
  } else {
    console.log(`  ${check.name.padEnd(40)} FAIL`);
    console.log(`     → ${check.fix}\n`);
    failed++;
  }
});

console.log(`\n${passed}/${checks.length} checks passed\n`);

if (failed === 0) {
  console.log(`╔════════════════════════════════════════════════════════════════╗
║   ✅ All checks passed! You're ready to launch!              ║
╚════════════════════════════════════════════════════════════════╝

NEXT STEPS:

1️⃣  Start Backend Server
    Terminal 1:
    $ cd backend
    $ npm run dev
    
    Wait for: "Connected to MongoDB"

2️⃣  Start Frontend Dev Server
    Terminal 2:
    $ cd frontend
    $ npm run dev
    
    Opens: http://localhost:5173

3️⃣  Upload a PDF
    - Click "Select PDFs"
    - Choose a PDF file
    - Click "Upload & Index Documents"
    
4️⃣  Ask Questions
    - Select your document
    - Type a question
    - Click "Send"
    - Get AI-powered answers!

═══════════════════════════════════════════════════════════════

📚 Documentation:
   - README.md - Overview & features
   - SETUP.md - Detailed setup guide
   - API.md - API reference

🐛 Troubleshooting:
   - Check backend console for errors
   - Check browser console (F12)
   - Verify MongoDB is running
   - Verify OpenAI API key is valid

═══════════════════════════════════════════════════════════════
   Your AI PDF Document Assistant is ready! 🚀
═══════════════════════════════════════════════════════════════
`);
} else {
  console.log(`❌ ${failed} check(s) failed. Fix the issues above and try again.\n`);
  process.exit(1);
}
