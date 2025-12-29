import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const seed = Math.random().toString(36).substr(2, 5);
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

        user = new User({
            email,
            password: hashedPassword,
            name,
            phone,
            avatar,
            avatarSeed: seed
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email, name, phone, avatar, avatarSeed: seed } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Signin
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name, phone: user.phone, avatar: user.avatar, avatarSeed: user.avatarSeed } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Me (validate token)
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ id: user._id, email: user.email, name: user.name, phone: user.phone, avatar: user.avatar, avatarSeed: user.avatarSeed });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Update Profile
router.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const updates = req.body;

        // Prevent updating sensitive fields like password directly here if not handled
        delete updates.password;
        delete updates.email; // Usually separate flow for email change
        delete updates._id;

        const user = await User.findByIdAndUpdate(decoded.userId, { $set: updates }, { new: true }).select('-password');

        res.json({ id: user._id, email: user.email, name: user.name, phone: user.phone, avatar: user.avatar, avatarSeed: user.avatarSeed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
