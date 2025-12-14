'use client';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | Xandeum pNode Analytics',
};

// Redirect /dashboard to / (home page is the dashboard)
export default function DashboardPage() {
  redirect('/');
}