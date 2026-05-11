'use client';

import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { generateId } from '@/lib/utils';
import type { User, UserRole, SellerProfile } from '@/types';

interface UserStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  register: (data: { name: string; email: string; password: string; role: UserRole; phone?: string }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  loadFromStorage: () => void;
  getSellerProfile: (userId: string) => SellerProfile | null;
  createSellerProfile: (userId: string, storeName: string, storeDescription: string) => void;
  updateSellerProfile: (userId: string, data: Partial<SellerProfile>) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,

  loadFromStorage: () => {
    const saved = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (saved) set({ currentUser: saved, isAuthenticated: true });
  },

  register: (data) => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const exists = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { ok: false, error: 'Este correo ya está registrado' };

    const newUser: User = {
      id: generateId(),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      active: true,
    };

    const updated = [...users, newUser];
    storage.set(STORAGE_KEYS.USERS, updated);

    // Auto-create seller profile
    if (data.role === 'vendedor') {
      const profiles = storage.get<SellerProfile[]>(STORAGE_KEYS.SELLER_PROFILES, []);
      const newProfile: SellerProfile = {
        userId: newUser.id,
        storeName: `Tienda de ${data.name}`,
        storeDescription: 'Mi tienda en LilaStore',
        totalSales: 0,
        totalRevenue: 0,
        createdAt: new Date().toISOString(),
      };
      storage.set(STORAGE_KEYS.SELLER_PROFILES, [...profiles, newProfile]);
    }

    storage.set(STORAGE_KEYS.CURRENT_USER, newUser);
    set({ currentUser: newUser, isAuthenticated: true });
    return { ok: true };
  },

  login: (email, password) => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: 'Correo o contraseña incorrectos' };
    if (!user.active) return { ok: false, error: 'Tu cuenta está desactivada' };

    storage.set(STORAGE_KEYS.CURRENT_USER, user);
    set({ currentUser: user, isAuthenticated: true });
    return { ok: true };
  },

  logout: () => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    set({ currentUser: null, isAuthenticated: false });
  },

  updateProfile: (data) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updated = { ...currentUser, ...data };
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updated : u));
    storage.set(STORAGE_KEYS.USERS, updatedUsers);
    storage.set(STORAGE_KEYS.CURRENT_USER, updated);
    set({ currentUser: updated });
  },

  getSellerProfile: (userId) => {
    const profiles = storage.get<SellerProfile[]>(STORAGE_KEYS.SELLER_PROFILES, []);
    return profiles.find((p) => p.userId === userId) ?? null;
  },

  createSellerProfile: (userId, storeName, storeDescription) => {
    const profiles = storage.get<SellerProfile[]>(STORAGE_KEYS.SELLER_PROFILES, []);
    const exists = profiles.find((p) => p.userId === userId);
    if (exists) return;
    const newProfile: SellerProfile = {
      userId,
      storeName,
      storeDescription,
      totalSales: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.SELLER_PROFILES, [...profiles, newProfile]);
  },

  updateSellerProfile: (userId, data) => {
    const profiles = storage.get<SellerProfile[]>(STORAGE_KEYS.SELLER_PROFILES, []);
    const updated = profiles.map((p) => (p.userId === userId ? { ...p, ...data } : p));
    storage.set(STORAGE_KEYS.SELLER_PROFILES, updated);
  },
}));
