import { create } from 'zustand';
import api from '../services/api.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, loading: false });
  },

  fetchMe: async () => {
    const currentToken = get().token || localStorage.getItem('token');
    if (!currentToken) {
      set({ user: null, token: null, loading: false });
      return { success: false, error: 'No token' };
    }

    set({ loading: true });
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user;
      set({ user, loading: false });
      return { success: true, data: user };
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      get().setAuth(user, token);
      return { success: true, data: response.data };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check credentials.',
      };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user, token } = response.data;
      get().setAuth(user, token);
      return { success: true, data: response.data };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed.',
      };
    }
  },
}));

export default useAuthStore;
