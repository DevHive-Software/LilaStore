'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Menu, X, Search, User, LogOut,
  Package, Store, ChevronDown, Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { getItemCount, openCart } = useCartStore();
  const { currentUser, isAuthenticated, logout } = useUserStore();
  const { addToast } = useNotificationStore();
  const itemCount = getItemCount();

  // Transparent header only on homepage hero
  const isHero = pathname === '/';
  const isTransparent = isHero && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('info', 'Sesión cerrada', 'Has cerrado sesión');
    setUserMenuOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo', label: 'Catálogo' },
  ];

  // Text/icon colors based on scroll + page
  const logoTextColor = isTransparent ? 'text-white' : 'text-lila-600';
  const navTextColor = isTransparent
    ? 'text-white/90 hover:text-white'
    : 'text-gray-700 hover:text-lila-600';
  const iconColor = isTransparent
    ? 'text-white/90 hover:text-white hover:bg-white/15'
    : 'text-gray-600 hover:text-lila-600 hover:bg-lila-50';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                isTransparent ? 'bg-white/25 border border-white/40' : 'bg-lila-500'
              )}
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="text-white font-bold text-sm">L</span>
            </motion.div>
            <span className={cn('text-xl font-bold transition-colors', logoTextColor)}>
              LilaStore
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-semibold transition-colors text-sm relative group',
                  navTextColor,
                  pathname === link.href && !isTransparent && 'text-lila-600'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-200',
                    isTransparent ? 'bg-white' : 'bg-lila-500',
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Link
              href="/catalogo"
              className={cn('hidden md:flex p-2 rounded-xl transition-all', iconColor)}
              aria-label="Buscar"
            >
              <Search size={20} />
            </Link>

            {/* Cart */}
            <motion.button
              onClick={openCart}
              className={cn('relative p-2 rounded-xl transition-all', iconColor)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Carrito"
            >
              <ShoppingBag size={22} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-lila-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User menu */}
            {isAuthenticated && currentUser ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-semibold text-sm',
                    isTransparent
                      ? 'text-white hover:bg-white/15 border border-white/30'
                      : 'text-gray-700 hover:bg-lila-50 border border-gray-200'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black',
                    isTransparent ? 'bg-white/25 text-white' : 'bg-lila-100 text-lila-700'
                  )}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={cn('transition-transform', userMenuOpen && 'rotate-180')} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 bg-lila-50 border-b border-lila-100">
                        <p className="font-bold text-gray-900 text-sm truncate">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        <span className={cn(
                          'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5',
                          currentUser.role === 'vendedor'
                            ? 'bg-lila-100 text-lila-700'
                            : 'bg-blue-100 text-blue-700'
                        )}>
                          {currentUser.role === 'vendedor' ? <Store size={9} /> : <ShoppingBag size={9} />}
                          {currentUser.role === 'vendedor' ? 'Vendedor' : 'Comprador'}
                        </span>
                      </div>
                      <div className="p-2">
                        {currentUser.role === 'comprador' && (
                          <Link href="/mi-cuenta" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-lila-50 hover:text-lila-700 rounded-xl transition-colors font-medium">
                            <Package size={16} className="text-lila-500" />
                            Mis pedidos
                          </Link>
                        )}
                        {currentUser.role === 'vendedor' && (
                          <Link href="/vendedor" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-lila-50 hover:text-lila-700 rounded-xl transition-colors font-medium">
                            <Store size={16} className="text-lila-500" />
                            Panel vendedor
                          </Link>
                        )}
                        <Link href={currentUser.role === 'vendedor' ? '/vendedor' : '/mi-cuenta'} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-lila-50 hover:text-lila-700 rounded-xl transition-colors font-medium">
                          <User size={16} className="text-lila-500" />
                          Mi perfil
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
                          <LogOut size={16} />
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login"
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                    isTransparent
                      ? 'text-white hover:bg-white/15 border border-white/30'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  Iniciar sesión
                </Link>
                <Link href="/registro"
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm',
                    isTransparent
                      ? 'bg-white text-lila-700 hover:bg-yellow-300 hover:text-lila-900'
                      : 'bg-lila-600 text-white hover:bg-lila-700'
                  )}
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn('md:hidden p-2 rounded-xl transition-all', iconColor)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl font-medium transition-all text-sm',
                    pathname === link.href
                      ? 'bg-lila-50 text-lila-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-lila-600'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-2 space-y-1">
                {isAuthenticated && currentUser ? (
                  <>
                    <div className="px-4 py-2 bg-lila-50 rounded-xl mb-2">
                      <p className="font-bold text-gray-900 text-sm">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.role === 'vendedor' ? 'Vendedor' : 'Comprador'}</p>
                    </div>
                    <Link href={currentUser.role === 'vendedor' ? '/vendedor' : '/mi-cuenta'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-lila-50 hover:text-lila-600 rounded-xl font-medium text-sm transition-all">
                      {currentUser.role === 'vendedor' ? <Store size={17} /> : <User size={17} />}
                      {currentUser.role === 'vendedor' ? 'Panel vendedor' : 'Mi cuenta'}
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-all">
                      <LogOut size={17} /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-lila-50 hover:text-lila-600 rounded-xl font-medium text-sm transition-all">
                      <User size={17} /> Iniciar sesión
                    </Link>
                    <Link href="/registro" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-lila-600 text-white rounded-xl font-semibold text-sm hover:bg-lila-700 transition-all">
                      <Sparkles size={17} /> Crear cuenta gratis
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
