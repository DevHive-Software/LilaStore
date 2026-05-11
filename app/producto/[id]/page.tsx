'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronRight, Minus, Plus, Package, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice, cn } from '@/lib/utils';
import { ProductCard } from '@/components/catalog/ProductCard';
import type { Product } from '@/types';

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { addToast } = useNotificationStore();

  useEffect(() => {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const found = products.find((p) => p.id === params.id);

    if (found) {
      setProduct(found);
      setSelectedSize(found.sizes.find((s) => s.available)?.label || '');
      setSelectedColor(found.colors[0]?.name || '');
      const relatedProducts = products
        .filter((p) => p.category === found.category && p.id !== found.id && p.active)
        .slice(0, 4);
      setRelated(relatedProducts);
    }
    setLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes.filter((s) => s.label !== 'Único').length > 0) {
      addToast('warning', 'Selecciona una talla', 'Por favor elige tu talla antes de continuar');
      return;
    }
    setIsAdding(true);
    addItem(product, quantity, selectedSize, selectedColor);
    addToast('success', '¡Agregado al carrito!', `${product.name} x${quantity}`);
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin w-8 h-8 border-4 border-lila-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 text-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h1>
        <p className="text-gray-500 mb-6">El producto que buscas no existe o fue eliminado.</p>
        <Link href="/catalogo" className="btn-primary">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
        <nav className="flex items-center gap-1 text-sm text-gray-400">
          <Link href="/" className="hover:text-lila-600 transition-colors">Inicio</Link>
          <ChevronRight size={14} />
          <Link href="/catalogo" className="hover:text-lila-600 transition-colors">Catálogo</Link>
          <ChevronRight size={14} />
          <Link href={`/catalogo?categoria=${product.category}`} className="hover:text-lila-600 transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50"
            >
              <Image
                src={product.images[selectedImage] || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                      selectedImage === i ? 'border-lila-500' : 'border-gray-200 hover:border-lila-300'
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <span className="text-lila-500 font-semibold text-sm uppercase tracking-wider capitalize">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-1 leading-tight">
                {product.name}
              </h1>

              {/* Rating mock */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">4.9 (47 reseñas)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-black text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-lg line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded-lg">
                    -{discount}% off
                  </span>
                )}
              </div>
            </div>

            {/* Stock badge */}
            <div className="flex items-center gap-2">
              <Package size={16} className={product.stock > 0 ? 'text-green-500' : 'text-red-400'} />
              <span className={cn('text-sm font-medium', product.stock > 0 ? 'text-green-700' : 'text-red-600')}>
                {product.stock === 0
                  ? 'Agotado'
                  : product.stock <= 5
                  ? `Solo ${product.stock} piezas disponibles`
                  : `${product.stock} piezas disponibles`}
              </span>
            </div>

            {/* Size selector */}
            {product.sizes.filter((s) => s.label !== 'Único').length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">
                    Talla: <span className="text-lila-600">{selectedSize}</span>
                  </p>
                  <button className="text-xs text-lila-500 underline hover:text-lila-700">
                    Guía de tallas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      disabled={!size.available}
                      onClick={() => setSelectedSize(size.label)}
                      className={cn(
                        'px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all',
                        !size.available
                          ? 'opacity-30 cursor-not-allowed line-through border-gray-200 text-gray-400'
                          : selectedSize === size.label
                          ? 'border-lila-500 bg-lila-500 text-white shadow-md shadow-lila-200'
                          : 'border-gray-200 hover:border-lila-300 text-gray-700'
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-3">
                  Color: <span className="text-lila-600 font-normal">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all',
                        selectedColor === color.name
                          ? 'border-lila-500 scale-110 shadow-lg'
                          : 'border-gray-300 hover:scale-105'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="font-semibold text-gray-900 mb-3">Cantidad</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-5 py-3 font-bold text-gray-900 text-lg min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-gray-400 text-sm">{product.stock} disponibles</span>
              </div>
            </div>

            {/* Add to cart */}
            <motion.button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all',
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdding
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-lila-500 hover:bg-lila-600 text-white shadow-lg shadow-lila-500/30 hover:shadow-xl hover:shadow-lila-500/40'
              )}
            >
              <ShoppingCart size={22} />
              {product.stock === 0 ? 'Agotado' : isAdding ? '¡Agregado al carrito!' : 'Agregar al carrito'}
            </motion.button>

            {/* Description */}
            <div className="pt-4 border-t border-gray-100">
              <h2 className="font-bold text-gray-900 mb-3">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
