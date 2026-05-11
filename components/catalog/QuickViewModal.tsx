'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCartStore();
  const { addToast } = useNotificationStore();

  if (!product) return null;

  const defaultSize = product.sizes.find((s) => s.available)?.label || '';
  const activeSize = selectedSize || defaultSize;
  const activeColor = selectedColor || product.colors[0]?.name || '';

  const handleAddToCart = () => {
    if (!activeSize) {
      addToast('warning', 'Selecciona una talla', 'Por favor elige una talla antes de agregar');
      return;
    }
    setIsAdding(true);
    addItem(product, quantity, activeSize, activeColor);
    addToast('success', '¡Producto agregado!', `${product.name} en tu carrito`);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 800);
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
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative bg-gray-50 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={product.images[currentImage] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : product.images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-lg text-gray-700 hover:bg-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentImage((p) => (p < product.images.length - 1 ? p + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-lg text-gray-700 hover:bg-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col gap-4">
              <div>
                <span className="text-xs text-lila-500 font-semibold uppercase tracking-wider capitalize">
                  {product.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h2>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{product.description}</p>

              {/* Sizes */}
              {product.sizes.filter((s) => s.label !== 'Único').length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Talla</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => size.available && setSelectedSize(size.label)}
                        disabled={!size.available}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                          !size.available && 'opacity-40 cursor-not-allowed line-through border-gray-200 text-gray-400',
                          size.available && activeSize === size.label
                            ? 'bg-lila-500 text-white border-lila-500'
                            : size.available && 'border-gray-200 text-gray-700 hover:border-lila-300'
                        )}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Color: <span className="font-normal text-gray-500">{activeColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={cn(
                        'w-7 h-7 rounded-full border-2 transition-all',
                        activeColor === color.name ? 'border-lila-500 scale-110' : 'border-transparent hover:border-gray-300'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-gray-700">Cantidad</p>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 font-semibold text-gray-900 min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">{product.stock} disponibles</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-2">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all',
                    product.stock === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isAdding
                      ? 'bg-green-500 text-white'
                      : 'bg-lila-500 hover:bg-lila-600 text-white'
                  )}
                >
                  <ShoppingCart size={18} />
                  {product.stock === 0 ? 'Agotado' : isAdding ? '¡Agregado!' : 'Agregar al carrito'}
                </motion.button>
                <Link
                  href={`/producto/${product.id}`}
                  onClick={onClose}
                  className="p-3 border border-gray-200 rounded-xl text-gray-500 hover:text-lila-600 hover:border-lila-200 transition-all"
                >
                  <ExternalLink size={18} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
