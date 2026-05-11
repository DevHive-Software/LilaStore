'use client';

import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toast } from '@/components/ui/Toast';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { demoProducts, demoCategories } from '@/lib/demoData';

export function Providers({ children }: { children: React.ReactNode }) {
  const { loadFromStorage: loadCart } = useCartStore();
  const { loadFromStorage: loadNotifications } = useNotificationStore();
  const { loadFromStorage: loadAuth } = useAuthStore();

  useEffect(() => {
    // Initialize stores from localStorage
    loadCart();
    loadNotifications();
    loadAuth();

    // Seed demo data if not present
    const existingProducts = storage.get(STORAGE_KEYS.PRODUCTS, null);
    if (!existingProducts) {
      storage.set(STORAGE_KEYS.PRODUCTS, demoProducts);
    }

    const existingCategories = storage.get(STORAGE_KEYS.CATEGORIES, null);
    if (!existingCategories) {
      storage.set(STORAGE_KEYS.CATEGORIES, demoCategories);
    }
  }, [loadCart, loadNotifications, loadAuth]);

  // Cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CART) {
        loadCart();
      }
      if (e.key === STORAGE_KEYS.NOTIFICATIONS) {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadCart, loadNotifications]);

  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <Toast />
    </>
  );
}
