import express from 'express';
import jwt from 'jsonwebtoken';
import Interview from '../models/Interview.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Create Interview
router.post('/', auth, async (req, res) => {
    try {
        const { role, company, date, feedback, transcription } = req.body;
        const interview = new Interview({
            userId: req.userId,
            role,
            company,
            date,
            feedback,
            transcription
        });
        await interview.save();
        res.json(interview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get History
router.get('/', auth, async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(interviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
