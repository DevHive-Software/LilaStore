'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, cn } from '@/lib/utils';
import type { CartItem } from '@/types';

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 py-4 border-b border-gray-100 last:border-0"
    >
      {/* Image */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
        <Image
          src={item.product.images[0] || '/placeholder.png'}
          alt={item.product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/producto/${item.product.id}`}
          className="font-semibold text-gray-900 text-sm hover:text-lila-600 transition-colors line-clamp-1"
        >
          {item.product.name}
        </Link>
        <div className="text-gray-400 text-xs mt-0.5 flex gap-2">
          {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
          {item.selectedColor && <span>· {item.selectedColor}</span>}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selectedSize,
                  item.selectedColor,
                  item.quantity - 1
                )
              }
              className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-500"
              aria-label="Disminuir"
            >
              <Minus size={12} />
            </button>
            <span className="px-2 py-1 text-sm font-semibold text-gray-900 min-w-[28px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selectedSize,
                  item.selectedColor,
                  item.quantity + 1
                )
              }
              disabled={item.quantity >= item.product.stock}
              className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-40"
              aria-label="Aumentar"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">
              {formatPrice(item.product.price * item.quantity)}
            </span>
            <button
              onClick={() =>
                removeItem(item.product.id, item.selectedSize, item.selectedColor)
              }
              className="p-1 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-lg transition-colors"
              aria-label="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, clearCart, getSubtotal, getShipping, getTotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-lila-600" />
                <h2 className="text-lg font-bold text-gray-900">Tu Carrito</h2>
                {items.length > 0 && (
                  <span className="bg-lila-100 text-lila-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 hover:bg-red-50 rounded-lg"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-24 h-24 bg-lila-50 rounded-full flex items-center justify-center">
                  <ShoppingBag size={36} className="text-lila-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tu carrito está vacío</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Agrega productos para comenzar tu compra
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="btn-primary"
                >
                  Explorar catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-5 scrollbar-hide">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItemRow
                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                        item={item}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-gray-50">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Envío estimado</span>
                    <span
                      className={cn(
                        'font-medium',
                        shipping === 0 ? 'text-green-600' : 'text-gray-900'
                      )}
                    >
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </span>
                  </div>
                  {subtotal < 999 && (
                    <p className="text-xs text-gray-400">
                      Agrega {formatPrice(999 - subtotal)} más para envío gratis
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-lila-600">{formatPrice(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full bg-lila-500 hover:bg-lila-600 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-lila-500/30 active:scale-95 mt-2"
                  >
                    Proceder al checkout
                    <ArrowRight size={18} />
                  </Link>

                  <button
                    onClick={closeCart}
                    className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
                  >
                    Seguir comprando
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
