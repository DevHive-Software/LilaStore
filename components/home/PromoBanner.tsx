'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-lila-700 via-lila-600 to-lila-500 rounded-3xl p-8 md:p-12"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                <Tag size={14} />
                Oferta Exclusiva
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                10% de descuento
                <br />
                <span className="text-yellow-300">en tu primera compra</span>
              </h2>
              <p className="text-white/80 mt-3 text-base md:text-lg">
                Usa el código{' '}
                <span className="bg-white/20 text-white font-mono font-bold px-3 py-1 rounded-lg text-sm md:text-base">
                  LILA10
                </span>{' '}
                al finalizar tu pedido
              </p>
            </div>

            <Link
              href="/catalogo"
              className="group shrink-0 inline-flex items-center gap-2 bg-white text-lila-700 font-bold px-8 py-4 rounded-2xl hover:bg-yellow-300 hover:text-lila-900 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95 text-lg"
            >
              Aprovechar ahora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
