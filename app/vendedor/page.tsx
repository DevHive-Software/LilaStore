'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package, TrendingUp, ShoppingBag, DollarSign, Plus, Edit2,
  Trash2, ToggleLeft, ToggleRight, Star, StarOff, LogOut,
  Settings, Store, ArrowRight, AlertTriangle, X, Save,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice, getOrderStatusLabel, getOrderStatusColor, generateId, cn } from '@/lib/utils';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Order, Product, SellerProfile } from '@/types';
import { AnimatePresence as AP } from 'framer-motion';

type Tab = 'dashboard' | 'productos' | 'pedidos' | 'tienda';

function StatCard({ icon: Icon, label, value, color, sub }: {
  icon: React.ElementType; label: string; value: string | number; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', color)}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

export default function VendedorPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout, getSellerProfile, updateSellerProfile } = useUserStore();
  const { addToast, addNotification } = useNotificationStore();

  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingStore, setEditingStore] = useState(false);
  const [storeForm, setStoreForm] = useState({ storeName: '', storeDescription: '' });

  useEffect(() => {
    if (!isAuthenticated || !currentUser) { router.replace('/login?rol=vendedor'); return; }
    if (currentUser.role !== 'vendedor') { router.replace('/mi-cuenta'); return; }
    loadData();
  }, [isAuthenticated, currentUser, router]);

  const loadData = () => {
    if (!currentUser) return;
    const allProducts = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    // A seller can see and manage all products (single-store demo)
    setProducts(allProducts);
    const allOrders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    const p = getSellerProfile(currentUser.id);
    setProfile(p);
    if (p) setStoreForm({ storeName: p.storeName, storeDescription: p.storeDescription });
  };

  const saveProducts = (updated: Product[]) => {
    storage.set(STORAGE_KEYS.PRODUCTS, updated);
    setProducts(updated);
  };

  const handleSaveProduct = (product: Product) => {
    const exists = products.find((p) => p.id === product.id);
    let updated: Product[];
    if (exists) {
      updated = products.map((p) => (p.id === product.id ? product : p));
      addToast('success', 'Producto actualizado', `"${product.name}" fue actualizado`);
    } else {
      updated = [product, ...products];
      addToast('success', 'Producto creado', `"${product.name}" fue agregado`);
      addNotification('success', 'Nuevo producto', `Se creó el producto "${product.name}"`);
    }
    saveProducts(updated);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    const p = products.find((p) => p.id === id);
    saveProducts(products.filter((p) => p.id !== id));
    setConfirmDelete(null);
    addToast('info', 'Eliminado', `"${p?.name}" fue eliminado`);
  };

  const toggleActive = (id: string) => saveProducts(products.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const toggleFeatured = (id: string) => saveProducts(products.map((p) => p.id === id ? { ...p, featured: !p.featured } : p));

  const handleSaveStore = () => {
    if (!currentUser) return;
    updateSellerProfile(currentUser.id, storeForm);
    setProfile((p) => p ? { ...p, ...storeForm } : p);
    addToast('success', 'Tienda actualizada', 'La información de tu tienda fue guardada');
    setEditingStore(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !currentUser) return null;

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => ['comprobante_enviado', 'pago_en_revision'].includes(o.status)).length;

  const TABS = [
    { key: 'dashboard', label: 'Inicio', icon: TrendingUp },
    { key: 'productos', label: 'Productos', icon: Package },
    { key: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
    { key: 'tienda', label: 'Mi Tienda', icon: Store },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-lila-900 via-lila-800 to-lila-600 pt-20 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 right-0 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 -left-12 w-48 h-48 bg-white/5 rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lila-300 text-xs font-medium">Panel de vendedor</p>
                <h1 className="text-xl sm:text-2xl font-black text-white">{profile?.storeName ?? `Tienda de ${currentUser.name}`}</h1>
                <p className="text-white/60 text-xs mt-0.5">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/" className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-colors" title="Ver tienda">
                <Store size={18} />
              </Link>
              <button onClick={handleLogout} className="p-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-xl transition-colors" title="Salir">
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: 'Productos', value: products.length, icon: '📦' },
              { label: 'Pedidos', value: orders.length, icon: '🛍️' },
              { label: 'Por revisar', value: pendingOrders, icon: '⏳' },
              { label: 'Ingresos', value: formatPrice(totalRevenue), icon: '💰' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-lg mb-1">{s.icon}</p>
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 pb-20">
        {/* Tab bar */}
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap px-2',
                tab === key ? 'bg-lila-600 text-white shadow-sm' : 'text-gray-500 hover:text-lila-600'
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard icon={Package} label="Productos activos" value={products.filter((p) => p.active).length} color="bg-lila-500" sub={`${products.filter((p) => p.stock === 0).length} agotados`} />
                <StatCard icon={DollarSign} label="Ingresos totales" value={formatPrice(totalRevenue)} color="bg-green-500" sub={`${orders.length} pedidos`} />
                <StatCard icon={ShoppingBag} label="Pendientes de revisión" value={pendingOrders} color="bg-orange-500" sub="Comprobantes recibidos" />
                <StatCard icon={AlertTriangle} label="Stock bajo" value={products.filter((p) => p.stock > 0 && p.stock <= 5).length} color="bg-red-500" sub="5 pzas o menos" />
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Últimos pedidos</h2>
                  <button onClick={() => setTab('pedidos')} className="text-xs text-lila-600 font-medium flex items-center gap-1 hover:text-lila-700">
                    Ver todos <ArrowRight size={12} />
                  </button>
                </div>
                {orders.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">Aún no hay pedidos</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="px-6 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs font-bold text-lila-700">{o.folio}</p>
                          <p className="text-xs text-gray-500 truncate">{o.customer.fullName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900">{formatPrice(o.total)}</p>
                          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', getOrderStatusColor(o.status))}>
                            {getOrderStatusLabel(o.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PRODUCTS */}
          {tab === 'productos' && (
            <motion.div key="productos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{products.length} productos</p>
                <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                  className="flex items-center gap-2 bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
                  <Plus size={15} /> Agregar producto
                </button>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                  <Package size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Sin productos aún</p>
                  <button onClick={() => setShowProductForm(true)}
                    className="mt-4 inline-flex items-center gap-2 bg-lila-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-lila-700 transition-colors">
                    <Plus size={14} /> Crear primer producto
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((p) => (
                    <motion.div key={p.id} whileHover={{ y: -1 }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="flex gap-3 p-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-lila-50 shrink-0">
                          {p.images[0]
                            ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gradient-to-br from-lila-400 to-lila-600 flex items-center justify-center text-white font-bold">{p.name.charAt(0)}</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                          <p className="text-lila-600 font-bold text-base">{formatPrice(p.price)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border',
                              p.stock === 0 ? 'bg-red-100 text-red-700 border-red-200' :
                                p.stock <= 5 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                  'bg-green-100 text-green-700 border-green-200')}>
                              {p.stock === 0 ? 'Agotado' : `${p.stock} pzas`}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button onClick={() => toggleActive(p.id)} title="Activar/desactivar">
                            {p.active ? <ToggleRight size={22} className="text-lila-500" /> : <ToggleLeft size={22} className="text-gray-300" />}
                          </button>
                          <button onClick={() => toggleFeatured(p.id)} title="Destacar">
                            {p.featured ? <Star size={16} className="text-yellow-500 fill-yellow-500" /> : <StarOff size={16} className="text-gray-300" />}
                          </button>
                        </div>
                      </div>
                      <div className="border-t border-gray-50 px-4 py-2.5 flex gap-2">
                        <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-lila-700 bg-lila-50 hover:bg-lila-100 py-2 rounded-xl transition-colors">
                          <Edit2 size={12} /> Editar
                        </button>
                        <button onClick={() => setConfirmDelete(p.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-xl transition-colors">
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ORDERS */}
          {tab === 'pedidos' && (
            <motion.div key="pedidos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                  <ShoppingBag size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aún no hay pedidos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="px-5 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-mono font-bold text-lila-700 text-sm">{o.folio}</p>
                            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', getOrderStatusColor(o.status))}>
                              {getOrderStatusLabel(o.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{o.customer.fullName} · {o.customer.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-900">{formatPrice(o.total)}</p>
                          <p className="text-xs text-gray-400">{o.items.length} producto{o.items.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STORE SETTINGS */}
          {tab === 'tienda' && (
            <motion.div key="tienda" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lila-50 rounded-xl flex items-center justify-center">
                      <Store size={20} className="text-lila-600" />
                    </div>
                    <h2 className="font-bold text-gray-900">Configuración de tienda</h2>
                  </div>
                  <button onClick={() => editingStore ? handleSaveStore() : setEditingStore(true)}
                    className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                      editingStore ? 'bg-lila-600 text-white hover:bg-lila-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
                    {editingStore ? <><Save size={14} /> Guardar</> : <><Edit2 size={14} /> Editar</>}
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre de tu tienda</label>
                    <input type="text" value={storeForm.storeName} onChange={(e) => setStoreForm((f) => ({ ...f, storeName: e.target.value }))}
                      disabled={!editingStore}
                      className={cn('w-full px-4 py-3 border rounded-xl text-sm transition-all',
                        editingStore ? 'border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-lila-400' : 'border-transparent bg-gray-50 text-gray-700')} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descripción</label>
                    <textarea value={storeForm.storeDescription} onChange={(e) => setStoreForm((f) => ({ ...f, storeDescription: e.target.value }))}
                      disabled={!editingStore} rows={3}
                      className={cn('w-full px-4 py-3 border rounded-xl text-sm transition-all resize-none',
                        editingStore ? 'border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-lila-400' : 'border-transparent bg-gray-50 text-gray-700')} />
                  </div>
                  <div className="bg-lila-50 border border-lila-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-lila-700 mb-1">Datos del vendedor</p>
                    <p className="text-sm text-lila-800 font-medium">{currentUser.name}</p>
                    <p className="text-xs text-lila-600">{currentUser.email}</p>
                    {currentUser.phone && <p className="text-xs text-lila-600">{currentUser.phone}</p>}
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors">
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product form modal */}
      <AnimatePresence>
        {showProductForm && (
          <ProductForm product={editingProduct} onSave={handleSaveProduct} onClose={() => { setShowProductForm(false); setEditingProduct(null); }} />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-center text-lg">¿Eliminar producto?</h3>
              <p className="text-gray-500 text-sm text-center mt-2">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={() => handleDeleteProduct(confirmDelete)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
