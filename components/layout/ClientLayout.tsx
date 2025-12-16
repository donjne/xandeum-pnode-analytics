'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ClientErrorBoundary } from '@/components/layout/ClientErrorBoundary';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClientErrorBoundary>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
        </div>
        <Toaster />
      </ClientErrorBoundary>
    </ThemeProvider>
  );
}