'use client';

import { redirect } from 'next/navigation';

// Redirect /dashboard to / (home page is the dashboard)
export default function DashboardPage() {
  redirect('/');
}