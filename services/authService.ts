import { User, InterviewSession } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const authService = {
  async signUp(email: string, password: string, name: string, phone: string): Promise<User> {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    localStorage.setItem('token', data.token);
    return data.user;
  },

  async signIn(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signin failed');
    localStorage.setItem('token', data.token);
    return data.user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No user logged in");

    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No user logged in");

    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to change password');
    return data;
  },

  async requestOtp(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'OTP request failed');
    return data;
  },

  async resetPasswordWithOtp(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/reset-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Reset failed');
    return data;
  },

  async verifyEmail(email: string, otp: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Verification failed');
    return data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to resend code');
    return data;
  },

  signOut() {
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        localStorage.removeItem('token');
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  async saveInterviewSession(session: InterviewSession) {
    const token = localStorage.getItem('token');
    if (!token) return;
    await fetch(`${API_URL}/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(session)
    });
  },

  async getInterviewHistory(): Promise<InterviewSession[]> {
    const token = localStorage.getItem('token');
    if (!token) return [];
    try {
      const res = await fetch(`${API_URL}/interviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }
};