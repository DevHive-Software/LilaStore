import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LilaStore | Moda Urbana con Estilo',
  description:
    'Descubre la colección más exclusiva de ropa, accesorios y calzado urbano. Compra en línea con envío a todo México.',
  keywords: 'ropa, moda, urban, lila, accesorios, calzado, bolsas, México',
  openGraph: {
    title: 'LilaStore | Moda Urbana con Estilo',
    description: 'Descubre la colección más exclusiva de ropa urbana y accesorios.',
    type: 'website',
    locale: 'es_MX',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
