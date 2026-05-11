'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Tag, ToggleLeft, ToggleRight, X, Save, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { generateId, cn } from '@/lib/utils';
import type { Category, ProductCategory } from '@/types';
import { useRouter } from 'next/navigation';

const CATEGORY_ICONS: Record<string, string> = {
  ropa: '👕',
  accesorios: '💍',
  calzado: '👟',
  bolsas: '👜',
  promociones: '🏷️',
};

const SLUG_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'ropa', label: 'Ropa' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'bolsas', label: 'Bolsas' },
  { value: 'promociones', label: 'Promociones' },
];

interface CategoryFormProps {
  category?: Category | null;
  onSave: (cat: Category) => void;
  onClose: () => void;
}

function CategoryForm({ category, onSave, onClose }: CategoryFormProps) {
  const [form, setForm] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? ('ropa' as ProductCategory),
    description: category?.description ?? '',
    active: category?.active ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'El nombre es requerido';
    if (!form.description.trim()) errs.description = 'La descripción es requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const cat: Category = {
      id: category?.id ?? generateId(),
      name: form.name.trim(),
      slug: form.slug,
      description: form.description.trim(),
      active: form.active,
    };
    onSave(cat);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Ropa de temporada"
              className={cn(
                'w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent',
                errors.name ? 'border-red-300' : 'border-gray-200'
              )}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo / Slug</label>
            <select
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value as ProductCategory }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 bg-white"
            >
              {SLUG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {CATEGORY_ICONS[opt.value]} {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">El slug determina cómo se filtra esta categoría en el catálogo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Breve descripción de la categoría..."
              rows={3}
              className={cn(
                'w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-500 focus:border-transparent resize-none',
                errors.description ? 'border-red-300' : 'border-gray-200'
              )}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-700">Categoría activa</p>
              <p className="text-xs text-gray-400">Visible en el catálogo y tienda</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className="focus:outline-none"
            >
              {form.active ? (
                <ToggleRight size={28} className="text-lila-500" />
              ) : (
                <ToggleLeft size={28} className="text-gray-300" />
              )}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Save size={15} />
              {category ? 'Actualizar' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ---------- PAGE ---------- */
export default function AdminCategoriasPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { addToast, addNotification } = useNotificationStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadCategories = useCallback(() => {
    setCategories(storage.get<Category[]>(STORAGE_KEYS.CATEGORIES, []));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/admin'); return; }
    loadCategories();
  }, [isAuthenticated, router, loadCategories]);

  const saveCategories = (updated: Category[]) => {
    storage.set(STORAGE_KEYS.CATEGORIES, updated);
    setCategories(updated);
  };

  const handleSave = (cat: Category) => {
    const existing = categories.find((c) => c.id === cat.id);
    let updated: Category[];
    if (existing) {
      updated = categories.map((c) => (c.id === cat.id ? cat : c));
      addToast('success', 'Categoría actualizada', `"${cat.name}" fue actualizada.`);
    } else {
      updated = [...categories, cat];
      addToast('success', 'Categoría creada', `"${cat.name}" fue creada.`);
      addNotification('success', 'Nueva categoría', `Se creó la categoría "${cat.name}".`);
    }
    saveCategories(updated);
    setShowForm(false);
    setEditingCat(null);
  };

  const handleDelete = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
    setConfirmDelete(null);
    addToast('info', 'Categoría eliminada', `"${cat?.name}" fue eliminada.`);
  };

  const toggleActive = (id: string) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    saveCategories(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categorías configuradas</p>
        </div>
        <button
          onClick={() => { setEditingCat(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-lila-600 hover:bg-lila-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} />
          Nueva categoría
        </button>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <Tag size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay categorías</p>
          <p className="text-gray-400 text-sm mt-1">Crea tu primera categoría para organizar los productos</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 bg-lila-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-lila-700 transition-colors"
          >
            <Plus size={14} />
            Crear categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'bg-white rounded-2xl shadow-sm border overflow-hidden transition-all',
                cat.active ? 'border-gray-100' : 'border-gray-100 opacity-60'
              )}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lila-50 rounded-xl flex items-center justify-center text-xl">
                      {CATEGORY_ICONS[cat.slug] ?? '📦'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                      <span className="text-xs text-lila-600 font-mono bg-lila-50 px-1.5 py-0.5 rounded">
                        {cat.slug}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActive(cat.id)}
                    title="Activar/desactivar"
                    className="shrink-0"
                  >
                    {cat.active ? (
                      <ToggleRight size={24} className="text-lila-500" />
                    ) : (
                      <ToggleLeft size={24} className="text-gray-300" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>
              </div>
              <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between bg-gray-50/50">
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    cat.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {cat.active ? 'Activa' : 'Inactiva'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditingCat(cat); setShowForm(true); }}
                    className="p-1.5 text-gray-400 hover:text-lila-600 hover:bg-lila-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(cat.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CategoryForm
            category={editingCat}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingCat(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
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
              <h3 className="font-bold text-gray-900 text-center text-lg">¿Eliminar categoría?</h3>
              <p className="text-gray-500 text-sm text-center mt-2">
                Los productos de esta categoría no serán eliminados, pero pueden quedar sin categoría asignada.
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
