'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Valeria Rodríguez',
    location: 'CDMX',
    avatar: 'V',
    rating: 5,
    comment:
      'Me encanta la calidad de la ropa. La playera oversize que compré es súper cómoda y el diseño es hermoso. El envío llegó super rápido, definitivamente volveré a comprar.',
    product: 'Playera Oversize Lila',
  },
  {
    name: 'Diego Martínez',
    location: 'Guadalajara',
    avatar: 'D',
    rating: 5,
    comment:
      'Excelente servicio y productos de calidad. El hoodie morado es de los mejores que he tenido. La atención al cliente fue increíble cuando tuve una duda sobre la talla.',
    product: 'Hoodie Morada Premium',
  },
  {
    name: 'Sofía Hernández',
    location: 'Monterrey',
    avatar: 'S',
    rating: 5,
    comment:
      'La bolsa crossbody es perfecta, muy bien hecha y el color es exactamente como en las fotos. Me llegó bien empaquetada y en tiempo. 100% recomendada.',
    product: 'Bolsa Crossbody Lila',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
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
            Lo que dicen de nosotros
          </span>
          <h2 className="section-title mt-1">Clientes felices</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <StarRating rating={5} />
            <span className="text-gray-600 text-sm font-medium">4.9/5 · +200 reseñas</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <StarRating rating={t.rating} />
              <p className="text-gray-700 mt-4 leading-relaxed text-sm">&ldquo;{t.comment}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-lila-500 to-lila-700 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.location} · {t.product}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
