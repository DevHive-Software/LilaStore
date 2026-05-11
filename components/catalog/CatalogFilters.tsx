'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types';

export interface FilterState {
  search: string;
  category: ProductCategory | 'todas';
  sort: 'newest' | 'price-asc' | 'price-desc' | 'name';
  minPrice: number;
  maxPrice: number;
  onlyAvailable: boolean;
}

interface CatalogFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
}

const categories: { value: ProductCategory | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'ropa', label: 'Ropa' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'bolsas', label: 'Bolsas' },
  { value: 'promociones', label: 'Promociones' },
];

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre A-Z' },
];

export function CatalogFilters({ filters, onChange, totalCount }: CatalogFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const hasActiveFilters =
    filters.category !== 'todas' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000 ||
    filters.onlyAvailable;

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="input-field pl-9 py-2.5"
          />
        </div>

        <select
          value={filters.sort}
          onChange={(e) => update({ sort: e.target.value as FilterState['sort'] })}
          className="input-field w-auto min-w-[180px] py-2.5 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all',
            showFilters || hasActiveFilters
              ? 'bg-lila-500 text-white border-lila-500'
              : 'bg-white text-gray-600 border-gray-200 hover:border-lila-300'
          )}
        >
          <Filter size={16} />
          Filtros
          {hasActiveFilters && (
            <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full">!</span>
          )}
          <ChevronDown size={14} className={cn('transition-transform', showFilters && 'rotate-180')} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => update({ category: cat.value })}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              filters.category === cat.value
                ? 'bg-lila-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-lila-50 hover:text-lila-700'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Precio mínimo
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => update({ minPrice: Number(e.target.value) })}
                  min={0}
                  max={filters.maxPrice}
                  placeholder="$0"
                  className="input-field py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Precio máximo
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => update({ maxPrice: Number(e.target.value) })}
                  min={filters.minPrice}
                  placeholder="$2000"
                  className="input-field py-2"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-xl border border-gray-200 w-full hover:border-lila-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.onlyAvailable}
                    onChange={(e) => update({ onlyAvailable: e.target.checked })}
                    className="w-4 h-4 accent-lila-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Solo disponibles</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count + clear filters */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{totalCount} producto{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}</span>
        {hasActiveFilters && (
          <button
            onClick={() => update({ category: 'todas', minPrice: 0, maxPrice: 2000, onlyAvailable: false })}
            className="flex items-center gap-1 text-lila-600 hover:text-lila-700 font-medium"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
