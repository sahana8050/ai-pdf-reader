import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  type: { type: String, default: 'quick' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Summary', summarySchema);
