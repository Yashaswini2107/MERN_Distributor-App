import express from 'express';
import multer from 'multer';
import { uploadCSV } from '../controllers/uploadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// POST /api/upload/file
router.post('/file', authMiddleware, upload.single('file'), uploadCSV);

// GET /api/upload/items/:agentId
import Item from '../models/Item.js';
router.get('/items/:agentId', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ agent: req.params.agentId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
