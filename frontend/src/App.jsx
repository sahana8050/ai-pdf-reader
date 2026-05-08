import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar.jsx';
import ChatArea from './components/ChatArea.jsx';
import Navbar from './components/Navbar.jsx';
import AuthModal from './components/AuthModal.jsx';
import LandingPage from './components/LandingPage.jsx';
import DashboardHome from './components/DashboardHome.jsx';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`
});

function AppContent() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to your AI PDF Assistant. Upload a PDF to start asking questions, creating summaries, and exploring your documents intelligently.'
    }
  ]);
  const [noteText, setNoteText] = useState('');
  const [summary, setSummary] = useState(null);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Lifted Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialLoginState, setInitialLoginState] = useState(true);
  
  const chatInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    const aiKey = localStorage.getItem('aiKey');
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      loadDocuments();
    }
    
    if (aiKey) {
      api.defaults.headers.common['x-ai-key'] = aiKey;
    }

    // Handle initial routing based on auth state
    if (userInfo && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/dashboard');
    }
    
    // Handle login/signup routes
    if (location.pathname === '/login') {
      triggerAuth(true);
    } else if (location.pathname === '/signup') {
      triggerAuth(false);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    
    const aiKey = localStorage.getItem('aiKey');
    if (aiKey) {
      api.defaults.headers.common['x-ai-key'] = aiKey;
    }
    
    loadDocuments();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete api.defaults.headers.common['Authorization'];
    setDocuments([]);
    setSelectedDocument(null);
    navigate('/');
  };

  const loadDocuments = async () => {
    try {
      const response = await api.get('/documents');
      const docs = response.data.documents || [];
      setDocuments(docs);

      if (docs.length > 0 && !selectedDocument) {
        setSelectedDocument(docs[0]);
        setNoteText(docs[0].notes || '');
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleUploadFiles = async (files, extraText) => {
    if (!files.length) return;
    setLoading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('pdfs', file);
      }
      formData.append('extraText', extraText || '');

      const uploadResponse = await api.post('/upload', formData);
      await loadDocuments(); // Refresh

      setUploadMessage('PDF uploaded successfully ✅');
      setSummary(null);
      setSources([]);

      window.setTimeout(() => setUploadMessage(''), 5000);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
    setNoteText(document.notes || '');
    setSummary(null);
    setSources([]);
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      const updated = documents.filter((doc) => doc._id !== documentId);
      setDocuments(updated);
      if (selectedDocument?._id === documentId) {
        const nextDoc = updated[0] || null;
        setSelectedDocument(nextDoc);
        setNoteText(nextDoc?.notes || '');
      }
    } catch (error) {
      alert('Unable to delete the document.');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedDocument) return;
    try {
      await api.post('/notes', {
        documentId: selectedDocument._id,
        content: noteText
      });
      await loadDocuments();
      alert('Notes saved successfully.');
    } catch (error) {
      alert('Unable to save notes.');
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedDocument) return;

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await api.post('/chat', {
        documentId: selectedDocument._id,
        question: text,
        noteText
      });

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.answer
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSources(response.data.sources || []);
    } catch (error) {
      alert('Unable to generate answer right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSummary = async (summaryType) => {
    if (!selectedDocument) {
      alert('Please select a document first.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`/summary/${summaryType}`, {
        documentId: selectedDocument._id
      });
      
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `**${summaryType.toUpperCase()} SUMMARY:**\n\n${response.data.summary}`
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSummary(null);
    } catch (error) {
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Unable to generate summary.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerAuth = (isLogin) => {
    setInitialLoginState(isLogin);
    setShowAuthModal(true);
    if (isLogin) navigate('/login');
    else navigate('/signup');
  };

  const handleFocusChat = () => {
    // If no document selected, select first one if available
    if (!selectedDocument && documents.length > 0) {
      handleSelectDocument(documents[0]);
    }
    
    // Use timeout to ensure component renders before focusing
    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-sky-500/30">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onAuth={triggerAuth}
      />

      <Routes>
        <Route path="/" element={!user ? <LandingPage onAuth={triggerAuth} /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LandingPage onAuth={triggerAuth} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <LandingPage onAuth={triggerAuth} /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          user ? (
            <main className="flex-1 flex overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.1),_transparent_40%)] pointer-events-none" />
              
              <Sidebar
                documents={documents}
                selectedDocument={selectedDocument}
                notes={noteText}
                onNotesChange={setNoteText}
                onUploadFiles={handleUploadFiles}
                onSelectDocument={handleSelectDocument}
                onDeleteDocument={handleDeleteDocument}
                onSaveNotes={handleSaveNotes}
                onRequestSummary={handleRequestSummary}
                loading={loading}
                uploadMessage={uploadMessage}
              />
              
              {selectedDocument ? (
                <ChatArea
                  selectedDocument={selectedDocument}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  loading={loading}
                  summary={summary}
                  sources={sources}
                  inputRef={chatInputRef}
                />
              ) : (
                <DashboardHome 
                  onAction={handleRequestSummary} 
                  onFocusChat={handleFocusChat}
                />
              )}
            </main>
          ) : (
            <Navigate to="/" />
          )
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <AuthModal
        isOpen={showAuthModal}
        initialIsLogin={initialLoginState}
        onClose={() => {
          setShowAuthModal(false);
          navigate('/');
        }}
        onSuccess={(userData) => {
          setShowAuthModal(false);
          handleLoginSuccess(userData);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;