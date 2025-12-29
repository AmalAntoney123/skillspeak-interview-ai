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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const updated = await authService.updateProfile({
        name: formData.name,
        avatarSeed: formData.avatarSeed,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.avatarSeed}`
      });
      onUpdate(updated);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordMessage('');
        setShowPasswordForm(false);
      }, 2000);
    } catch (err: any) {
      setPasswordMessage(err.message || 'Error changing password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="glass-card rounded-3xl shadow-xl overflow-hidden border border-[var(--border)]">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 h-32 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="p-2 bg-[var(--surface)] rounded-3xl shadow-xl border border-[var(--border)]">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.avatarSeed}`}
                  alt="Avatar"
                  className="w-28 h-28 rounded-2xl border-2 border-[var(--border)] bg-[var(--accent)]"
                />
              </div>
            </div>

            <h2 className="text-2xl font-black text-center text-[var(--text)] mb-6">Profile</h2>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium bg-[var(--accent)] text-[var(--text)]"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Avatar Seed</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium bg-[var(--accent)] text-[var(--text)]"
                    value={formData.avatarSeed}
                    onChange={e => setFormData({ ...formData, avatarSeed: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarSeed: Math.random().toString(36).substr(2, 6) })}
                    className="px-4 py-3 bg-[var(--accent)] text-indigo-400 rounded-xl hover:bg-[var(--surface)] transition-colors border border-[var(--border)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm font-medium bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed"
                  value={user.email}
                  disabled
                />
              </div>

              {user.phone && (
                <div>
                  <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm font-medium bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed"
                    value={user.phone}
                    disabled
                  />
                </div>
              )}

              {message && (
                <p className={`text-center text-xs font-bold py-2 rounded-lg ${message.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full btn-primary py-3 rounded-xl font-bold text-sm shadow-lg uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Security Card */}
        <div className="glass-card rounded-3xl shadow-xl overflow-hidden border border-[var(--border)]">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-32 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-8 py-8">
            <div className="flex items-center justify-center mb-6 -mt-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-black text-center text-[var(--text)] mb-6">Security</h2>

            {!showPasswordForm ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--muted)] text-center mb-6">Manage your account security and password</p>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg uppercase tracking-wider transition-all active:scale-95"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium bg-[var(--accent)] text-[var(--text)]"
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium bg-[var(--accent)] text-[var(--text)]"
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium bg-[var(--accent)] text-[var(--text)]"
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                {passwordMessage && (
                  <p className={`text-center text-xs font-bold py-2 rounded-lg ${passwordMessage.includes('Error') || passwordMessage.includes('incorrect') || passwordMessage.includes('not match') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {passwordMessage}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordMessage('');
                    }}
                    className="flex-1 bg-[var(--accent)] text-[var(--text)] py-3 rounded-xl font-bold text-sm border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};