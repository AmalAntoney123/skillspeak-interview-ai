import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String },
    company: { type: String },
    date: { type: String },
    feedback: {
        overallScore: Number,
        technicalScore: Number,
        communicationScore: Number,
        confidenceScore: Number,
        structureScore: Number,
        relevanceScore: Number,
        strengths: [String],
        improvements: [String],
        summary: String
    },
    transcription: { type: [String] },
    resumeText: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Interview', InterviewSchema);
