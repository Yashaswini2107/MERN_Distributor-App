import express from 'express';
import bcrypt from 'bcryptjs';
import Agent from '../models/Agent.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create agent
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await Agent.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Agent already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const agent = await Agent.create({ name, email: email.toLowerCase(), mobile, passwordHash });
    res.status(201).json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List agents
router.get('/', auth, async (_req, res) => {
  try {
    const agents = await Agent.find({}).sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
