'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { CatalogFilters, FilterState } from '@/components/catalog/CatalogFilters';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import type { Product, ProductCategory } from '@/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('categoria') as ProductCategory) || 'todas';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: initialCategory as ProductCategory | 'todas',
    sort: 'newest',
    minPrice: 0,
    maxPrice: 2000,
    onlyAvailable: false,
  });

  useEffect(() => {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    setAllProducts(products.filter((p) => p.active));
    setLoading(false);
  }, []);

  // Update category from URL when it changes
  useEffect(() => {
    const cat = searchParams.get('categoria') as ProductCategory | null;
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
  }, [searchParams]);

  const filteredProducts = allProducts
    .filter((p) => {
      if (filters.category !== 'todas' && p.category !== filters.category) return false;
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !p.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.onlyAvailable && p.stock === 0) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-24 md:pt-28">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Catálogo</h1>
          <p className="text-gray-500 mt-1">Explora toda nuestra colección</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-6">
          <CatalogFilters
            filters={filters}
            onChange={setFilters}
            totalCount={filteredProducts.length}
          />
          <ProductGrid products={filteredProducts} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center"><div className="text-gray-400">Cargando catálogo...</div></div>}>
      <CatalogContent />
    </Suspense>
  );
}
