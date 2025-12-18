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
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ClientErrorBoundary>
        <div className="relative min-h-screen flex flex-col bg-background">
          <Navbar />
          
          {/* Main content with proper spacing for fixed navbar */}
          <main className="flex-1 pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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