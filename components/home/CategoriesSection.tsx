'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shirt, Watch, Footprints, ShoppingBag, Tag } from 'lucide-react';

const categories = [
  {
    icon: Shirt,
    name: 'Ropa',
    slug: 'ropa',
    desc: 'Playeras, hoodies y más',
    gradient: 'from-lila-500 to-lila-700',
    count: 28,
  },
  {
    icon: Watch,
    name: 'Accesorios',
    slug: 'accesorios',
    desc: 'Gorras, collares y más',
    gradient: 'from-pink-500 to-lila-600',
    count: 45,
  },
  {
    icon: Footprints,
    name: 'Calzado',
    slug: 'calzado',
    desc: 'Sneakers y botas',
    gradient: 'from-indigo-500 to-lila-500',
    count: 19,
  },
  {
    icon: ShoppingBag,
    name: 'Bolsas',
    slug: 'bolsas',
    desc: 'Crossbody y mochilas',
    gradient: 'from-fuchsia-500 to-lila-600',
    count: 12,
  },
  {
    icon: Tag,
    name: 'Promociones',
    slug: 'promociones',
    desc: 'Ofertas especiales',
    gradient: 'from-orange-500 to-pink-500',
    count: 8,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-lila-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-lila-500 font-semibold text-sm uppercase tracking-wider">
            Explora por categoría
          </span>
          <h2 className="section-title mt-1">Todo lo que necesitas</h2>
          <p className="section-subtitle mx-auto">
            Encuentra tu estilo en nuestra amplia selección de categorías
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Link href={`/catalogo?categoria=${cat.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative overflow-hidden bg-gradient-to-br ${cat.gradient} rounded-2xl p-6 text-white cursor-pointer group`}
                >
                  {/* Background decoration */}
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute -right-2 -bottom-8 w-16 h-16 bg-white/5 rounded-full" />

                  <cat.icon size={32} className="mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-base">{cat.name}</h3>
                  <p className="text-white/70 text-xs mt-1">{cat.desc}</p>
                  <div className="mt-3 text-white/60 text-xs font-medium">
                    {cat.count} productos
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
