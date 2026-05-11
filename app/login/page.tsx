'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, Store, ArrowLeft, Sparkles } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const { addToast } = useNotificationStore();

  const [role, setRole] = useState<UserRole>('comprador');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 500));
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? 'Error al iniciar sesión');
      setLoading(false);
      return;
    }
    addToast('success', '¡Bienvenido/a!', 'Has iniciado sesión correctamente');
    router.push(role === 'vendedor' ? '/vendedor' : '/mi-cuenta');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lila-900 via-lila-700 to-lila-500 flex items-center justify-center p-4">
      {/* Back to store */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Volver a la tienda
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header gradient */}
          <div className="bg-gradient-to-br from-lila-800 to-lila-500 px-8 py-8 text-center relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30"
            >
              <span className="text-white font-black text-2xl">L</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
            <p className="text-lila-200 text-sm mt-1">Bienvenido/a de vuelta a LilaStore</p>
          </div>

          <div className="px-8 py-8">
            {/* Role tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              {(['comprador', 'vendedor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    role === r
                      ? 'bg-white text-lila-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {r === 'comprador' ? <ShoppingBag size={15} /> : <Store size={15} />}
                  {r === 'comprador' ? 'Comprador' : 'Vendedor'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {role === 'vendedor' && (
                  <div className="flex items-start gap-2 bg-lila-50 border border-lila-100 rounded-xl px-4 py-3 mb-5">
                    <Sparkles size={15} className="text-lila-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-lila-700">
                      Accede a tu panel de vendedor para gestionar productos, pedidos y ver tus ventas en tiempo real.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                  <button type="button" className="text-xs text-lila-600 hover:text-lila-700 font-medium">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-lila-600 to-lila-500 hover:from-lila-700 hover:to-lila-600 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-lila-500/30 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Ingresando...
                  </span>
                ) : (
                  `Entrar como ${role === 'comprador' ? 'Comprador' : 'Vendedor'}`
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              ¿No tienes cuenta?{' '}
              <Link href={`/registro?rol=${role}`} className="text-lila-600 font-semibold hover:text-lila-700">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-white/50 text-xs mt-6">
          ¿Eres administrador?{' '}
          <Link href="/admin" className="text-white/70 hover:text-white underline">
            Accede al panel admin
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
