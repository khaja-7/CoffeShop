import { create } from 'zustand';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('coffee_user')) || null,
  token: localStorage.getItem('coffee_token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('coffee_token', data.token);
      localStorage.setItem('coffee_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('coffee_token', data.token);
      localStorage.setItem('coffee_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('coffee_token');
    localStorage.removeItem('coffee_user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
