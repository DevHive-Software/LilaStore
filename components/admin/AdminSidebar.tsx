'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  LogOut,
  Store,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, adminEmail } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const unread = getUnreadCount();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-lila-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-white">LilaStore</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Panel de administración</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
                active
                  ? 'bg-lila-600 text-white shadow-lg shadow-lila-900/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <item.icon size={18} />
              {item.label}
              {item.label === 'Pedidos' && unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Notifications indicator */}
      {unread > 0 && (
        <div className="mx-3 mb-3 px-3 py-2.5 bg-lila-900/50 rounded-xl border border-lila-700/50">
          <div className="flex items-center gap-2 text-lila-300 text-xs">
            <Bell size={14} className="animate-pulse" />
            <span>{unread} notificación{unread !== 1 ? 'es' : ''} sin leer</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-sm"
        >
          <Store size={16} />
          Ver tienda
        </Link>
        <div className="px-3 py-2 rounded-xl bg-gray-800">
          <p className="text-gray-400 text-xs truncate">{adminEmail}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all text-sm"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
