import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xandeum pNode Analytics',
  description: 'Realtime analytics and monitoring for Xandeum provider nodes',
  keywords: ['Xandeum', 'pNode', 'Solana', 'blockchain', 'storage', 'analytics'],
  authors: [{ name: 'Xandeum Labs' }],
  openGraph: {
    title: 'Xandeum pNode Analytics',
    description: 'Realtime analytics and monitoring for Xandeum provider nodes',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}