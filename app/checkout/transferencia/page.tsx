'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Upload, Check, FileImage, AlertCircle } from 'lucide-react';
import { storage, STORAGE_KEYS } from '@/lib/localStorage';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

export default function TransferenciaPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [proofName, setProofName] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedOrder = storage.get<Order | null>(STORAGE_KEYS.CHECKOUT_ORDER, null);
    if (!savedOrder) {
      router.replace('/');
      return;
    }
    setOrder(savedOrder);
  }, [router]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Solo se aceptan imágenes (JPG, PNG) o PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no debe superar 10 MB');
      return;
    }

    setError('');
    setProofName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!proofFile || !order) {
      setError('Por favor sube tu comprobante de pago');
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();

    const updatedOrder: Order = {
      ...order,
      status: 'comprobante_enviado',
      paymentProof: proofFile,
      updatedAt: now,
      statusHistory: [
        ...order.statusHistory,
        { status: 'comprobante_enviado', date: now, note: 'Comprobante de pago enviado' },
      ],
    };

    // Update orders in storage
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updatedOrders = orders.map((o) => (o.id === order.id ? updatedOrder : o));
    storage.set(STORAGE_KEYS.ORDERS, updatedOrders);
    storage.remove(STORAGE_KEYS.CHECKOUT_ORDER);

    router.push('/checkout/confirmacion');
  };

  if (!order) return null;

  const bankDetails = [
    { label: 'Banco', value: 'BBVA' },
    { label: 'Titular', value: 'LilaStore S.A. de C.V.' },
    { label: 'CLABE interbancaria', value: '012345678901234567' },
    { label: 'Número de cuenta', value: '0123456789' },
    { label: 'Concepto / Referencia', value: order.concept },
    { label: 'Monto a transferir', value: formatPrice(order.total) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-lila-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏦</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Datos para transferencia</h1>
            <p className="text-gray-500 mt-1">
              Realiza la transferencia y sube tu comprobante para confirmar tu pedido
            </p>
          </div>

          {/* Order info */}
          <div className="bg-lila-50 border border-lila-100 rounded-2xl p-4 text-center">
            <p className="text-sm text-lila-600 font-medium">Folio del pedido</p>
            <p className="text-xl font-black text-lila-700 font-mono mt-0.5">{order.folio}</p>
          </div>

          {/* Bank details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
            <h2 className="font-bold text-gray-900 mb-4">Información bancaria</h2>
            {bankDetails.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-xs text-gray-400 font-medium">{detail.label}</p>
                  <p className="font-semibold text-gray-900 font-mono text-sm mt-0.5">{detail.value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(detail.value, detail.label)}
                  className="flex items-center gap-1.5 text-xs text-lila-600 hover:text-lila-700 font-medium px-2 py-1 hover:bg-lila-50 rounded-lg transition-colors"
                >
                  {copied === detail.label ? (
                    <>
                      <Check size={12} />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Important note */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Importante</p>
              <ul className="space-y-1 text-amber-700">
                <li>• Usa exactamente el concepto indicado en tu transferencia</li>
                <li>• El pago puede tardar hasta 24 horas en ser verificado</li>
                <li>• Guarda tu comprobante hasta recibir tu pedido</li>
              </ul>
            </div>
          </div>

          {/* Upload proof */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Sube tu comprobante de pago</h2>

            {!proofFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-lila-400 hover:bg-lila-50 transition-all group">
                <Upload
                  size={32}
                  className="text-gray-300 group-hover:text-lila-400 transition-colors mb-3"
                />
                <p className="font-semibold text-gray-700 group-hover:text-lila-700 transition-colors">
                  Seleccionar archivo
                </p>
                <p className="text-gray-400 text-sm mt-1">JPG, PNG o PDF · Máx. 10 MB</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <FileImage size={22} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-800 truncate">{proofName}</p>
                  <p className="text-green-600 text-sm">Comprobante listo para enviar</p>
                </div>
                <button
                  onClick={() => {
                    setProofFile(null);
                    setProofName('');
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Cambiar
                </button>
              </motion.div>
            )}

            {/* Image preview */}
            {proofFile && proofFile.startsWith('data:image') && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofFile}
                  alt="Comprobante de pago"
                  className="w-full max-h-48 object-contain bg-gray-50"
                />
              </div>
            )}

            {error && (
              <div className="mt-3 text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!proofFile || isSubmitting}
            className="w-full py-4 bg-lila-500 hover:bg-lila-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-lg rounded-2xl transition-all disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-lila-500/20 hover:shadow-xl hover:shadow-lila-500/30"
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar pago'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
