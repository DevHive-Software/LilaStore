'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, ChevronDown, X, Eye, Image as ImageIcon,
  Clock, Filter,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor, cn } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import type { Order, OrderStatus } from '@/types';
import { useRouter } from 'next/navigation';

const ALL_STATUSES: OrderStatus[] = [
  'pendiente_pago',
  'comprobante_enviado',
  'pago_en_revision',
  'pago_aprobado',
  'pago_rechazado',
  'preparando_pedido',
  'enviado',
  'entregado',
  'cancelado',
];

export default function AdminPedidosPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { addToast, addNotification } = useNotificationStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [proofModal, setProofModal] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    const all = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    setOrders(all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/admin'); return; }
    loadOrders();
  }, [isAuthenticated, router, loadOrders]);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    const all = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = all.map((o) => {
      if (o.id !== orderId) return o;
      const updatedOrder: Order = {
        ...o,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...o.statusHistory,
          { status: newStatus, date: new Date().toISOString() },
        ],
      };
      return updatedOrder;
    });
    storage.set(STORAGE_KEYS.ORDERS, updated);
    setOrders(updated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    const order = updated.find((o) => o.id === orderId)!;
    addToast('success', 'Estado actualizado', `Pedido ${order.folio} → ${getOrderStatusLabel(newStatus)}`);
    addNotification('info', 'Estado de pedido actualizado', `El pedido ${order.folio} cambió a: ${getOrderStatusLabel(newStatus)}`);

    if (selectedOrder?.id === orderId) setSelectedOrder(order);
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.folio.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-sm text-gray-500 mt-0.5">{orders.length} pedidos en total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por folio, cliente o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent bg-white"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
            className="pl-8 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 bg-white text-gray-700 appearance-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron pedidos</p>
            <p className="text-gray-400 text-sm mt-1">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Folio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="font-mono font-semibold text-lila-700 text-xs">{order.folio}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-medium text-gray-900 text-sm">{order.customer.fullName}</p>
                      <p className="text-xs text-gray-400">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-400">{order.deliveryMethod === 'domicilio' ? 'A domicilio' : 'En tienda'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          className={cn(
                            'text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer focus:outline-none focus:ring-1 focus:ring-lila-400',
                            getOrderStatusColor(order.status)
                          )}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
                          ))}
                        </select>
                        {order.paymentProof && (
                          <button
                            onClick={() => setProofModal(order.paymentProof!)}
                            className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver comprobante"
                          >
                            <ImageIcon size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-gray-400 hover:text-lila-600 hover:bg-lila-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <p className="font-bold text-gray-900 text-lg">{selectedOrder.folio}</p>
                  <p className="text-xs text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Estado del pedido</p>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      className={cn(
                        'text-sm font-medium px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-lila-400',
                        getOrderStatusColor(selectedOrder.status)
                      )}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Datos del cliente</p>
                  <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-gray-400 text-xs">Nombre</p><p className="font-medium text-gray-900">{selectedOrder.customer.fullName}</p></div>
                    <div><p className="text-gray-400 text-xs">Teléfono</p><p className="font-medium text-gray-900">{selectedOrder.customer.phone}</p></div>
                    <div><p className="text-gray-400 text-xs">Email</p><p className="font-medium text-gray-900">{selectedOrder.customer.email}</p></div>
                    <div><p className="text-gray-400 text-xs">Ciudad</p><p className="font-medium text-gray-900">{selectedOrder.customer.city}, {selectedOrder.customer.state}</p></div>
                    {selectedOrder.deliveryMethod === 'domicilio' && (
                      <div className="col-span-2">
                        <p className="text-gray-400 text-xs">Dirección</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer.address}</p>
                        {selectedOrder.customer.references && (
                          <p className="text-gray-500 text-xs mt-0.5">Ref: {selectedOrder.customer.references}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Productos</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-lila-100 shrink-0">
                          {item.product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-lila-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">
                            Talla: {item.selectedSize} · Color: {item.selectedColor} · Cant: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío {selectedOrder.deliveryMethod === 'tienda' ? '(Recolección)' : ''}</span>
                    <span>{selectedOrder.shipping === 0 ? 'Gratis' : formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-lila-700">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Payment proof */}
                {selectedOrder.paymentProof && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Comprobante de pago</p>
                    <button
                      onClick={() => setProofModal(selectedOrder.paymentProof!)}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <ImageIcon size={16} />
                      Ver comprobante
                    </button>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Historial</p>
                  <div className="space-y-3">
                    {selectedOrder.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-lila-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getOrderStatusLabel(h.status)}</p>
                          <p className="text-xs text-gray-400">{formatDate(h.date)}</p>
                          {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proof Modal */}
      <AnimatePresence>
        {proofModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setProofModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setProofModal(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofModal}
                alt="Comprobante de pago"
                className="w-full rounded-2xl shadow-2xl max-h-[80vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
