import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function generateFolio(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LILA-${year}-${random}`;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pendiente_pago: 'Pendiente de Pago',
    comprobante_enviado: 'Comprobante Enviado',
    pago_en_revision: 'Pago en Revisión',
    pago_aprobado: 'Pago Aprobado',
    pago_rechazado: 'Pago Rechazado',
    preparando_pedido: 'Preparando Pedido',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pendiente_pago: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    comprobante_enviado: 'bg-blue-100 text-blue-800 border-blue-200',
    pago_en_revision: 'bg-orange-100 text-orange-800 border-orange-200',
    pago_aprobado: 'bg-green-100 text-green-800 border-green-200',
    pago_rechazado: 'bg-red-100 text-red-800 border-red-200',
    preparando_pedido: 'bg-purple-100 text-purple-800 border-purple-200',
    enviado: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelado: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
