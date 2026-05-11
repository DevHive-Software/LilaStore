'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Package, MapPin, Phone, Mail, Edit2, Save,
  LogOut, ShoppingBag, Clock, ChevronRight, X, Eye,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor, cn } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import type { Order } from '@/types';

type Tab = 'pedidos' | 'perfil';

export default function MiCuentaPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout, updateProfile } = useUserStore();
  const { addToast } = useNotificationStore();

  const [tab, setTab] = useState<Tab>('pedidos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '' });

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (currentUser) {
      setForm({
        name: currentUser.name,
        phone: currentUser.phone ?? '',
        address: currentUser.address ?? '',
        city: currentUser.city ?? '',
        state: currentUser.state ?? '',
      });
    }
    // Load orders for this user's email
    const all = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    const mine = all
      .filter((o) => o.customer.email.toLowerCase() === currentUser?.email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(mine);
  }, [isAuthenticated, currentUser, router]);

  const handleSaveProfile = () => {
    updateProfile({ name: form.name, phone: form.phone, address: form.address, city: form.city, state: form.state });
    addToast('success', 'Perfil actualizado', 'Tus datos fueron guardados correctamente');
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    addToast('info', 'Sesión cerrada', 'Has cerrado sesión exitosamente');
    router.push('/');
  };

  if (!isAuthenticated || !currentUser) return null;

  const avatarLetter = currentUser.name.charAt(0).toUpperCase();
  const pending = orders.filter((o) => ['pendiente_pago', 'comprobante_enviado', 'pago_en_revision', 'pago_aprobado', 'preparando_pedido', 'enviado'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-lila-800 via-lila-700 to-lila-500 pt-20 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-18 h-18 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl flex items-center justify-center text-white font-black text-3xl w-20 h-20 shrink-0"
            >
              {avatarLetter}
            </motion.div>
            <div>
              <p className="text-lila-200 text-sm font-medium">Mi cuenta</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.name}</h1>
              <p className="text-white/70 text-sm mt-0.5">{currentUser.email}</p>
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold px-3 py-1 rounded-full mt-2">
                <ShoppingBag size={11} />
                Comprador
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { label: 'Total pedidos', value: orders.length },
              { label: 'En proceso', value: pending },
              { label: 'Entregados', value: orders.filter((o) => o.status === 'entregado').length },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 pb-16">
        {/* Tab bar */}
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-6">
          {([['pedidos', Package, 'Mis Pedidos'], ['perfil', User, 'Mi Perfil']] as const).map(([t, Icon, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                tab === t ? 'bg-lila-600 text-white shadow-sm' : 'text-gray-500 hover:text-lila-600'
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        <AnimatePresence mode="wait">
          {tab === 'pedidos' && (
            <motion.div key="pedidos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
                  <div className="w-16 h-16 bg-lila-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package size={28} className="text-lila-400" />
                  </div>
                  <p className="font-semibold text-gray-700 text-lg">Aún no tienes pedidos</p>
                  <p className="text-gray-400 text-sm mt-2">Cuando realices una compra, aparecerá aquí</p>
                  <Link href="/catalogo"
                    className="inline-flex items-center gap-2 mt-5 bg-lila-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-lila-700 transition-colors">
                    <ShoppingBag size={15} />
                    Explorar catálogo
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <motion.div key={order.id} whileHover={{ y: -1 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="px-5 py-4 flex items-center gap-4">
                        <div className="w-11 h-11 bg-lila-50 rounded-xl flex items-center justify-center shrink-0">
                          <Package size={20} className="text-lila-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-mono font-bold text-lila-700 text-sm">{order.folio}</p>
                            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', getOrderStatusColor(order.status))}>
                              {getOrderStatusLabel(order.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.items.length} producto{order.items.length !== 1 ? 's' : ''} · {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                          <ChevronRight size={16} className="text-gray-300 ml-auto mt-0.5" />
                        </div>
                      </div>
                      {/* Mini product strip */}
                      <div className="px-5 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
                        {order.items.slice(0, 4).map((item, i) => (
                          <div key={i} className="w-9 h-9 rounded-lg overflow-hidden bg-lila-100 shrink-0">
                            {item.product.images[0]
                              ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-gradient-to-br from-lila-400 to-lila-600" />}
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <span className="text-gray-500 text-[10px] font-bold">+{order.items.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {tab === 'perfil' && (
            <motion.div key="perfil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Datos personales</h2>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                    editMode
                      ? 'bg-lila-600 text-white hover:bg-lila-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {editMode ? <><Save size={14} /> Guardar</> : <><Edit2 size={14} /> Editar</>}
                </button>
              </div>

              <div className="p-6 space-y-5">
                {[
                  { icon: User, label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Tu nombre' },
                  { icon: Mail, label: 'Correo electrónico', key: 'email', type: 'email', placeholder: '', disabled: true, value: currentUser.email },
                  { icon: Phone, label: 'Teléfono / WhatsApp', key: 'phone', type: 'tel', placeholder: '+52 55 1234 5678' },
                  { icon: MapPin, label: 'Dirección', key: 'address', type: 'text', placeholder: 'Calle y número' },
                  { icon: MapPin, label: 'Ciudad', key: 'city', type: 'text', placeholder: 'Tu ciudad' },
                  { icon: MapPin, label: 'Estado', key: 'state', type: 'text', placeholder: 'Tu estado' },
                ].map(({ icon: Icon, label, key, type, placeholder, disabled, value: fixedValue }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
                    <div className="relative">
                      <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      {disabled ? (
                        <div className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500">
                          {fixedValue}
                        </div>
                      ) : (
                        <input
                          type={type}
                          value={key in form ? form[key as keyof typeof form] : ''}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                          disabled={!editMode}
                          className={cn(
                            'w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all',
                            editMode
                              ? 'border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent'
                              : 'border-transparent bg-gray-50 text-gray-700'
                          )}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-3xl">
                <div>
                  <p className="font-bold text-gray-900">{selectedOrder.folio}</p>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', getOrderStatusColor(selectedOrder.status))}>
                    {getOrderStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Timeline */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Historial del pedido</p>
                  <div className="space-y-3">
                    {selectedOrder.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 shrink-0',
                          i === selectedOrder.statusHistory.length - 1 ? 'bg-lila-500' : 'bg-gray-300')} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{getOrderStatusLabel(h.status)}</p>
                          <p className="text-xs text-gray-400">{formatDate(h.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Productos</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-lila-100 shrink-0">
                          {item.product.images[0]
                            ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gradient-to-br from-lila-400 to-lila-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">T: {item.selectedSize} · C: {item.selectedColor} · x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-lila-50 border border-lila-100 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Envío</span><span>{selectedOrder.shipping === 0 ? 'Gratis' : formatPrice(selectedOrder.shipping)}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-lila-200">
                    <span>Total</span><span className="text-lila-700">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <Link href={`/pedido/${selectedOrder.folio}`}
                  className="flex items-center justify-center gap-2 bg-lila-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-lila-700 transition-colors">
                  <Eye size={15} />
                  Ver seguimiento completo
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
