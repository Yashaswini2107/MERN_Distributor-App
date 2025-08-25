import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
