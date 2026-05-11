'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, Package, ToggleLeft,
  ToggleRight, Star, StarOff, AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice, getOrderStatusColor, cn } from '@/lib/utils';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product, ProductCategory } from '@/types';
import { useRouter } from 'next/navigation';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ropa: 'Ropa',
  accesorios: 'Accesorios',
  calzado: 'Calzado',
  bolsas: 'Bolsas',
  promociones: 'Promociones',
};

export default function AdminProductosPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { addToast, addNotification } = useNotificationStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<ProductCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
    setProducts(storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/admin'); return; }
    loadProducts();
  }, [isAuthenticated, router, loadProducts]);

  const saveProducts = (updated: Product[]) => {
    storage.set(STORAGE_KEYS.PRODUCTS, updated);
    setProducts(updated);
  };

  const handleSave = (product: Product) => {
    const existing = products.find((p) => p.id === product.id);
    let updated: Product[];
    if (existing) {
      updated = products.map((p) => (p.id === product.id ? product : p));
      addToast('success', 'Producto actualizado', `"${product.name}" fue actualizado.`);
      addNotification('success', 'Producto actualizado', `Se actualizó "${product.name}".`);
    } else {
      updated = [product, ...products];
      addToast('success', 'Producto creado', `"${product.name}" fue agregado al catálogo.`);
      addNotification('success', 'Producto creado', `Se agregó "${product.name}" al catálogo.`);
    }
    saveProducts(updated);
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    const p = products.find((p) => p.id === id);
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setConfirmDelete(null);
    addToast('info', 'Producto eliminado', `"${p?.name}" fue eliminado.`);
  };

  const toggleActive = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
    saveProducts(updated);
  };

  const toggleFeatured = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    saveProducts(updated);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} productos en total</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} />
          Nuevo producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent bg-white"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value as ProductCategory | 'all')}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 bg-white text-gray-700"
        >
          <option value="all">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron productos</p>
            <p className="text-gray-400 text-sm mt-1">Intenta ajustar los filtros o crea un nuevo producto</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Estado</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Destacado</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-lila-50">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-lila-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 hidden sm:block">{product.description.slice(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="bg-lila-50 text-lila-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs font-bold px-2 py-0.5 rounded-full border',
                          product.stock === 0
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : product.stock <= 5
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-green-100 text-green-700 border-green-200'
                        )}
                      >
                        {product.stock === 0 ? 'Agotado' : `${product.stock} pzas`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <button onClick={() => toggleActive(product.id)} title="Activar/Desactivar">
                        {product.active ? (
                          <ToggleRight size={24} className="text-lila-500 mx-auto" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <button onClick={() => toggleFeatured(product.id)} title="Destacar/No destacar">
                        {product.featured ? (
                          <Star size={18} className="text-yellow-500 fill-yellow-500 mx-auto" />
                        ) : (
                          <StarOff size={18} className="text-gray-300 mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingProduct(product); setShowForm(true); }}
                          className="p-1.5 text-gray-400 hover:text-lila-600 hover:bg-lila-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingProduct(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-center text-lg">¿Eliminar producto?</h3>
              <p className="text-gray-500 text-sm text-center mt-2">
                Esta acción no se puede deshacer. El producto será eliminado permanentemente.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
