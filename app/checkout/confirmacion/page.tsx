'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import type { Order } from '@/types';

export default function ConfirmacionPage() {
  const [folio, setFolio] = useState('');

  useEffect(() => {
    // Try to get the last folio from orders
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    if (orders.length > 0) {
      setFolio(orders[0].folio);
    }
  }, []);

  const steps = [
    { icon: '📨', title: 'Comprobante recibido', desc: 'Tu comprobante de pago fue enviado con éxito.' },
    { icon: '🔍', title: 'Revisión de pago', desc: 'Verificaremos tu pago en máximo 24 horas.' },
    { icon: '📦', title: 'Preparación', desc: 'Prepararemos tu pedido tan pronto confirme el pago.' },
    { icon: '🚚', title: 'Envío', desc: 'Te notificaremos cuando tu pedido sea enviado.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md"
      >
        {/* Success icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-black text-gray-900">¡Pedido confirmado!</h1>
            <p className="text-gray-500 mt-2">Tu pedido está siendo revisado</p>
            {folio && (
              <div className="mt-4 bg-lila-50 border border-lila-100 rounded-2xl p-3">
                <p className="text-sm text-lila-600 font-medium">Folio de tu pedido</p>
                <p className="text-xl font-black text-lila-700 font-mono">{folio}</p>
                <p className="text-xs text-lila-400 mt-0.5">Guarda este número para rastrear tu pedido</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6"
        >
          <h2 className="font-bold text-gray-900 mb-4">¿Qué sigue?</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-9 h-9 bg-lila-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {folio && (
            <Link
              href={`/pedido/${folio}`}
              className="flex items-center justify-center gap-2 w-full bg-lila-500 hover:bg-lila-600 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-lila-500/30 active:scale-95"
            >
              <Package size={18} />
              Rastrear mi pedido
              <ArrowRight size={18} />
            </Link>
          )}
          <Link
            href="/catalogo"
            className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-700 font-semibold py-4 rounded-2xl hover:border-lila-300 hover:text-lila-600 transition-all active:scale-95"
          >
            <ShoppingBag size={18} />
            Seguir comprando
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
