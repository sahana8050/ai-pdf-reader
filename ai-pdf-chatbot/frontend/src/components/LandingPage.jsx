import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Shield, 
  X, 
  CheckCircle2, 
  Send, 
  Lock, 
  Cpu, 
  ArrowRight
} from 'lucide-react';

const LandingPage = ({ onAuth }) => {
  const [activeModal, setActiveModal] = useState(null);

  const features = [
    {
      id: 'summary',
      icon: FileText,
      title: 'Smart Summaries',
      desc: 'Get instant overviews of massive documents with key insights extracted automatically.',
      color: 'from-sky-400 to-blue-600',
      shadow: 'shadow-sky-500/20'
    },
    {
      id: 'chat',
      icon: Zap,
      title: 'Natural Chat',
      desc: 'Converse with your PDFs like you would with ChatGPT. Get grounded, intelligent answers.',
      color: 'from-violet-400 to-purple-600',
      shadow: 'shadow-violet-500/20'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Secure & Private',
      desc: 'Your documents are encrypted and processed with the highest privacy standards.',
      color: 'from-emerald-400 to-teal-600',
      shadow: 'shadow-emerald-500/20'
    }
  ];

  return (
    <main className="flex-1 relative flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-sky-500/10 rounded-full mix-blend-screen filter blur-[128px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-violet-500/10 rounded-full mix-blend-screen filter blur-[128px] pointer-events-none" 
      />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-medium text-slate-300">New: Powered by Gemini 1.5 Flash</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-tight"
        >
          Master Your PDFs with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400">
            Advanced AI
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed"
        >
          Transform how you interact with information. Upload documents, generate summaries, and chat naturally to unlock insights in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal(feature.id)}
              className={`group cursor-pointer p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all hover:bg-white/[0.06] hover:border-white/20 relative overflow-hidden ${feature.shadow}`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                {feature.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <button 
            onClick={() => onAuth(false)}
            className="group relative px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-lg hover:scale-105 transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            Get Started Free
            <span className="absolute inset-0 rounded-2xl bg-white blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {activeModal === 'summary' && (
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Smart Summaries</h2>
                      <p className="text-slate-400 text-sm">Experience the power of AI analysis</p>
                    </div>
                  </div>

                  <div className="space-y-6 bg-black/40 rounded-3xl p-6 border border-white/5 font-mono text-sm">
                    <div className="flex items-center gap-2 text-sky-400 border-b border-white/10 pb-3">
                      <Zap className="w-4 h-4" />
                      <span>AI GENERATED SUMMARY</span>
                    </div>
                    
                    <div>
                      <p className="text-slate-300 leading-relaxed italic mb-4">
                        "The document outlines a revolutionary framework for decentralized data storage, emphasizing peer-to-peer verification and zero-knowledge proofs to ensure user sovereignty."
                      </p>
                      
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Key Takeaways:
                      </h4>
                      <ul className="space-y-3 text-slate-400">
                        <li className="flex gap-3">
                          <span className="text-sky-500">•</span>
                          <span>Reduces data redundancy by 40% using sharding.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-sky-500">•</span>
                          <span>Implements AES-256 encryption at the edge.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-sky-500">•</span>
                          <span>Scales linearly with new network participants.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => onAuth(false)}
                      className="flex-1 px-6 py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-lg shadow-sky-500/20"
                    >
                      Upload PDF to Try
                    </button>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'chat' && (
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Natural Chat</h2>
                      <p className="text-slate-400 text-sm">Interactive demo conversation</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-violet-500 text-white p-4 rounded-2xl rounded-tr-none text-sm">
                        What is this document about?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-white/10 text-slate-200 p-4 rounded-2xl rounded-tl-none text-sm border border-white/10">
                        <TypingSimulation text="This document is a technical whitepaper on AI-driven data processing. It covers neural networks, large language models, and their practical applications in finance." />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-violet-500 text-white p-4 rounded-2xl rounded-tr-none text-sm">
                        Can you find the section on risk management?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-white/10 text-slate-200 p-4 rounded-2xl rounded-tl-none text-sm border border-white/10">
                        <div className="flex gap-2 items-center text-slate-400 italic">
                          <Cpu className="w-4 h-4 animate-spin-slow" />
                          <span>AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <button 
                      onClick={() => onAuth(false)}
                      className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold transition-all shadow-xl shadow-violet-500/20 flex items-center justify-center gap-2"
                    >
                      Start Chatting with Your PDFs
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'security' && (
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Secure & Private</h2>
                      <p className="text-slate-400 text-sm">Your data safety is our priority</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: Lock, title: 'Encrypted Uploads', text: 'All files are encrypted using industry-standard protocols.' },
                      { icon: Shield, title: 'Privacy First', text: 'Your data is never used to train global AI models.' },
                      { icon: Cpu, title: 'Local Context', text: 'AI processing is isolated and secure for each session.' },
                      { icon: CheckCircle2, title: 'Auth Protection', text: 'Multi-layered authentication keeps your account safe.' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-5 rounded-3xl bg-white/5 border border-white/10">
                        <item.icon className="w-6 h-6 text-emerald-400 mb-3" />
                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Enterprise Grade Security</span>
                    </div>
                    <button 
                      onClick={() => onAuth(false)}
                      className="w-full px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all"
                    >
                      Join Securely Now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

const TypingSimulation = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default LandingPage;
