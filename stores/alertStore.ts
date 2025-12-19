'use client';

import { create } from 'zustand';
import type { Alert } from '@/lib/types/alert';

interface AlertState {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;

  fetchAlerts: () => Promise<void>;
  createAlert: (data: Partial<Alert>) => Promise<void>;
  toggleAlert: (id: string) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  isLoading: false,
  error: null,

  fetchAlerts: async () => {
    set({ isLoading: true });
    const res = await fetch('/api/alerts/list');
    const data = await res.json();
    set({ alerts: data.alerts, isLoading: false });
  },

  createAlert: async (data) => {
    const res = await fetch('/api/alerts/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Create failed');
    await useAlertStore.getState().fetchAlerts();
  },

  toggleAlert: async (id) => {
    await fetch('/api/alerts/toggle', {
      method: 'PATCH',
      body: JSON.stringify({ id }),
    });
    await useAlertStore.getState().fetchAlerts();
  },

  deleteAlert: async (id) => {
    await fetch('/api/alerts/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    await useAlertStore.getState().fetchAlerts();
  },
}));
