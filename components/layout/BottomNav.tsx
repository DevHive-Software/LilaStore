'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Grid, ShoppingBag, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/catalogo', icon: Grid, label: 'Catálogo' },
    { href: '/catalogo', icon: Search, label: 'Buscar' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px]',
                isActive ? 'text-lila-600' : 'text-gray-400'
              )}
            >
              <item.icon
                size={22}
                className={cn(
                  'transition-all',
                  isActive && 'stroke-[2.5px]'
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart button */}
        <button
          onClick={openCart}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-gray-400 relative min-w-[64px]"
          aria-label="Carrito"
        >
          <div className="relative">
            <ShoppingBag size={22} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-lila-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-xs font-medium">Carrito</span>
        </button>
      </div>
    </nav>
  );
}
