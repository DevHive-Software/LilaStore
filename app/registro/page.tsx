'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag,
  Store, ArrowLeft, CheckCircle, Sparkles,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const BENEFITS: Record<UserRole, { icon: string; text: string }[]> = {
  comprador: [
    { icon: '🛍️', text: 'Historial de pedidos en un solo lugar' },
    { icon: '📦', text: 'Rastrea tus envíos en tiempo real' },
    { icon: '💜', text: 'Guarda tus productos favoritos' },
    { icon: '🔔', text: 'Notificaciones de estado de tus pedidos' },
  ],
  vendedor: [
    { icon: '🏪', text: 'Tu propia tienda en LilaStore' },
    { icon: '📊', text: 'Dashboard de ventas en tiempo real' },
    { icon: '📦', text: 'Gestiona productos y pedidos' },
    { icon: '💰', text: 'Recibe pagos por transferencia' },
  ],
};

function RegistroForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useUserStore();
  const { addToast } = useNotificationStore();

  const initialRole = (params.get('rol') as UserRole) || 'comprador';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const update = (key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validateStep1 = () => {
    if (!form.name.trim()) return 'El nombre es requerido';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'Correo inválido';
    if (form.phone && form.phone.length < 10) return 'Teléfono inválido';
    return null;
  };

  const validateStep2 = () => {
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden';
    if (!form.terms) return 'Debes aceptar los términos y condiciones';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = register({ name: form.name, email: form.email, password: form.password, role, phone: form.phone });
    if (!result.ok) {
      setError(result.error ?? 'Error al registrarse');
      setLoading(false);
      return;
    }
    addToast('success', '¡Cuenta creada!', `Bienvenido/a a LilaStore, ${form.name}`);
    router.push(role === 'vendedor' ? '/vendedor' : '/mi-cuenta');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lila-900 via-lila-700 to-lila-500 flex items-center justify-center p-4 py-12">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Volver
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-lila-800 to-lila-500 px-8 py-7 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-white font-black text-lg">L</span>
                </div>
                <h1 className="text-xl font-bold text-white">Crear cuenta</h1>
              </div>
              <p className="text-lila-200 text-sm">
                Únete a LilaStore y empieza {role === 'comprador' ? 'a comprar' : 'a vender'} hoy
              </p>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                        step >= s
                          ? 'bg-white text-lila-700 border-white'
                          : 'bg-transparent text-white/50 border-white/30'
                      )}
                    >
                      {step > s ? <CheckCircle size={14} className="text-lila-600" /> : s}
                    </div>
                    {s < 2 && (
                      <div className={cn('h-0.5 w-8 rounded-full transition-all', step > s ? 'bg-white' : 'bg-white/30')} />
                    )}
                  </div>
                ))}
                <span className="text-white/60 text-xs ml-2">
                  {step === 1 ? 'Datos personales' : 'Contraseña'}
                </span>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">
            {/* Role tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              {(['comprador', 'vendedor'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setError(''); }}
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

            {/* Benefits */}
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-2 gap-2 mb-6"
              >
                {BENEFITS[role].map((b) => (
                  <div key={b.text} className="flex items-start gap-2 bg-lila-50 rounded-xl p-2.5">
                    <span className="text-base shrink-0">{b.icon}</span>
                    <span className="text-xs text-lila-800 font-medium leading-snug">{b.text}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Step 1 */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre completo</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Teléfono / WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="+52 55 1234 5678"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gradient-to-r from-lila-600 to-lila-500 hover:from-lila-700 hover:to-lila-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-lila-500/30 mt-2"
                  >
                    Continuar →
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => update('password', e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {form.password && (
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={cn('h-1 flex-1 rounded-full transition-all',
                            form.password.length >= i * 3
                              ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-yellow-400' : i <= 3 ? 'bg-blue-400' : 'bg-green-400'
                              : 'bg-gray-200'
                          )} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar contraseña</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)}
                        placeholder="Repite tu contraseña"
                        className={cn(
                          'w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lila-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all',
                          form.confirmPassword && form.password !== form.confirmPassword
                            ? 'border-red-300' : 'border-gray-200'
                        )}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(e) => update('terms', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-lila-600 focus:ring-lila-400 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Acepto los{' '}
                      <span className="text-lila-600 font-medium">Términos y Condiciones</span>
                      {' '}y la{' '}
                      <span className="text-lila-600 font-medium">Política de Privacidad</span>
                      {' '}de LilaStore
                    </span>
                  </label>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setStep(1); setError(''); }}
                      className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      ← Atrás
                    </button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex-2 flex-grow bg-gradient-to-r from-lila-600 to-lila-500 hover:from-lila-700 hover:to-lila-600 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-lila-500/30 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        <>
                          <Sparkles size={15} />
                          Crear cuenta
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-gray-500 mt-5">
              ¿Ya tienes cuenta?{' '}
              <Link href={`/login?rol=${role}`} className="text-lila-600 font-semibold hover:text-lila-700">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lila-800 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}>
      <RegistroForm />
    </Suspense>
  );
}
