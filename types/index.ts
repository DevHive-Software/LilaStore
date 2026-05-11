export type ProductCategory = 'ropa' | 'accesorios' | 'calzado' | 'bolsas' | 'promociones';

export interface ProductSize {
  label: string;
  available: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: ProductCategory;
  sizes: ProductSize[];
  colors: ProductColor[];
  images: string[];
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export type OrderStatus =
  | 'pendiente_pago'
  | 'comprobante_enviado'
  | 'pago_en_revision'
  | 'pago_aprobado'
  | 'pago_rechazado'
  | 'preparando_pedido'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  references: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  folio: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  deliveryMethod: 'domicilio' | 'tienda';
  status: OrderStatus;
  paymentProof?: string;
  concept: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: { status: OrderStatus; date: string; note?: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: ProductCategory;
  description: string;
  active: boolean;
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Toast {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

/* ─── Users ─── */

export type UserRole = 'comprador' | 'vendedor';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  avatar?: string;
  createdAt: string;
  active: boolean;
}

export interface SellerProfile {
  userId: string;
  storeName: string;
  storeDescription: string;
  bankName?: string;
  bankAccount?: string;
  bankClabe?: string;
  totalSales: number;
  totalRevenue: number;
  createdAt: string;
}
