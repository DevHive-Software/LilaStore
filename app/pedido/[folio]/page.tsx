'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Package, Check, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor, cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const STATUS_ORDER: OrderStatus[] = [
  'pendiente_pago',
  'comprobante_enviado',
  'pago_en_revision',
  'pago_aprobado',
  'preparando_pedido',
  'enviado',
  'entregado',
];

function getStatusIcon(status: OrderStatus, current: OrderStatus) {
  const statusIndex = STATUS_ORDER.indexOf(status);
  const currentIndex = STATUS_ORDER.indexOf(current);

  if (currentIndex > statusIndex) return <Check size={16} />;
  if (currentIndex === statusIndex) return <Clock size={16} className="animate-pulse" />;
  return <div className="w-2 h-2 rounded-full bg-current" />;
}

export default function PedidoPage() {
  const params = useParams();
  const folioFromUrl = params.folio as string;

  const [searchFolio, setSearchFolio] = useState(folioFromUrl === 'buscar' ? '' : folioFromUrl);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showSearch, setShowSearch] = useState(folioFromUrl === 'buscar');

  useEffect(() => {
    if (folioFromUrl && folioFromUrl !== 'buscar') {
      searchOrder(folioFromUrl);
    }
  }, [folioFromUrl]);

  const searchOrder = (folio: string) => {
    if (!folio.trim()) return;
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    const found = orders.find(
      (o) => o.folio.toLowerCase() === folio.trim().toLowerCase()
    );
    if (found) {
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(searchFolio);
  };

  const isCancelled = order?.status === 'cancelado';
  const isRejected = order?.status === 'pago_rechazado';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-1 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-lila-600 transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-gray-700">Rastrear pedido</span>
          </nav>
          <h1 className="text-2xl font-black text-gray-900">Rastrear pedido</h1>
          <p className="text-gray-500 mt-1">Ingresa tu folio para ver el estado de tu pedido</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchFolio}
              onChange={(e) => setSearchFolio(e.target.value)}
              placeholder="Ej: LILA-2024-AB12"
              className="input-field pl-9"
            />
          </div>
          <button type="submit" className="btn-primary px-6">
            Buscar
          </button>
        </form>

        {/* Not found */}
        {notFound && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
            <h3 className="font-bold text-red-700">Pedido no encontrado</h3>
            <p className="text-red-500 text-sm mt-1">
              Verifica que el folio esté escrito correctamente
            </p>
          </div>
        )}

        {/* Order found */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status overview */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pedido</p>
                  <p className="font-black text-xl text-gray-900 font-mono">{order.folio}</p>
                </div>
                <span className={cn('badge border', getOrderStatusColor(order.status))}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>

              {/* Timeline */}
              {!isCancelled && !isRejected && (
                <div className="relative">
                  <div className="space-y-0">
                    {STATUS_ORDER.map((status, index) => {
                      const statusIndex = STATUS_ORDER.indexOf(status);
                      const currentIndex = STATUS_ORDER.indexOf(order.status);
                      const isCompleted = currentIndex > statusIndex;
                      const isCurrent = currentIndex === statusIndex;
                      const isFuture = currentIndex < statusIndex;
                      const historyEntry = order.statusHistory.find((h) => h.status === status);

                      return (
                        <div key={status} className="flex gap-4 relative">
                          {/* Line */}
                          {index < STATUS_ORDER.length - 1 && (
                            <div
                              className={cn(
                                'absolute left-[17px] top-8 w-0.5 h-full',
                                isCompleted ? 'bg-lila-400' : 'bg-gray-200'
                              )}
                            />
                          )}

                          {/* Icon */}
                          <div
                            className={cn(
                              'w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 z-10',
                              isCompleted && 'bg-lila-500 border-lila-500 text-white',
                              isCurrent && 'bg-white border-lila-500 text-lila-600',
                              isFuture && 'bg-white border-gray-200 text-gray-300'
                            )}
                          >
                            {getStatusIcon(status, order.status)}
                          </div>

                          {/* Content */}
                          <div className="pb-6 flex-1">
                            <p
                              className={cn(
                                'font-semibold text-sm',
                                isCurrent && 'text-lila-700',
                                isCompleted && 'text-gray-900',
                                isFuture && 'text-gray-400'
                              )}
                            >
                              {getOrderStatusLabel(status)}
                            </p>
                            {historyEntry && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatDate(historyEntry.date)}
                              </p>
                            )}
                            {historyEntry?.note && (
                              <p className="text-xs text-gray-500 mt-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                                {historyEntry.note}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancelled/Rejected state */}
              {(isCancelled || isRejected) && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
                  <p className="font-semibold text-red-700">{getOrderStatusLabel(order.status)}</p>
                  <p className="text-red-500 text-sm mt-1">
                    Contacta con nosotros para más información
                  </p>
                </div>
              )}
            </div>

            {/* Order details */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">Productos</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-gray-400 text-xs">
                        x{item.quantity} · {item.selectedSize} · {item.selectedColor}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-3 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Envío</span>
                  <span>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1">
                  <span>Total</span>
                  <span className="text-lila-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">Información de entrega</h2>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Nombre</span>
                  <span className="text-gray-900 font-medium">{order.customer.fullName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Teléfono</span>
                  <span className="text-gray-900">{order.customer.phone}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Método</span>
                  <span className="text-gray-900 capitalize">
                    {order.deliveryMethod === 'domicilio' ? 'Envío a domicilio' : 'Recolección en tienda'}
                  </span>
                </div>
                {order.deliveryMethod === 'domicilio' && order.customer.address && (
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-24 shrink-0">Dirección</span>
                    <span className="text-gray-900">
                      {order.customer.address}, {order.customer.city}, {order.customer.state}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment proof */}
            {order.paymentProof && order.paymentProof.startsWith('data:image') && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4">Comprobante de pago</h2>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.paymentProof}
                    alt="Comprobante de pago"
                    className="w-full max-h-64 object-contain bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Help */}
            <div className="text-center text-sm text-gray-400">
              ¿Tienes dudas?{' '}
              <a href="tel:+525512345678" className="text-lila-600 font-medium hover:text-lila-700">
                Contáctanos por WhatsApp
              </a>
            </div>
          </motion.div>
        )}

        {/* Empty state (no search done) */}
        {!order && !notFound && (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">Ingresa tu folio para ver el estado de tu pedido</p>
          </div>
        )}
      </div>
    </div>
  );
}
