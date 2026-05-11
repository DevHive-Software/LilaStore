import type { Product, Category } from '@/types';

function makeSVGPlaceholder(
  letter: string,
  gradientStart: string,
  gradientEnd: string,
  textColor = '#ffffff'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradientStart};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#grad)" rx="16"/>
  <circle cx="200" cy="200" r="80" fill="rgba(255,255,255,0.15)"/>
  <circle cx="200" cy="200" r="55" fill="rgba(255,255,255,0.1)"/>
  <text x="200" y="225" font-family="Inter, Arial, sans-serif" font-size="80" font-weight="700" fill="${textColor}" text-anchor="middle" opacity="0.9">${letter}</text>
  <circle cx="320" cy="80" r="40" fill="rgba(255,255,255,0.08)"/>
  <circle cx="80" cy="320" r="50" fill="rgba(255,255,255,0.06)"/>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// For browser-side (base64 encoding using btoa)
function makeSVGPlaceholderBrowser(
  letter: string,
  gradientStart: string,
  gradientEnd: string,
  textColor = '#ffffff'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${gradientStart};stop-opacity:1" /><stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" /></linearGradient></defs><rect width="400" height="400" fill="url(#grad)" rx="16"/><circle cx="200" cy="200" r="80" fill="rgba(255,255,255,0.15)"/><circle cx="200" cy="200" r="55" fill="rgba(255,255,255,0.1)"/><text x="200" y="225" font-family="Inter, Arial, sans-serif" font-size="80" font-weight="700" fill="${textColor}" text-anchor="middle" opacity="0.9">${letter}</text><circle cx="320" cy="80" r="40" fill="rgba(255,255,255,0.08)"/><circle cx="80" cy="320" r="50" fill="rgba(255,255,255,0.06)"/></svg>`;
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export const demoProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Playera Oversize Lila',
    description:
      'Playera oversize de algodón premium con diseño minimalista. Perfecta para looks casuales y urbanos. Material suave y duradero, ideal para el uso diario. Disponible en varios colores para complementar tu estilo único.',
    price: 299,
    originalPrice: 399,
    stock: 25,
    category: 'ropa',
    sizes: [
      { label: 'XS', available: true },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: true },
      { label: 'XL', available: false },
      { label: 'XXL', available: false },
    ],
    colors: [
      { name: 'Lila', hex: '#7C3AED' },
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Negro', hex: '#1a1a1a' },
    ],
    images: [makeSVGPlaceholderBrowser('P', '#7C3AED', '#A78BFA')],
    active: true,
    featured: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Hoodie Morada Premium',
    description:
      'Sudadera con capucha de felpa ultra suave. Diseño premium con bolsillo canguro y puños ribeteados. El complemento perfecto para días frescos. Construida para durar con costuras reforzadas en áreas de alto estrés.',
    price: 599,
    originalPrice: 799,
    stock: 12,
    category: 'ropa',
    sizes: [
      { label: 'XS', available: false },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: true },
      { label: 'XL', available: true },
      { label: 'XXL', available: false },
    ],
    colors: [
      { name: 'Morado Oscuro', hex: '#5B21B6' },
      { name: 'Gris', hex: '#6B7280' },
    ],
    images: [makeSVGPlaceholderBrowser('H', '#4C1D95', '#7C3AED')],
    active: true,
    featured: true,
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Gorra Minimal White',
    description:
      'Gorra de 5 paneles con ajuste de hebilla trasera. Diseño minimalista con bordado del logo LilaStore. Material de lona de alta calidad resistente al agua. El accesorio esencial para cualquier outfit.',
    price: 199,
    stock: 40,
    category: 'accesorios',
    sizes: [
      { label: 'Único', available: true },
    ],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Lila', hex: '#A78BFA' },
      { name: 'Negro', hex: '#1a1a1a' },
    ],
    images: [makeSVGPlaceholderBrowser('G', '#C4B5FD', '#7C3AED')],
    active: true,
    featured: false,
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Bolsa Crossbody Lila',
    description:
      'Bolsa crossbody de piel vegana con herrajes dorados. Compartimento principal espacioso, bolsillo frontal con cierre y correa ajustable. Perfecta para llevar tus esenciales con estilo y funcionalidad durante todo el día.',
    price: 449,
    originalPrice: 599,
    stock: 8,
    category: 'bolsas',
    sizes: [
      { label: 'Único', available: true },
    ],
    colors: [
      { name: 'Lila', hex: '#7C3AED' },
      { name: 'Rosa', hex: '#EC4899' },
      { name: 'Negro', hex: '#1a1a1a' },
    ],
    images: [makeSVGPlaceholderBrowser('B', '#BE185D', '#7C3AED')],
    active: true,
    featured: true,
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Sneakers Urban Purple',
    description:
      'Tenis urbanos de suela chunky con diseño contemporáneo. Upper de cuero sintético con detalles en tela de malla. Suela de goma antideslizante para mayor comodidad. Perfectos para el street style moderno de ciudad.',
    price: 849,
    originalPrice: 1099,
    stock: 15,
    category: 'calzado',
    sizes: [
      { label: '22', available: true },
      { label: '23', available: true },
      { label: '24', available: true },
      { label: '25', available: true },
      { label: '26', available: false },
      { label: '27', available: true },
      { label: '28', available: true },
    ],
    colors: [
      { name: 'Morado/Blanco', hex: '#7C3AED' },
      { name: 'Negro/Blanco', hex: '#1a1a1a' },
    ],
    images: [makeSVGPlaceholderBrowser('S', '#3730A3', '#7C3AED')],
    active: true,
    featured: true,
    createdAt: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Collar Lila Minimalista',
    description:
      'Collar de cadena fina chapado en oro de 18k con dije de cristal en tono lila. Cierre de langosta ajustable. Hipoalergénico, libre de níquel. El toque final perfecto para cualquier outfit, formal o casual.',
    price: 149,
    stock: 30,
    category: 'accesorios',
    sizes: [
      { label: 'Único', available: true },
    ],
    colors: [
      { name: 'Oro/Lila', hex: '#D4AF37' },
      { name: 'Plata/Lila', hex: '#C0C0C0' },
    ],
    images: [makeSVGPlaceholderBrowser('C', '#DB2777', '#9333EA')],
    active: true,
    featured: false,
    createdAt: new Date('2024-03-01').toISOString(),
  },
];

export const demoCategories: Category[] = [
  {
    id: 'cat-001',
    name: 'Ropa',
    slug: 'ropa',
    description: 'Playeras, hoodies, pantalones y más',
    active: true,
  },
  {
    id: 'cat-002',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Gorras, collares, lentes y complementos',
    active: true,
  },
  {
    id: 'cat-003',
    name: 'Calzado',
    slug: 'calzado',
    description: 'Sneakers, botas y más',
    active: true,
  },
  {
    id: 'cat-004',
    name: 'Bolsas',
    slug: 'bolsas',
    description: 'Crossbody, mochilas y carteras',
    active: true,
  },
  {
    id: 'cat-005',
    name: 'Promociones',
    slug: 'promociones',
    description: 'Ofertas especiales y descuentos',
    active: true,
  },
];
