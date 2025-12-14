'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
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
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
          </div>
          <Footer />
        </div>
        <Toaster />
      </ClientErrorBoundary>
    </ThemeProvider>
  );
}
