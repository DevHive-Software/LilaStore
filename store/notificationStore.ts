'use client';

import { create } from 'zustand';
import type { Notification, Toast, NotificationType } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { generateId } from '@/lib/utils';

interface NotificationStore {
  notifications: Notification[];
  toasts: Toast[];
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addToast: (type: NotificationType, title: string, message: string) => void;
  removeToast: (id: string) => void;
  loadFromStorage: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  toasts: [],

  loadFromStorage: () => {
    const savedNotifications = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    set({ notifications: savedNotifications });
  },

  addNotification: (type, title, message) => {
    const notification: Notification = {
      id: generateId(),
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const { notifications } = get();
    const newNotifications = [notification, ...notifications].slice(0, 50);
    set({ notifications: newNotifications });
    storage.set(STORAGE_KEYS.NOTIFICATIONS, newNotifications);
  },

  markAsRead: (id) => {
    const { notifications } = get();
    const newNotifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({ notifications: newNotifications });
    storage.set(STORAGE_KEYS.NOTIFICATIONS, newNotifications);
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const newNotifications = notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: newNotifications });
    storage.set(STORAGE_KEYS.NOTIFICATIONS, newNotifications);
  },

  removeNotification: (id) => {
    const { notifications } = get();
    const newNotifications = notifications.filter((n) => n.id !== id);
    set({ notifications: newNotifications });
    storage.set(STORAGE_KEYS.NOTIFICATIONS, newNotifications);
  },

  addToast: (type, title, message) => {
    const toast: Toast = {
      id: generateId(),
      type,
      title,
      message,
    };
    set((state) => ({ toasts: [...state.toasts, toast] }));

    setTimeout(() => {
      get().removeToast(toast.id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
