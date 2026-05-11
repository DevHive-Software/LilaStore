'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  const { addToast } = useNotificationStore();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const defaultSize = product.sizes.find((s) => s.available)?.label || '';
  const defaultColor = product.colors[0]?.name || '';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultSize) {
      addToast('warning', 'Sin talla', 'Este producto no tiene tallas disponibles');
      return;
    }

    setIsAdding(true);
    addItem(product, 1, defaultSize, defaultColor);
    addToast('success', '¡Agregado!', `${product.name} en tu carrito`);

    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="group relative card hover:shadow-md transition-all duration-300">
      {/* Image */}
      <Link href={`/producto/${product.id}`} className="block relative overflow-hidden bg-gray-50">
        <div className="relative aspect-square">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white text-xs font-bold">-{discount}%</span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge bg-orange-100 text-orange-700 text-xs">Poco stock</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-100 text-gray-500 text-xs">Agotado</span>
          )}
          {product.featured && (
            <span className="badge bg-lila-100 text-lila-700 text-xs">
              <Star size={10} className="mr-0.5" /> Destacado
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        {onQuickView && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex items-center gap-2 bg-white text-gray-800 font-semibold px-4 py-2 rounded-xl shadow-lg hover:bg-lila-50 transition-colors text-sm"
            >
              <Eye size={16} />
              Vista rápida
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 md:p-4">
        <Link href={`/producto/${product.id}`}>
          <span className="text-xs text-lila-500 font-medium uppercase tracking-wider capitalize">
            {product.category}
          </span>
          <h3 className="font-semibold text-gray-900 text-sm md:text-base mt-0.5 leading-snug hover:text-lila-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-gray-900 text-base md:text-lg">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdding
                ? 'bg-green-500 text-white'
                : 'bg-lila-500 hover:bg-lila-600 text-white active:scale-95'
            )}
            whileTap={product.stock > 0 && !isAdding ? { scale: 0.95 } : {}}
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:block">
              {product.stock === 0 ? 'Agotado' : isAdding ? '¡Listo!' : 'Agregar'}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
