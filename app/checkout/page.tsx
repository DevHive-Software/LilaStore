'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Store, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, generateId, generateFolio } from '@/lib/utils';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import type { Order, CustomerInfo } from '@/types';

const STEPS = [
  { id: 1, label: 'Tus datos' },
  { id: 2, label: 'Envío' },
  { id: 3, label: 'Pago' },
];

const INITIAL_CUSTOMER: CustomerInfo = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  references: '',
  city: '',
  state: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState<CustomerInfo>(INITIAL_CUSTOMER);
  const [deliveryMethod, setDeliveryMethod] = useState<'domicilio' | 'tienda'>('domicilio');
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/');
    }
  }, [items, router]);

  const subtotal = getSubtotal();
  const shipping = deliveryMethod === 'tienda' ? 0 : subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!customer.fullName.trim()) newErrors.fullName = 'Nombre requerido';
    if (!customer.phone.trim() || customer.phone.length < 10) newErrors.phone = 'Teléfono inválido (mín. 10 dígitos)';
    if (!customer.email.trim() || !customer.email.includes('@')) newErrors.email = 'Correo inválido';
    if (deliveryMethod === 'domicilio') {
      if (!customer.address.trim()) newErrors.address = 'Dirección requerida';
      if (!customer.city.trim()) newErrors.city = 'Ciudad requerida';
      if (!customer.state.trim()) newErrors.state = 'Estado requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validate()) return;
    if (step < 3) setStep((s) => s + 1);
  };

  const handleCreateOrder = () => {
    setIsSubmitting(true);
    const folio = generateFolio();
    const concept = folio;
    const now = new Date().toISOString();

    const order: Order = {
      id: generateId(),
      folio,
      customer,
      items,
      subtotal,
      shipping,
      total,
      deliveryMethod,
      status: 'pendiente_pago',
      concept,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: 'pendiente_pago', date: now }],
    };

    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    storage.set(STORAGE_KEYS.ORDERS, [order, ...orders]);
    storage.set(STORAGE_KEYS.CHECKOUT_ORDER, order);

    clearCart();
    router.push('/checkout/transferencia');
  };

  const updateCustomer = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Finalizar compra</h1>

        {/* Steps indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step > s.id
                      ? 'bg-green-500 text-white'
                      : step === s.id
                      ? 'bg-lila-500 text-white shadow-lg shadow-lila-500/30'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.id ? <Check size={16} /> : s.id}
                </div>
                <span className={`text-xs mt-1 font-medium ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Customer Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Información de contacto</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={customer.fullName}
                        onChange={(e) => updateCustomer('fullName', e.target.value)}
                        placeholder="Tu nombre completo"
                        className={`input-field ${errors.fullName ? 'border-red-300 focus:ring-red-200' : ''}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        WhatsApp / Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => updateCustomer('phone', e.target.value)}
                        placeholder="5512345678"
                        className={`input-field ${errors.phone ? 'border-red-300 focus:ring-red-200' : ''}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => updateCustomer('email', e.target.value)}
                        placeholder="tu@correo.com"
                        className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-200' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Dirección {deliveryMethod === 'domicilio' && '*'}
                      </label>
                      <input
                        type="text"
                        value={customer.address}
                        onChange={(e) => updateCustomer('address', e.target.value)}
                        placeholder="Calle, número, colonia"
                        className={`input-field ${errors.address ? 'border-red-300 focus:ring-red-200' : ''}`}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Referencias
                      </label>
                      <input
                        type="text"
                        value={customer.references}
                        onChange={(e) => updateCustomer('references', e.target.value)}
                        placeholder="Entre calles, color de casa, etc."
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Ciudad {deliveryMethod === 'domicilio' && '*'}
                      </label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => updateCustomer('city', e.target.value)}
                        placeholder="Ciudad"
                        className={`input-field ${errors.city ? 'border-red-300 focus:ring-red-200' : ''}`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Estado {deliveryMethod === 'domicilio' && '*'}
                      </label>
                      <input
                        type="text"
                        value={customer.state}
                        onChange={(e) => updateCustomer('state', e.target.value)}
                        placeholder="Estado"
                        className={`input-field ${errors.state ? 'border-red-300 focus:ring-red-200' : ''}`}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Método de entrega</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: 'domicilio' as const,
                        icon: MapPin,
                        title: 'Envío a domicilio',
                        desc: 'Entrega en 2-5 días hábiles',
                        price: subtotal >= 999 ? 'Gratis' : formatPrice(99),
                        badge: subtotal >= 999 ? 'Gratis' : null,
                      },
                      {
                        id: 'tienda' as const,
                        icon: Store,
                        title: 'Recolección en tienda',
                        desc: 'Disponible en 24-48 horas',
                        price: 'Gratis',
                        badge: 'Gratis',
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setDeliveryMethod(method.id)}
                        className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all ${
                          deliveryMethod === method.id
                            ? 'border-lila-500 bg-lila-50'
                            : 'border-gray-200 hover:border-lila-200'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              deliveryMethod === method.id ? 'bg-lila-500 text-white' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            <method.icon size={20} />
                          </div>
                          <span
                            className={`font-bold ${
                              deliveryMethod === method.id ? 'text-lila-700' : 'text-gray-900'
                            }`}
                          >
                            {method.price}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">{method.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{method.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4"
                >
                  <h2 className="text-lg font-bold text-gray-900">Método de pago</h2>
                  <p className="text-sm text-gray-500">
                    Actualmente solo está disponible transferencia bancaria. Los demás métodos
                    estarán disponibles próximamente.
                  </p>

                  {/* Payment options */}
                  <div className="space-y-3">
                    {[
                      { id: 'transferencia', label: 'Transferencia interbancaria (SPEI)', available: true },
                      { id: 'visa', label: 'Visa / Mastercard', available: false },
                      { id: 'mercadopago', label: 'Mercado Pago', available: false },
                      { id: 'paypal', label: 'PayPal', available: false },
                      { id: 'oxxo', label: 'Pago en OXXO', available: false },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                          method.available
                            ? 'border-lila-500 bg-lila-50'
                            : 'border-gray-100 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              method.available ? 'border-lila-500 bg-lila-500' : 'border-gray-300'
                            } flex items-center justify-center`}
                          >
                            {method.available && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className="font-medium text-gray-900">{method.label}</span>
                        </div>
                        {!method.available && (
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                            Próximamente
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                    Al confirmar, recibirás los datos bancarios para realizar tu transferencia y podrás
                    subir tu comprobante de pago.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <ChevronLeft size={18} />
                  Atrás
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                  Continuar
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleCreateOrder}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Resumen del pedido</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex justify-between items-start text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-gray-400 text-xs">
                        x{item.quantity} · {item.selectedSize} · {item.selectedColor}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 ml-2 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Envío</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-lila-600 text-lg">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
