'use client';

import * as React from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface ClientErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper for ErrorBoundary
 * This allows us to use class-based ErrorBoundary in Next.js App Router
 */
export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}