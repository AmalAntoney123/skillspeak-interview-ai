import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String },
    company: { type: String },
    date: { type: String },
    feedback: {
        overallScore: Number,
        technical: {
            score: Number,
            analysis: String
        },
        communication: {
            score: Number,
            analysis: String
        },
        cultural: {
            score: Number,
            analysis: String
        },
        strengths: [String],
        weaknesses: [String],
        improvements: [String]
    },
    transcription: { type: [String] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Interview', InterviewSchema);
