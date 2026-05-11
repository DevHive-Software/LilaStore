'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2, Save } from 'lucide-react';
import { generateId, cn } from '@/lib/utils';
import type { Product, ProductCategory, ProductSize, ProductColor } from '@/types';

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'ropa', label: 'Ropa' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'bolsas', label: 'Bolsas' },
  { value: 'promociones', label: 'Promociones' },
];

const DEFAULT_SIZES: ProductSize[] = [
  { label: 'XS', available: false },
  { label: 'S', available: true },
  { label: 'M', available: true },
  { label: 'L', available: true },
  { label: 'XL', available: false },
  { label: 'XXL', available: false },
];

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const isEditing = !!product;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    originalPrice: product?.originalPrice?.toString() ?? '',
    stock: product?.stock?.toString() ?? '',
    category: product?.category ?? ('ropa' as ProductCategory),
    active: product?.active ?? true,
    featured: product?.featured ?? false,
  });

  const [sizes, setSizes] = useState<ProductSize[]>(product?.sizes ?? DEFAULT_SIZES);
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors ?? [{ name: 'Lila', hex: '#7C3AED' }]
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#7C3AED');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'El nombre es requerido';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Precio inválido';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errs.stock = 'Stock inválido';
    if (!form.description.trim()) errs.description = 'La descripción es requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const saved: Product = {
      id: product?.id ?? generateId(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock),
      category: form.category,
      active: form.active,
      featured: form.featured,
      sizes,
      colors,
      images,
      createdAt: product?.createdAt ?? new Date().toISOString(),
    };

    onSave(saved);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Nombre *</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={cn('input-field', errors.name && 'border-red-300 focus:ring-red-200')}
                placeholder="Playera Oversize Lila"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Descripción *</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className={cn('input-field resize-none', errors.description && 'border-red-300 focus:ring-red-200')}
                placeholder="Describe el producto..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Price, Original Price, Stock */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Precio * (MXN)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className={cn('input-field', errors.price && 'border-red-300 focus:ring-red-200')}
                  placeholder="299"
                  min="0"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Precio original</label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) => update('originalPrice', e.target.value)}
                  className="input-field"
                  placeholder="399"
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Stock *</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => update('stock', e.target.value)}
                  className={cn('input-field', errors.stock && 'border-red-300 focus:ring-red-200')}
                  placeholder="20"
                  min="0"
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="input-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Sizes */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Tallas disponibles</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() =>
                      setSizes((prev) =>
                        prev.map((s) =>
                          s.label === size.label ? { ...s, available: !s.available } : s
                        )
                      )
                    }
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                      size.available
                        ? 'bg-lila-500 text-white border-lila-500'
                        : 'border-gray-200 text-gray-500 hover:border-lila-300'
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Colores</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }} />
                    <span className="text-sm text-gray-700">{color.name}</span>
                    <button
                      type="button"
                      onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Nombre del color"
                  className="input-field flex-1 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newColorName.trim()) {
                      setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
                      setNewColorName('');
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-lila-500 text-white rounded-xl text-sm font-medium hover:bg-lila-600 transition-colors"
                >
                  <Plus size={14} />
                  Agregar
                </button>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Imágenes</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-lila-300 hover:text-lila-500 transition-all"
                >
                  <Upload size={16} />
                  <span className="text-[10px] mt-1">Agregar</span>
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Flags */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => update('active', e.target.checked)}
                  className="w-4 h-4 accent-lila-500 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Producto activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => update('featured', e.target.checked)}
                  className="w-4 h-4 accent-lila-500 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Destacado</span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                Cancelar
              </button>
              <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save size={16} />
                {isEditing ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
