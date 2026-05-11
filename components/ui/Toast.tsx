'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/lib/utils';
import type { NotificationType } from '@/types';

const icons: Record<NotificationType, React.ElementType> = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const styles: Record<NotificationType, { container: string; icon: string }> = {
  success: {
    container: 'bg-white border-green-200 shadow-green-100',
    icon: 'text-green-500',
  },
  info: {
    container: 'bg-white border-lila-200 shadow-lila-100',
    icon: 'text-lila-500',
  },
  warning: {
    container: 'bg-white border-orange-200 shadow-orange-100',
    icon: 'text-orange-500',
  },
  error: {
    container: 'bg-white border-red-200 shadow-red-100',
    icon: 'text-red-500',
  },
};

export function Toast() {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full sm:w-auto pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          const style = styles[toast.type];

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-md',
                style.container
              )}
            >
              <Icon size={20} className={cn('shrink-0 mt-0.5', style.icon)} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{toast.title}</p>
                {toast.message && (
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-0.5 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Cerrar"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
