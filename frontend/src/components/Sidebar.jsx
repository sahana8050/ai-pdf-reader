import React, { useRef, useState } from 'react';

const Sidebar = ({
  documents,
  selectedDocument,
  notes,
  onNotesChange,
  onUploadFiles,
  onSelectDocument,
  onDeleteDocument,
  onSaveNotes,
  onRequestSummary,
  loading,
  uploadMessage
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [extraText, setExtraText] = useState('');

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert('Select PDF files to upload.');
      return;
    }
    await onUploadFiles(selectedFiles, extraText);
    setSelectedFiles([]);
    setExtraText('');
    fileInputRef.current.value = null;
  };

  return (
    <div className="w-96 border-r border-white/10 bg-slate-900/90 backdrop-blur-xl p-6 flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-violet-500 rounded-3xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <span className="text-white text-lg font-bold">AI</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Document Assistant</p>
            <h1 className="text-2xl font-semibold text-white">PDF Intelligence</h1>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-inner shadow-black/10">
          <p className="text-sm text-slate-300 mb-3">Upload one or more PDFs, then chat naturally with your documents.</p>
          <button
            onClick={openFileDialog}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
          >
            Select PDFs
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileSelection}
            className="hidden"
          />
          <textarea
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder="Add optional context or notes for the assistant..."
            className="mt-4 w-full min-h-[96px] rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-4 rounded-3xl border border-sky-500/20 bg-slate-950/90 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white mb-2">Selected files</p>
              <ul className="space-y-1">
                {selectedFiles.map((file) => (
                  <li key={file.name} className="truncate text-slate-300">{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Uploading...' : 'Upload & Index Documents'}
          </button>
          {uploadMessage && (
            <p className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{uploadMessage}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Uploaded Documents</h2>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{documents.length}</span>
        </div>
        <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
          {documents.map((doc) => (
            <div
              key={doc._id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDocument(doc)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectDocument(doc)}
              className={`w-full rounded-3xl border px-4 py-3 text-left transition ${selectedDocument?._id === doc._id ? 'border-sky-400 bg-slate-800/80 shadow-lg shadow-sky-500/10' : 'border-white/10 bg-slate-950/70 hover:border-slate-200/20 hover:bg-slate-900/80'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white truncate">{doc.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(doc._id);
                  }}
                  className="text-slate-400 hover:text-rose-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-sm text-slate-400">No documents uploaded yet. Use the upload panel to add PDFs.</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Custom Notes</h3>
          <button
            onClick={onSaveNotes}
            disabled={!selectedDocument || loading}
            className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          disabled={!selectedDocument}
          placeholder={selectedDocument ? 'Save custom instructions or context for the AI assistant.' : 'Select a document to write notes.'}
          className="w-full min-h-[120px] rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:cursor-not-allowed"
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">AI Configuration</h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Settings</p>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">API Key (OpenAI or Gemini)</label>
            <div className="flex gap-2">
              <input
                type="password"
                defaultValue={window.localStorage.getItem('aiKey') || ''}
                id="ai-key-input"
                placeholder="sk-... or Gemini Key"
                className="flex-1 rounded-2xl border border-white/10 bg-slate-900 p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
              />
              <button
                onClick={() => {
                  const val = document.getElementById('ai-key-input').value;
                  window.localStorage.setItem('aiKey', val);
                  window.location.reload();
                }}
                className="rounded-xl bg-sky-500 px-3 py-2 text-xs font-bold text-white hover:bg-sky-600 transition"
              >
                Save
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 italic">Enter your key and click Save to activate full AI features.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {['quick', 'detailed', 'bullet', 'questions'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onRequestSummary(type)}
              disabled={!selectedDocument || loading}
              className="rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-xs font-semibold uppercase tracking-widest text-slate-200 transition hover:border-sky-400 hover:text-white disabled:opacity-50"
            >
              {type === 'questions' ? 'Interview Qs' : type === 'bullet' ? 'Bullet Notes' : type === 'detailed' ? 'Detailed' : 'Quick'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;