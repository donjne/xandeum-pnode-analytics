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
        {/* GLOBAL ATMOSPHERIC BACKGROUND */}
        <div className="relative min-h-screen flex flex-col overflow-hidden">
          {/* Background layer */}
          <div className="pointer-events-none absolute inset-0">
            {/* LIGHT MODE BASE */}
            <div className="absolute inset-0 bg-white dark:hidden" />

            {/* DARK MODE BASE */}
            <div className="absolute inset-0 hidden dark:block bg-[#070B1A]" />

            {/* DARK MODE DEPTH */}
            <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-[#0A0E27] via-[#070B1A] to-black" />

            {/* DARK MODE RADIAL GLOW */}
            <div className="absolute top-[-20%] left-1/2 hidden h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px] dark:block" />
          </div>

          {/* App chrome */}
          <Navbar />

          {/* Content */}
          <main className="relative flex-1 pt-24 pb-12">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
