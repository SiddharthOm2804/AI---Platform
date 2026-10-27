import express from 'express';
import fs from 'fs/promises';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { extractText } from '../utils/resumeParser.js';
import { extractSkills, calculateATSScore, generateSuggestions } from '../utils/atsScorer.js';
import { getEmbedding } from '../ai/transformersRunner.js';

const router = express.Router();

// POST /api/upload-resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res, next) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = req.file.path;
    const text = await extractText(filePath, req.file.mimetype);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded document.' });
    }

    const jobSkills = req.body.jobSkills
      ? req.body.jobSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const skills = extractSkills(text);
    const atsScore = calculateATSScore(text, skills, jobSkills);
    const suggestions = generateSuggestions(text, skills);
    const words = text.trim().split(/\s+/).filter(Boolean);
    const textLength = words.length;

    // Local transformer embedding (Tier 2, 384-dim)
    const embedding = (await getEmbedding(text)) || [];

    const uploadedAt = new Date();

    // Update user document
    req.user.resume = {
      fileUrl: `/uploads/${req.file.filename}`,
      parsedText: text,
      atsScore,
      atsScoreML: null,
      skills,
      embedding,
      analysis: {
        suggestions,
        textLength,
      },
      uploadedAt,
    };

    await req.user.save();

    // Clean up uploaded file
    try {
      await fs.unlink(filePath);
    } catch (unlinkErr) {
      console.warn('Could not delete temporary uploaded file:', unlinkErr.message);
    }

    res.json({
      skills,
      atsScore,
      textLength,
      suggestions,
      uploadedAt,
      embeddingDimensions: embedding.length,
    });
  } catch (error) {
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch {}
    }
    next(error);
  }
});

// GET /api/resume
router.get('/resume', auth, async (req, res) => {
  res.json({
    resume: req.user.resume || null,
  });
});

// DELETE /api/resume
router.delete('/resume', auth, async (req, res, next) => {
  try {
    req.user.resume = null;
    await req.user.save();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
