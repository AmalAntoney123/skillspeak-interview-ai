
import React, { useState } from 'react';
import { InterviewSession } from '../types';
import * as pdfjs from 'pdfjs-dist';

// @ts-ignore - Vite worker import
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface SetupProps {
  onStart: (session: Partial<InterviewSession>) => void;
}

export const InterviewSetup: React.FC<SetupProps> = ({ onStart }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    role: 'Software Engineer',
    level: 'Senior',
    company: 'SkillSpeak AI',
    description: 'Focus on distributed systems, React performance, and team leadership.',
    proctoringEnabled: true,
    resumeText: ''
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    console.log('Extracting text from PDF...', file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
        stopAtErrors: false
      });
      const pdf = await loadingTask.promise;
      console.log(`PDF loaded. Pages: ${pdf.numPages}`);
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += pageText + '\n';
      }

      console.log('Extraction complete. Length:', fullText.length);
      return fullText.trim();
    } catch (err: any) {
      console.error('PDF extraction inner error:', err);
      throw new Error(`PDF Error: ${err.message || 'Unknown error'}`);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type);
    setResumeFileName(file.name);
    setIsExtracting(true);

    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPDF(file);
        if (!text) throw new Error('No text content found in PDF');
        setFormData(prev => ({ ...prev, resumeText: text }));
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setFormData(prev => ({ ...prev, resumeText: text }));
      } else {
        alert('Please upload a PDF or TXT file.');
        setResumeFileName('');
      }
    } catch (err: any) {
      console.error('Error extracting text:', err);
      alert(`Failed to extract text: ${err.message}`);
      setResumeFileName('');
    } finally {
      setIsExtracting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(formData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Step 01: Designation</h3>
              <p className="text-[var(--muted)] font-medium">What role are we calibrating the neural engine for today?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Target Role</label>
                <input
                  type="text"
                  className="w-full px-6 py-5 rounded-[24px] bg-[var(--accent)] border border-[var(--border)] focus:border-indigo-500 outline-none transition-all placeholder:text-[var(--muted)] text-sm"
                  placeholder="e.g. Lead Designer"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Complexity Level</label>
                <select
                  className="w-full px-6 py-5 rounded-[24px] bg-[var(--accent)] border border-[var(--border)] focus:border-indigo-500 outline-none cursor-pointer text-sm"
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
            <button type="button" onClick={nextStep} className="btn-primary w-full py-6 rounded-[24px] text-lg font-black uppercase tracking-[0.2em]">Next: Network Entity</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Step 02: Host Entity</h3>
              <p className="text-[var(--muted)] font-medium">Identify the organization you are simulating with.</p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Company Name</label>
              <input
                type="text"
                className="w-full px-6 py-5 rounded-[24px] bg-[var(--accent)] border border-[var(--border)] focus:border-indigo-500 outline-none transition-all placeholder:text-[var(--muted)] text-sm"
                placeholder="e.g. OpenAI, Netflix"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 px-8 py-6 rounded-[24px] border border-[var(--border)] text-[var(--muted)] font-black uppercase tracking-widest hover:bg-[var(--accent)] transition-all">Back</button>
              <button type="button" onClick={nextStep} className="flex-[2] btn-primary py-6 rounded-[24px] text-lg font-black uppercase tracking-[0.2em]">Next: Neural CV</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Step 03: Profile Sync</h3>
              <p className="text-[var(--muted)] font-medium">Upload your technical history for deep semantic context.</p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Resume Data (Optional)</label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full px-10 py-12 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-6 cursor-pointer ${resumeFileName ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border)] hover:border-indigo-500/50 bg-[var(--accent)]'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${resumeFileName ? 'bg-emerald-500 text-white animate-pulse' : 'bg-[var(--surface)] text-[var(--muted)]'}`}>
                    {resumeFileName && !isExtracting ? (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    )}
                  </div>
                  <div className="text-center">
                    <span className={`block text-lg font-black uppercase tracking-widest ${resumeFileName ? 'text-emerald-400' : 'text-white'}`}>
                      {isExtracting ? 'Synthesizing Neural Data...' : resumeFileName || 'Upload Technical CV'}
                    </span>
                    <span className="text-xs text-[var(--muted)] font-medium mt-2 block">Accepted formats: PDF, TXT (Max 10MB)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 px-8 py-6 rounded-[24px] border border-[var(--border)] text-[var(--muted)] font-black uppercase tracking-widest hover:bg-[var(--accent)] transition-all">Back</button>
              <button type="button" onClick={nextStep} disabled={isExtracting} className={`flex-[2] py-6 rounded-[24px] text-lg font-black uppercase tracking-[0.2em] transition-all ${resumeFileName && !isExtracting ? 'btn-primary' : 'bg-[var(--accent)] text-[var(--muted)] border border-[var(--border)]'}`}>Next: Context</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Final Step: Semantic Priming</h3>
              <p className="text-[var(--muted)] font-medium">Input the job description to hyper-tune the recruitment logic.</p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Neural Context (JD)</label>
              <textarea
                className="w-full px-6 py-5 rounded-[24px] bg-[var(--accent)] border border-[var(--border)] focus:border-indigo-500 outline-none h-48 resize-none transition-all placeholder:text-[var(--muted)] leading-relaxed text-sm"
                placeholder="Paste description to prime the model..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="flex-1 px-8 py-6 rounded-[24px] border border-[var(--border)] text-[var(--muted)] font-black uppercase tracking-widest hover:bg-[var(--accent)] transition-all">Back</button>
              <button type="submit" className="flex-[2] btn-primary py-6 rounded-[24px] text-xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/20">Launch Simulation</button>
            </div>
          </div>
        );
    }
  };

  const checkDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: formData.proctoringEnabled });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      console.error('Device check failed:', err);
      let msg = 'Failed to access media devices.';
      if (err.name === 'NotAllowedError') msg = 'Microphone/Camera access denied. Please enable permissions.';
      if (err.name === 'NotFoundError') msg = 'No microphone or camera found on this device.';
      alert(msg);
      return false;
    }
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExtracting(true); // Re-use loading state for device check
    const hasDevices = await checkDevices();
    setIsExtracting(false);
    if (hasDevices) {
      onStart(formData);
    }
  };

  return (
    <div className="bg-[var(--surface)] rounded-[60px] p-8 md:p-16 shadow-3xl border border-[var(--border)] w-full animate-in fade-in duration-1000 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative z-10">
        <div>
          <h2 className="text-5xl font-black text-[var(--text)] tracking-tighter mb-2 italic">Session Calibration</h2>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1.5 transition-all duration-500 rounded-full ${s <= step ? 'w-12 bg-indigo-500' : 'w-4 bg-[var(--border)]'}`}></div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 bg-[var(--accent)] p-5 rounded-[32px] border border-[var(--border)] shadow-xl">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-[var(--muted)] tracking-[0.2em]">Neural Proctor</p>
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
            <div className="w-12 h-7 bg-slate-400/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
          </label>
        </div>
      </div>

      <form onSubmit={handleLaunch} className="relative z-10">
        {renderStep()}
        <p className="text-center text-[9px] text-[var(--muted)] mt-12 font-black uppercase tracking-[0.4em] opacity-40 italic">Biometric & Semantic Analysis Engine v4.0.2</p>
      </form>
    </div>
  );
};
