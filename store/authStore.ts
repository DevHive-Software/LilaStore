'use client';

import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';

const ADMIN_EMAIL = 'admin@lilastore.demo';
const ADMIN_PASSWORD = 'admin123';

interface AuthStore {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  adminEmail: null,

  loadFromStorage: () => {
    const savedAuth = storage.get<{ isAuthenticated: boolean; adminEmail: string | null }>(
      STORAGE_KEYS.ADMIN_AUTH,
      { isAuthenticated: false, adminEmail: null }
    );
    set(savedAuth);
  },

  login: (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const authData = { isAuthenticated: true, adminEmail: email };
      set(authData);
      storage.set(STORAGE_KEYS.ADMIN_AUTH, authData);
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false, adminEmail: null });
    storage.remove(STORAGE_KEYS.ADMIN_AUTH);
  },
}));
