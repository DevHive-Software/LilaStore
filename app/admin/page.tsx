'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Lock, Mail, ShoppingBag, Package,
  Clock, AlertTriangle, Bell, TrendingUp, CheckCircle,
  ArrowRight, RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';
import type { Order, Product, Notification } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ---------- LOGIN FORM ---------- */
function LoginForm() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(email, password);
    if (!ok) setError('Credenciales incorrectas. Intenta de nuevo.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lila-900 via-lila-700 to-lila-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-lila-700 to-lila-500 px-8 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-2xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-white">LilaStore Admin</h1>
          <p className="text-lila-200 text-sm mt-1">Panel de administración</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lilastore.demo"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lila-600 hover:bg-lila-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-lila-50 rounded-xl border border-lila-100">
            <p className="text-xs text-lila-700 font-medium mb-1">Credenciales demo:</p>
            <p className="text-xs text-lila-600">Email: admin@lilastore.demo</p>
            <p className="text-xs text-lila-600">Contraseña: admin123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- STAT CARD ---------- */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  href?: string;
}) {
  const content = (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4',
        href && 'cursor-pointer hover:shadow-md transition-all'
      )}
    >
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', color)}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      {href && <ArrowRight size={16} className="text-gray-300 ml-auto" />}
    </motion.div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

/* ---------- DASHBOARD ---------- */
function Dashboard() {
  const { notifications, markAllAsRead } = useNotificationStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setOrders(storage.get<Order[]>(STORAGE_KEYS.ORDERS, []));
    setProducts(storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []));
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'pendiente_pago').length;
  const proofOrders = orders.filter((o) => o.status === 'comprobante_enviado').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const unread = notifications.filter((n) => !n.read).length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentNotifications = notifications.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general de LilaStore</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Total pedidos"
          value={orders.length}
          color="bg-lila-500"
          href="/admin/pedidos"
        />
        <StatCard
          icon={Clock}
          label="Pendientes de pago"
          value={pendingOrders}
          color="bg-yellow-500"
          href="/admin/pedidos"
        />
        <StatCard
          icon={CheckCircle}
          label="Comprobantes por revisar"
          value={proofOrders}
          color="bg-blue-500"
          href="/admin/pedidos"
        />
        <StatCard
          icon={AlertTriangle}
          label="Stock bajo"
          value={lowStock}
          color="bg-red-500"
          href="/admin/productos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-lila-600" />
              <h2 className="font-semibold text-gray-900">Últimos pedidos</h2>
            </div>
            <Link
              href="/admin/pedidos"
              className="text-xs text-lila-600 hover:text-lila-700 font-medium flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              Aún no hay pedidos
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{order.folio}</p>
                    <p className="text-xs text-gray-500 truncate">{order.customer.fullName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', getOrderStatusColor(order.status))}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-lila-600" />
              <h2 className="font-semibold text-gray-900">Notificaciones</h2>
              {unread > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-lila-600 hover:text-lila-700 font-medium"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          {recentNotifications.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              No hay notificaciones
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentNotifications.map((notif) => (
                <NotifRow key={notif.id} notif={notif} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low stock */}
      {lowStock > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="font-semibold text-gray-900">Productos con stock bajo</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {products
              .filter((p) => p.stock > 0 && p.stock <= 5)
              .map((p) => (
                <div key={p.id} className="px-6 py-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                    {p.stock} en stock
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotifRow({ notif }: { notif: Notification }) {
  const { markAsRead } = useNotificationStore();
  const colors: Record<string, string> = {
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-orange-100 text-orange-700',
    error: 'bg-red-100 text-red-700',
  };
  return (
    <div
      className={cn(
        'px-6 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer',
        !notif.read && 'bg-lila-50/50'
      )}
      onClick={() => markAsRead(notif.id)}
    >
      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0', colors[notif.type])}>
        {notif.type.toUpperCase()}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
        <p className="text-xs text-gray-500 truncate">{notif.message}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(notif.createdAt)}</p>
      </div>
      {!notif.read && <div className="w-2 h-2 rounded-full bg-lila-500 shrink-0 mt-1.5" />}
    </div>
  );
}

/* ---------- PAGE ---------- */
export default function AdminPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <LoginForm />;
  return <Dashboard />;
}
