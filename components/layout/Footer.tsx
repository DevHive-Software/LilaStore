import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-lila-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-white">LilaStore</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Moda urbana con estilo único. Descubre piezas exclusivas que expresan tu personalidad.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-lila-600 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-lila-600 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-lila-600 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Tienda</h3>
            <ul className="space-y-2">
              {[
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/catalogo?categoria=ropa', label: 'Ropa' },
                { href: '/catalogo?categoria=accesorios', label: 'Accesorios' },
                { href: '/catalogo?categoria=calzado', label: 'Calzado' },
                { href: '/catalogo?categoria=bolsas', label: 'Bolsas' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-lila-300 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Información</h3>
            <ul className="space-y-2">
              {[
                { href: '#', label: 'Sobre Nosotros' },
                { href: '#', label: 'Política de Devoluciones' },
                { href: '#', label: 'Términos y Condiciones' },
                { href: '#', label: 'Política de Privacidad' },
                { href: '/pedido/buscar', label: 'Rastrear Pedido' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-lila-300 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} className="text-lila-400 shrink-0" />
                <span>hola@lilastore.mx</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} className="text-lila-400 shrink-0" />
                <span>+52 (55) 1234-5678</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={14} className="text-lila-400 shrink-0 mt-0.5" />
                <span>Tlahuelilpan, Hidalgo, México</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 LilaStore. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm">
            Hecho con 💜 en México
          </p>
        </div>
      </div>
    </footer>
  );
}
