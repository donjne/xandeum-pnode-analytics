import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xandeum pNode Analytics',
  description: 'Real-time analytics and monitoring for Xandeum provider nodes',
  keywords: ['Xandeum', 'pNode', 'Solana', 'blockchain', 'storage', 'analytics'],
  authors: [{ name: 'Xandeum Labs' }],
  openGraph: {
    title: 'Xandeum pNode Analytics',
    description: 'Real-time analytics and monitoring for Xandeum provider nodes',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <div className="relative min-h-screen flex flex-col">
              {/* Fixed Navbar */}
              <Navbar />

              <div className="flex flex-1">
                {/* Collapsible Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                  <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </main>
              </div>

              {/* Footer */}
              <Footer />
            </div>

            {/* Toast Notifications */}
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}