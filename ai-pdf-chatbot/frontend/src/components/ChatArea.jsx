import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatArea = ({ selectedDocument, messages, onSendMessage, loading, summary, sources, inputRef }) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
      <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl h-full flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-sky-400 font-medium mb-1">Active Context</p>
              <h2 className="text-2xl font-semibold text-white">
                {selectedDocument ? selectedDocument.name : 'No document selected'}
              </h2>
            </div>
            <div className="flex gap-2">
              {messages.some(m => m.content.includes('Demo Mode')) && (
                <div className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Demo Mode
                </div>
              )}
              <div className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border ${selectedDocument ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-slate-800 text-slate-400 border-white/10'}`}>
                {selectedDocument ? 'Ready' : 'Waiting'}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-[2rem] px-6 py-5 shadow-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-sky-500 to-violet-600 text-white rounded-tr-sm' 
                    : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-sm'
                }`}
              >
                <div className={`prose prose-invert max-w-none ${message.role === 'user' ? 'text-white' : 'text-slate-200'} prose-p:leading-relaxed prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-white/10`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="max-w-[72%] rounded-[2rem] rounded-tl-sm bg-white/5 px-6 py-5 border border-white/10 text-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-6 pt-4">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedDocument ? 'Ask anything about this document...' : 'Upload and select a document to start chatting.'}
              disabled={!selectedDocument}
              className="w-full min-h-[60px] max-h-[200px] rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 pr-24 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-60 transition-all custom-scrollbar"
            />
            <button
              onClick={handleSubmit}
              disabled={!selectedDocument || loading || !inputValue.trim()}
              className="absolute right-3 bottom-3 rounded-xl bg-white text-slate-900 px-4 py-2 text-sm font-semibold transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white flex items-center justify-center gap-2"
            >
              Send
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">
            AI can make mistakes. Always verify important information with the original document.
          </p>
        </div>
      </div>

      {summary && (
        <div className={`rounded-[2.5rem] border p-6 shadow-lg animate-in slide-in-from-bottom-4 ${summary.content.toLowerCase().includes('error') || summary.content.toLowerCase().includes('failed') ? 'border-red-500/20 bg-red-900/10' : 'border-sky-500/20 bg-slate-900/90 shadow-sky-500/10'}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">
              {summary.content.toLowerCase().includes('error') ? 'Analysis Error' : 'Document Analysis'}
            </h3>
            <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${summary.content.toLowerCase().includes('error') ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'}`}>
              {summary.type}
            </span>
          </div>
          <div className={`prose prose-invert max-w-none ${summary.content.toLowerCase().includes('error') ? 'text-red-300' : 'text-slate-300'}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {summary.content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-6 shadow-xl animate-in slide-in-from-bottom-4">
          <h3 className="text-lg font-semibold text-white mb-4">Relevant Sources</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {sources.map((source, index) => (
              <div key={index} className="rounded-2xl border border-white/5 bg-slate-900/50 p-5 hover:bg-slate-900/80 transition-colors">
                <p className="text-xs font-semibold text-sky-400 mb-2 truncate uppercase tracking-wider">{source.source}</p>
                <p className="text-sm leading-relaxed text-slate-300 italic">"{source.snippet}..."</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;