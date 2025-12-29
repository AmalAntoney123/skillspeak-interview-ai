
import { User, InterviewSession } from '../types';

/**
 * SkillSpeak Service Layer
 * Simulates persistence with LocalStorage while maintaining MongoDB Atlas compatible structure.
 */

export const authService = {
  async signUp(email: string, password: string, name: string, phone: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const seed = Math.random().toString(36).substr(2, 5);
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          phone,
          avatarSeed: seed,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
        };
        localStorage.setItem('skillspeak_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 800);
    });
  },

  async signIn(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem('skillspeak_user');
        if (stored) {
          const user = JSON.parse(stored);
          if (user.email === email) {
            resolve(user);
            return;
          }
        }
        // Fallback for demo: create a mock user if one doesn't exist
        const guestUser: User = {
          id: 'guest_' + Date.now(),
          email,
          name: email.split('@')[0],
          phone: '+1 (555) 000-0000',
          avatarSeed: 'guest',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`
        };
        localStorage.setItem('skillspeak_user', JSON.stringify(guestUser));
        resolve(guestUser);
      }, 800);
    });
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = this.getCurrentUser();
    if (!current) throw new Error("No user logged in");
    const updated = { ...current, ...updates };
    if (updates.avatarSeed) {
      updated.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${updates.avatarSeed}`;
    }
    localStorage.setItem('skillspeak_user', JSON.stringify(updated));
    return updated;
  },

  signOut() {
    localStorage.removeItem('skillspeak_user');
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('skillspeak_user');
    return stored ? JSON.parse(stored) : null;
  },

  saveInterviewSession(session: InterviewSession) {
    const history = this.getInterviewHistory();
    history.unshift(session);
    localStorage.setItem('skillspeak_history', JSON.stringify(history));
  },

  getInterviewHistory(): InterviewSession[] {
    const stored = localStorage.getItem('skillspeak_history');
    return stored ? JSON.parse(stored) : [];
  }
};
