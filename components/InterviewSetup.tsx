
import React, { useState } from 'react';
import { InterviewSession } from '../types';

interface SetupProps {
  onStart: (session: Partial<InterviewSession>) => void;
}

export const InterviewSetup: React.FC<SetupProps> = ({ onStart }) => {
  const [formData, setFormData] = useState({
    role: 'Software Engineer',
    level: 'Senior',
    company: 'SkillSpeak AI',
    description: 'Focus on distributed systems, React performance, and team leadership.',
    proctoringEnabled: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(formData);
  };

  return (
    <div className="bg-[var(--surface)] rounded-[48px] p-8 md:p-14 shadow-2xl border border-[var(--border)] w-full animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h2 className="text-4xl font-black text-[var(--text)] tracking-tighter mb-2">Session Config</h2>
          <p className="text-[var(--muted)] font-medium">Calibrate the neural engine for your specific interview target.</p>
        </div>
        <div className="flex items-center gap-6 bg-[var(--accent)] p-5 rounded-[32px] border border-[var(--border)]">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em]">Video Neural Proctor</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${formData.proctoringEnabled ? 'text-emerald-500' : 'text-[var(--muted)]'}`}>
              {formData.proctoringEnabled ? 'Active Detection' : 'Standby Mode'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={formData.proctoringEnabled}
              onChange={e => setFormData({ ...formData, proctoringEnabled: e.target.checked })}
            />
            <div className="w-12 h-7 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Target Designation</label>
            <input
              type="text"
              className="w-full px-6 py-5 rounded-[20px] outline-none transition-all placeholder:text-[var(--muted)] text-sm"
              placeholder="e.g. Lead Designer"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Complexity Level</label>
            <select
              className="w-full px-6 py-5 rounded-[20px] outline-none cursor-pointer text-sm"
              value={formData.level}
              onChange={e => setFormData({ ...formData, level: e.target.value })}
            >
              <option>Entry-level</option>
              <option>Junior</option>
              <option>Mid-level</option>
              <option>Senior</option>
              <option>Principal</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Host Entity (Company)</label>
          <input
            type="text"
            className="w-full px-6 py-5 rounded-[20px] outline-none transition-all placeholder:text-[var(--muted)] text-sm"
            placeholder="e.g. OpenAI, Netflix"
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Neural Context (JD)</label>
          <textarea
            className="w-full px-6 py-5 rounded-[20px] outline-none h-40 resize-none transition-all placeholder:text-[var(--muted)] leading-relaxed text-sm"
            placeholder="Paste description to prime the model..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="pt-8">
          <button 
            type="submit" 
            className="btn-primary w-full py-6 text-xl rounded-[24px] shadow-2xl shadow-indigo-500/10 uppercase tracking-[0.3em] font-black"
          >
            Launch Simulation
          </button>
          <p className="text-center text-[9px] text-[var(--muted)] mt-8 font-black uppercase tracking-[0.4em]">Powered by Gemini Multimodal Neural Engine</p>
        </div>
      </form>
    </div>
  );
};
