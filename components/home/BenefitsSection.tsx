import { Truck, Shield, RotateCcw, HeadphonesIcon } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'Envío Rápido',
    description: 'Entregamos en 2-5 días hábiles a todo México. Envío gratis en compras mayores a $999.',
  },
  {
    icon: Shield,
    title: 'Pagos Seguros',
    description: 'Transacciones 100% seguras. Tus datos siempre protegidos con encriptación SSL.',
  },
  {
    icon: RotateCcw,
    title: 'Devoluciones',
    description: '30 días para cambios y devoluciones. Sin preguntas, sin complicaciones.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Atención 24/7',
    description: 'Nuestro equipo está disponible en todo momento para ayudarte por WhatsApp.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-lila-50 transition-colors group"
            >
              <div className="w-14 h-14 bg-lila-100 group-hover:bg-lila-500 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                <benefit.icon
                  size={24}
                  className="text-lila-600 group-hover:text-white transition-colors"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
