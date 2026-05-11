'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { SkeletonList } from '@/components/ui/SkeletonCard';
import { QuickViewModal } from './QuickViewModal';
import { useState } from 'react';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (loading) return <SkeletonList />;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-lila-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sin resultados</h3>
        <p className="text-gray-500 max-w-sm">
          No encontramos productos con los filtros seleccionados. Intenta con otras opciones.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <ProductCard product={product} onQuickView={setQuickViewProduct} />
          </motion.div>
        ))}
      </motion.div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
