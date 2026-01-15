import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { InterviewFeedback } from '../types';

interface FeedbackProps {
  feedback: InterviewFeedback;
  transcription?: string[];
  onRestart: () => void;
}

export const FeedbackReport: React.FC<FeedbackProps> = ({ feedback, transcription, onRestart }) => {
  const chartData = [
    { subject: 'Technical', A: feedback.technicalScore || (feedback as any).technical?.score || 0, fullMark: 100 },
    { subject: 'Communication', A: feedback.communicationScore || (feedback as any).communication?.score || 0, fullMark: 100 },
    { subject: 'Confidence', A: feedback.confidenceScore || 0, fullMark: 100 },
    { subject: 'Structure', A: feedback.structureScore || 85, fullMark: 100 },
    { subject: 'Relevance', A: feedback.relevanceScore || 90, fullMark: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-24 px-4">
      <div className="glass-card rounded-[60px] overflow-hidden border border-[var(--border)] shadow-3xl">
        <div className="bg-gradient-to-br from-indigo-600/20 via-[var(--accent)] to-[var(--bg)] p-12 md:p-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-12 border-b border-[var(--border)]">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black text-[var(--text)] tracking-tighter mb-6 leading-none">Neural Insights</h2>
            <p className="text-[var(--muted)] text-xl font-medium leading-relaxed">Multimodal evaluation of your interview performance and technical delivery semantics.</p>
          </div>
          <div className="bg-[var(--surface)] backdrop-blur-xl p-12 rounded-[48px] border border-[var(--border)] shadow-2xl min-w-[240px] flex flex-col items-center">
            <div className="text-8xl font-black text-[var(--text)] mb-2 leading-none tracking-tighter">{feedback.overallScore}%</div>
            <div className="text-[10px] font-black tracking-[0.4em] uppercase text-indigo-400">Cognitive Score</div>
          </div>
        </div>

        <div className="p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Chart Section */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
              <h3 className="text-3xl font-black text-[var(--text)] tracking-tight uppercase">Performance Matrix</h3>
            </div>
            <div className="h-[450px] w-full bg-[var(--accent)] rounded-[48px] p-8 border border-[var(--border)] shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-indigo-600/10 rounded-[40px] p-12 border border-indigo-500/20 relative overflow-hidden">
              <h4 className="font-black text-indigo-400 text-sm uppercase tracking-[0.3em] mb-4">Neural Summary</h4>
              <p className="text-[var(--text)] text-xl leading-relaxed font-semibold italic">"{feedback.summary}"</p>
            </div>
          </div>

          {/* Qualitative Section */}
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 text-xl font-black">✓</div>
                <h3 className="text-3xl font-black text-[var(--text)] tracking-tight uppercase">High Markers</h3>
              </div>
              <ul className="space-y-5">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="bg-emerald-500/[0.03] text-[var(--text)] p-8 rounded-3xl border border-emerald-500/10 font-medium leading-relaxed">
                    <span className="text-emerald-500 font-black mr-2">/</span> {s}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 border border-orange-500/20 text-xl font-black">!</div>
                <h3 className="text-3xl font-black text-[var(--text)] tracking-tight uppercase">Adjustment zones</h3>
              </div>
              <ul className="space-y-5">
                {feedback.improvements.map((im, i) => (
                  <li key={i} className="bg-orange-500/[0.03] text-[var(--text)] p-8 rounded-3xl border border-orange-500/10 font-medium leading-relaxed">
                    <span className="text-orange-500 font-black mr-2">/</span> {im}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Transcript Section */}
        {transcription && transcription.length > 0 && (
          <div className="px-12 md:px-20 pb-12 md:pb-20">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
              <h3 className="text-3xl font-black text-[var(--text)] tracking-tight uppercase">Session Transcript</h3>
            </div>
            <div className="bg-[var(--accent)] rounded-[40px] p-8 md:p-12 border border-[var(--border)] max-h-[600px] overflow-y-auto custom-scrollbar space-y-6">
              {transcription.map((line, i) => {
                const isUser = line.startsWith('Candidate');
                return (
                  <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest mb-2 text-[var(--muted)] opacity-60">
                      {isUser ? 'Candidate Request' : 'Interviewer Response'}
                    </span>
                    <div className={`max-w-[80%] px-8 py-6 rounded-[32px] text-base leading-relaxed font-medium ${isUser
                      ? 'bg-indigo-600/10 text-indigo-300 rounded-tr-none border border-indigo-500/20'
                      : 'bg-[var(--surface)] text-[var(--text)] rounded-tl-none border border-[var(--border)]'
                      }`}>
                      {line.split(': ').slice(1).join(': ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-[var(--accent)] p-16 border-t border-[var(--border)] flex justify-center">
          <button
            onClick={onRestart}
            className="btn-primary px-24 py-6 rounded-[32px] font-black text-2xl shadow-2xl uppercase tracking-[0.2em]"
          >
            Practice Next Level
          </button>
        </div>
      </div>
    </div>
  );
};
