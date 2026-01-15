
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface ForgotPasswordProps {
    onBack: () => void;
    initialEmail?: string;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, initialEmail = '' }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage({ text: 'Email is required', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            await authService.requestOtp(email);
            setMessage({ text: 'Verification code dispatched to your inbox.', type: 'success' });
            setStep(2);
        } catch (err: any) {
            setMessage({ text: err.message || 'System error. Please try again.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            setMessage({ text: 'All fields are required', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            await authService.resetPasswordWithOtp(email, otp, newPassword);
            setMessage({ text: 'Neural credentials synchronized. You can now sign in.', type: 'success' });
            setTimeout(() => onBack(), 3000);
        } catch (err: any) {
            setMessage({ text: err.message || 'Verification failed. Please check your code.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
            <div className="mb-8">
                <h2 className="text-4xl font-black text-[var(--text)] tracking-tighter mb-3">
                    {step === 1 ? 'Neural Recovery' : 'Identity Sync'}
                </h2>
                <p className="text-[var(--muted)] font-medium">
                    {step === 1 ? 'Initiate credential restoration sequence.' : 'Verify neural code and update credentials.'}
                </p>
            </div>

            {step === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Account Email</label>
                        <input
                            type="email"
                            className="w-full px-6 py-4 rounded-2xl border-none text-sm font-semibold transition-all focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="you@domain.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <div className={`${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} border p-5 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        disabled={isLoading}
                        className="w-full btn-primary py-5 rounded-[24px] font-black text-lg shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="uppercase tracking-[0.3em]">Dispatch Code</span>
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">Verification Code</label>
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full px-6 py-4 rounded-2xl border-none text-sm font-semibold transition-all focus:ring-2 focus:ring-indigo-500/50 text-center tracking-[0.5em]"
                            placeholder="000000"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1">New Neural Password</label>
                        <input
                            type="password"
                            className="w-full px-6 py-4 rounded-2xl border-none text-sm font-semibold transition-all focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <div className={`${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} border p-5 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        disabled={isLoading}
                        className="w-full btn-primary py-5 rounded-[24px] font-black text-lg shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="uppercase tracking-[0.3em] font-black">Sync Credentials</span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full text-[var(--muted)] hover:text-indigo-400 transition-all font-black text-[10px] uppercase tracking-[0.4em]"
                    >
                        Resend Code
                    </button>
                </form>
            )}

            <button
                type="button"
                onClick={onBack}
                className="w-full text-[var(--muted)] hover:text-indigo-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] py-2 border-t border-[var(--border)] pt-8"
            >
                Return to Login Core
            </button>
        </div>
    );
};
