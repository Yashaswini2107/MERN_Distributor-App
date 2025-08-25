import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, required: true }, // include country code
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Agent', agentSchema);
