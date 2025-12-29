
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthPageProps {
  onSuccess: (user: User) => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Email Validation
    if (!formData.email) {
      newErrors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }

    if (!isLogin) {
      // Name Validation
      if (!formData.name) {
        newErrors.name = 'Full Name required';
      }

      // Phone Validation
      if (!formData.phone) {
        newErrors.phone = 'Phone Number required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      let user: User;
      if (isLogin) {
        user = await authService.signIn(formData.email, formData.password);
      } else {
        user = await authService.signUp(formData.email, formData.password, formData.name, formData.phone);
      }
      onSuccess(user);
    } catch (err) {
      setErrors({ form: 'Neural handshake failed. Credentials mismatch.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-[var(--surface)] rounded-[48px] shadow-3xl overflow-hidden border border-[var(--border)] relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onBack}
          className="absolute top-8 right-8 z-20 text-[var(--muted)] hover:text-[var(--text)] transition-all p-3 hover:bg-[var(--accent)] rounded-2xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* LEFT SIDE: BRANDING / VISUALS */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-indigo-600 via-indigo-900 to-black text-white relative overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] animate-bounce duration-[10s]"></div>
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center font-black text-3xl mb-12 shadow-2xl border border-white/10">S</div>
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
              Establish <br /> Your <span className="text-indigo-400">Identity.</span>
            </h1>
            <p className="text-indigo-100/60 text-lg font-medium max-w-sm leading-relaxed">
              Sync with the world's most advanced AI interview coach and unlock your hidden potential.
            </p>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-all">🎤</div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Real-time Analysis</h4>
                <p className="text-xs text-indigo-100/40">Vocal semantics & body logic</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-all">🧠</div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Cognitive Insights</h4>
                <p className="text-xs text-indigo-100/40">Technical depth mapping</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="p-8 md:p-16 lg:p-20 bg-[var(--surface)] flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-[var(--text)] tracking-tighter mb-3">
              {isLogin ? 'Welcome Back' : 'Join SkillSpeak'}
            </h2>
            <p className="text-[var(--muted)] font-medium">
              {isLogin ? 'Resume your neural link evolution.' : 'Initiate your coaching sequence today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-top-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    className={`w-full px-6 py-4 rounded-2xl border-none text-sm font-semibold transition-all ${errors.name ? 'ring-2 ring-red-500/50' : 'focus:ring-2 focus:ring-indigo-500/50'}`}
                    placeholder="Alex Smith"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    className={`w-full px-6 py-4 rounded-2xl border-none text-sm font-semibold transition-all ${errors.phone ? 'ring-2 ring-red-500/50' : 'focus:ring-2 focus:ring-indigo-500/50'}`}
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.phone}</p>}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                className={`w-full px-6 py-4 rounded-2xl border-none text-sm font-semibold transition-all ${errors.email ? 'ring-2 ring-red-500/50' : 'focus:ring-2 focus:ring-indigo-500/50'}`}
                placeholder="you@domain.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                className={`w-full px-6 py-4 rounded-2xl border-none text-sm font-semibold transition-all ${errors.password ? 'ring-2 ring-red-500/50' : 'focus:ring-2 focus:ring-indigo-500/50'}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.password}</p>}
            </div>

            {errors.form && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-[10px] font-black uppercase text-center tracking-widest">
                {errors.form}
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full btn-primary py-5 rounded-[24px] font-black text-lg shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98] mt-4"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="uppercase tracking-[0.3em]">{isLogin ? 'Access System' : 'Initiate Setup'}</span>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-[var(--border)] text-center lg:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[var(--muted)] text-[10px] font-black uppercase tracking-widest">
              {isLogin ? "New candidate?" : "Already registered?"}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              className="bg-indigo-500/10 text-indigo-400 px-6 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-indigo-500/20 transition-all tracking-widest"
            >
              {isLogin ? 'Create Profile' : 'System Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
