import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import interviewRoutes from './routes/interviews.js';

dotenv.config({ path: '../.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true, // No longer needed in Mongoose 6+
    //   useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);

app.get('/', (req, res) => {
    res.send('SkillSpeak API Running');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
