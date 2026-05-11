'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const allProducts = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const featured = allProducts.filter((p) => p.featured && p.active).slice(0, 4);
    setProducts(featured);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-lila-500 font-semibold text-sm uppercase tracking-wider">
              Lo más destacado
            </span>
            <h2 className="section-title mt-1">Productos Destacados</h2>
            <p className="section-subtitle">
              Selección cuidadosa de nuestras mejores piezas
            </p>
          </div>
          <Link
            href="/catalogo"
            className="hidden sm:inline-flex items-center gap-2 text-lila-600 font-semibold hover:text-lila-700 transition-colors group"
          >
            Ver todos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/catalogo" className="btn-secondary inline-flex items-center gap-2">
            Ver todos los productos
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
