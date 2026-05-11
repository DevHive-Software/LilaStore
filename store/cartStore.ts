'use client';

import { create } from 'zustand';
import type { CartItem, Product } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity: number, selectedSize: string, selectedColor: string) => void;
  removeItem: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  loadFromStorage: () => void;
  getSubtotal: () => number;
  getShipping: (deliveryMethod?: 'domicilio' | 'tienda') => number;
  getTotal: (deliveryMethod?: 'domicilio' | 'tienda') => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  loadFromStorage: () => {
    const savedItems = storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
    set({ items: savedItems });
  },

  addItem: (product, quantity, selectedSize, selectedColor) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let newItems: CartItem[];

    if (existingIndex >= 0) {
      newItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: Math.min(item.quantity + quantity, item.product.stock) }
          : item
      );
    } else {
      newItems = [...items, { product, quantity, selectedSize, selectedColor }];
    }

    set({ items: newItems });
    storage.set(STORAGE_KEYS.CART, newItems);
  },

  removeItem: (productId, selectedSize, selectedColor) => {
    const { items } = get();
    const newItems = items.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        )
    );
    set({ items: newItems });
    storage.set(STORAGE_KEYS.CART, newItems);
  },

  updateQuantity: (productId, selectedSize, selectedColor, quantity) => {
    const { items } = get();
    if (quantity <= 0) {
      get().removeItem(productId, selectedSize, selectedColor);
      return;
    }
    const newItems = items.map((item) =>
      item.product.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
        ? { ...item, quantity: Math.min(quantity, item.product.stock) }
        : item
    );
    set({ items: newItems });
    storage.set(STORAGE_KEYS.CART, newItems);
  },

  clearCart: () => {
    set({ items: [] });
    storage.remove(STORAGE_KEYS.CART);
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  getShipping: (deliveryMethod = 'domicilio') => {
    const subtotal = get().getSubtotal();
    if (deliveryMethod === 'tienda') return 0;
    return subtotal >= 999 ? 0 : 99;
  },

  getTotal: (deliveryMethod = 'domicilio') => {
    return get().getSubtotal() + get().getShipping(deliveryMethod);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
