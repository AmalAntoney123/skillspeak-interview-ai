
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface ProfilePageProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    avatarSeed: user.avatarSeed || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await authService.updateProfile(formData);
      onUpdate(updated);
      setMessage('Profile sync completed successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error syncing identity data.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
      <div className="glass-card rounded-[48px] shadow-2xl overflow-hidden border border-[var(--border)]">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-900 h-40 relative">
           <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="px-10 pb-12">
          <div className="relative -mt-20 mb-10 flex justify-center">
            <div className="p-3 bg-[var(--surface)] rounded-[40px] shadow-2xl border border-[var(--border)]">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.avatarSeed}`}
                alt="Avatar Preview" 
                className="w-40 h-40 rounded-[32px] border-4 border-[var(--border)] bg-[var(--accent)]"
              />
            </div>
          </div>

          <h2 className="text-4xl font-black text-center text-[var(--text)] mb-12 tracking-tighter">Identity Config</h2>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em] ml-1">Display Alias</label>
              <input
                type="text"
                className="w-full px-6 py-5 rounded-2xl border border-[var(--border)] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold bg-[var(--accent)] text-[var(--text)]"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em] ml-1">Visual Seed</label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  className="flex-1 px-6 py-5 rounded-2xl border border-[var(--border)] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-bold bg-[var(--accent)] text-[var(--text)]"
                  value={formData.avatarSeed}
                  onChange={e => setFormData({ ...formData, avatarSeed: e.target.value })}
                  placeholder="Entropy source..."
                />
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarSeed: Math.random().toString(36).substr(2, 6) })}
                  className="px-6 py-4 bg-[var(--accent)] text-indigo-400 rounded-2xl hover:bg-[var(--surface)] transition-colors border border-[var(--border)]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-3 font-bold uppercase tracking-widest leading-loose">Randomize your neural avatar representation.</p>
            </div>

            {message && (
              <p className={`text-center text-xs font-black uppercase tracking-widest py-4 rounded-2xl bg-[var(--accent)] ${message.includes('Error') ? 'text-red-400 border border-red-500/20' : 'text-emerald-400 border border-emerald-500/20'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full btn-primary py-6 rounded-[28px] font-black text-xl shadow-2xl uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Synchronizing...' : 'Save Configuration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
