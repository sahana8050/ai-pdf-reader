import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Zap, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Cpu, 
  CheckCircle2,
  X
} from 'lucide-react';

const DashboardHome = ({ onAction, onFocusChat }) => {
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const cards = [
    {
      id: 'summary',
      icon: FileText,
      title: 'Smart Summaries',
      desc: 'Quickly generate summaries and extract key insights from your active PDF.',
      color: 'from-sky-400 to-blue-600',
      action: () => onAction('quick')
    },
    {
      id: 'chat',
      icon: Zap,
      title: 'Natural Chat',
      desc: 'Start a conversation with your documents to find specific information instantly.',
      color: 'from-violet-400 to-purple-600',
      action: onFocusChat
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Secure & Private',
      desc: 'Learn about our encryption and how we keep your documents safe.',
      color: 'from-emerald-400 to-teal-600',
      action: () => setShowSecurityModal(true)
    }
  ];

  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Workspace Ready</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4">Welcome to Your AI Dashboard</h2>
        <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
          Select a document from the sidebar to begin, or use the quick actions below to explore your intelligence suite.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.action}
              className="group cursor-pointer p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/20 text-left relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />
              
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg shadow-black/20`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                {card.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-slate-900 p-8 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setShowSecurityModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Security & Privacy</h2>
                  <p className="text-slate-400 text-sm">Enterprise-grade protection</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Lock, title: 'Encrypted Chats', text: 'End-to-end encryption for all AI interactions.' },
                  { icon: Cpu, title: 'Secure Uploads', text: 'PDFs are processed in isolated secure containers.' },
                  { icon: CheckCircle2, title: 'Private Storage', text: 'Your documents are never used for AI training.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                    <item.icon className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowSecurityModal(false)}
                className="mt-8 w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                I Understand
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHome;
