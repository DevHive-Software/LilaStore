'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { getItemCount, openCart } = useCartStore();
  const { isAuthenticated, currentUser } = useUserStore();
  const itemCount = getItemCount();

  if (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/registro')) return null;

  const accountHref = isAuthenticated
    ? currentUser?.role === 'vendedor' ? '/vendedor' : '/mi-cuenta'
    : '/login';

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/catalogo', icon: Grid, label: 'Catálogo' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all min-w-[60px]',
                isActive ? 'text-lila-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-xl transition-all',
                  isActive ? 'bg-lila-100' : ''
                )}
              >
                <item.icon size={20} className={cn('transition-all', isActive && 'stroke-[2.5px]')} />
              </motion.div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart */}
        <button
          onClick={openCart}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all text-gray-400 hover:text-gray-600 relative min-w-[60px]"
          aria-label="Carrito"
        >
          <motion.div whileTap={{ scale: 0.88 }} className="w-9 h-9 flex items-center justify-center rounded-xl relative">
            <ShoppingBag size={20} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-lila-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <span className="text-[10px] font-semibold">Carrito</span>
        </button>

        {/* Account */}
        <Link
          href={accountHref}
          className={cn(
            'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all min-w-[60px]',
            (pathname.startsWith('/mi-cuenta') || pathname.startsWith('/vendedor'))
              ? 'text-lila-600'
              : 'text-gray-400 hover:text-gray-600'
          )}
        >
          <motion.div
            whileTap={{ scale: 0.88 }}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-xl transition-all relative',
              (pathname.startsWith('/mi-cuenta') || pathname.startsWith('/vendedor')) ? 'bg-lila-100' : ''
            )}
          >
            {isAuthenticated && currentUser ? (
              <div className="w-7 h-7 bg-lila-500 rounded-lg flex items-center justify-center text-white text-xs font-black">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User size={20} />
            )}
          </motion.div>
          <span className="text-[10px] font-semibold">
            {isAuthenticated ? 'Cuenta' : 'Acceder'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
