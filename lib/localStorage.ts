export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage might be full or unavailable
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable
    }
  },
};

export const STORAGE_KEYS = {
  CART: 'lila_cart',
  ORDERS: 'lila_orders',
  PRODUCTS: 'lila_products',
  CATEGORIES: 'lila_categories',
  NOTIFICATIONS: 'lila_notifications',
  ADMIN_AUTH: 'lila_admin_auth',
  CHECKOUT_ORDER: 'lila_checkout_order',
  USERS: 'lila_users',
  CURRENT_USER: 'lila_current_user',
  SELLER_PROFILES: 'lila_seller_profiles',
};
