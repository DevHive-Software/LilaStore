'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-lila-800 via-lila-600 to-lila-400">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-lila-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            style={{
              width: 60 + i * 15,
              height: 60 + i * 15,
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles size={14} className="text-yellow-300" />
            Nueva colección 2024 disponible
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight"
          >
            Tu estilo,
            <br />
            <span className="text-yellow-300">sin límites</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/80 text-lg sm:text-xl mt-6 max-w-xl leading-relaxed"
          >
            Descubre nuestra colección de ropa urbana, accesorios y calzado. Diseños únicos que
            reflejan tu personalidad con la calidad que mereces.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2 bg-white text-lila-700 font-bold px-8 py-4 rounded-2xl hover:bg-yellow-300 hover:text-lila-800 transition-all duration-200 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
            >
              Explorar Catálogo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/catalogo?categoria=promociones"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/25 transition-all duration-200 active:scale-95"
            >
              Ver Ofertas
              <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-0.5 rounded-full">
                HOT
              </span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-8 mt-12"
          >
            {[
              { value: '+500', label: 'Productos' },
              { value: '+2k', label: 'Clientes felices' },
              { value: '4.9★', label: 'Calificación' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
