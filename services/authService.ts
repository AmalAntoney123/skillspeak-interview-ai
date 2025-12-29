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

    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
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
