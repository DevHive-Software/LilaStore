# LilaStore

Plataforma e-commerce completa construida con **Next.js 14**, **TypeScript** y **Tailwind CSS**. Diseñada para la venta de ropa, accesorios y productos de moda urbana. Funciona con **LocalStorage** como capa de persistencia, lista para migrar a un backend real.

## Vista previa

| Ruta | Descripción |
|------|-------------|
| `/` | Landing con hero, productos destacados y categorías |
| `/catalogo` | Catálogo con filtros, búsqueda y vista rápida |
| `/producto/[id]` | Detalle de producto con tallas, colores y carrito |
| `/checkout` | Proceso de compra con transferencia bancaria |
| `/pedido/[folio]` | Seguimiento de pedido con timeline |
| `/admin` | Panel de administración (login requerido) |

## Stack tecnológico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS (paleta morado/lila personalizada)
- **Animaciones**: Framer Motion
- **Estado global**: Zustand
- **Persistencia**: LocalStorage (con sincronización entre pestañas)
- **Iconos**: Lucide React

## Instalación y uso

```bash
# Clonar repositorio
git clone https://github.com/DevHive-Software/LilaStore.git
cd LilaStore

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Panel de administración

Accede en `/admin` con las siguientes credenciales demo:

| Campo | Valor |
|-------|-------|
| Email | `admin@lilastore.demo` |
| Contraseña | `admin123` |

## Módulos principales

### Tienda
- **Landing page**: Hero animado, productos destacados, sección de categorías, beneficios de compra, banner promocional y testimonios
- **Catálogo**: Grid responsive con filtros por categoría, precio, talla, color y disponibilidad; búsqueda en tiempo real; vista rápida en modal
- **Detalle de producto**: Galería de imágenes, selector de talla y color, control de cantidad, stock visible, productos relacionados
- **Carrito**: Drawer lateral persistente, actualización de cantidades, cálculo automático de subtotal, envío y total

### Checkout
- Formulario completo de datos del cliente
- Selección de método de entrega (domicilio o recolección en tienda)
- Métodos de pago visibles: Visa, Mastercard, Mercado Pago, PayPal, OXXO *(deshabilitados)*
- **Único método habilitado**: Transferencia interbancaria
- Upload de comprobante de pago en base64 con vista previa
- Pantalla de confirmación con folio único generado automáticamente

### Seguimiento
- Consulta de pedido por folio
- Timeline visual con historial de estados
- Vista del comprobante enviado

### Panel Admin
- **Dashboard**: Estadísticas de pedidos, comprobantes por revisar, stock bajo, notificaciones recientes
- **Productos**: CRUD completo, toggle activo/destacado, upload de imágenes, gestión de tallas y colores
- **Pedidos**: Listado filtrable, cambio de estado inline, visualización de comprobante, detalle completo del cliente
- **Categorías**: CRUD con toggle activo/inactivo

### Sistema de notificaciones
- Toasts animados (éxito, info, advertencia, error)
- Panel de notificaciones en el admin
- Sincronización en tiempo real entre pestañas mediante `storage events`

## Estructura del proyecto

```
LilaStore/
├── app/                        # Rutas de Next.js (App Router)
│   ├── page.tsx                # Landing / Home
│   ├── catalogo/               # Catálogo de productos
│   ├── producto/[id]/          # Detalle de producto
│   ├── checkout/               # Proceso de compra
│   │   ├── page.tsx            # Formulario y método de pago
│   │   ├── transferencia/      # Pago por transferencia
│   │   └── confirmacion/       # Confirmación de pedido
│   ├── pedido/[folio]/         # Seguimiento de pedido
│   └── admin/                  # Panel de administración
│       ├── page.tsx            # Login + Dashboard
│       ├── productos/          # Gestión de productos
│       ├── pedidos/            # Gestión de pedidos
│       └── categorias/         # Gestión de categorías
├── components/
│   ├── admin/                  # Componentes del panel admin
│   ├── cart/                   # Carrito (drawer)
│   ├── catalog/                # Catálogo (cards, filtros, modal)
│   ├── home/                   # Secciones de la landing
│   ├── layout/                 # Header, Footer, BottomNav, Providers
│   └── ui/                     # Componentes reutilizables (Toast, Skeleton)
├── lib/
│   ├── demoData.ts             # Productos y categorías precargados
│   ├── localStorage.ts         # Wrapper seguro para LocalStorage
│   └── utils.ts                # Utilidades (formatPrice, generateFolio, etc.)
├── store/
│   ├── cartStore.ts            # Estado global del carrito (Zustand)
│   ├── notificationStore.ts    # Estado global de notificaciones
│   └── authStore.ts            # Estado de autenticación admin
└── types/
    └── index.ts                # Tipos TypeScript del dominio
```

## Persistencia (LocalStorage)

| Clave | Contenido |
|-------|-----------|
| `lila_cart` | Items del carrito activo |
| `lila_orders` | Historial de pedidos |
| `lila_products` | Catálogo de productos (seeded con demo) |
| `lila_categories` | Categorías (seeded con demo) |
| `lila_notifications` | Notificaciones del admin |
| `lila_admin_auth` | Sesión del administrador |

## Despliegue en Vercel

```bash
# Con Vercel CLI
vercel --prod

# O conecta el repositorio en vercel.com
# No requiere variables de entorno adicionales
```

## Colores de la marca

| Token | Hex | Uso |
|-------|-----|-----|
| `lila-500` | `#7C3AED` | Color primario (botones, acentos) |
| `lila-400` | `#8B5CF6` | Hover states |
| `lila-300` | `#A78BFA` | Elementos secundarios |
| `lila-100` | `#DDD6FE` | Fondos suaves |
| `lila-50` | `#EDE9FE` | Fondos muy claros |

## Productos demo incluidos

| Producto | Categoría | Precio |
|----------|-----------|--------|
| Playera Oversize Lila | Ropa | $299 |
| Hoodie Morada Premium | Ropa | $599 |
| Gorra Minimal White | Accesorios | $199 |
| Bolsa Crossbody Lila | Bolsas | $449 |
| Sneakers Urban Purple | Calzado | $849 |
| Collar Lila Minimalista | Accesorios | $149 |

---

Construido con Next.js · Diseñado para escalar · Listo para Vercel
