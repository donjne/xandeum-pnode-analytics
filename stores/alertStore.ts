import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Alert, type AlertAction } from '@/lib/types/alert';

// Re-export types for backward compatibility
export type { Alert, AlertAction };

export type AlertStatus = 'active' | 'paused' | 'triggered';

export interface NotificationChannel {
  type: AlertAction;
  enabled: boolean;
  config?: {
    email?: string;
    discordWebhookUrl?: string;
    telegramBotToken?: string;
    telegramChatId?: string;
  };
}

interface AlertState {
  // Alerts
  alerts: Alert[];
  
  // Notification channels
  channels: NotificationChannel[];
  
  // UI state
  isNotificationPermissionGranted: boolean;
  recentNotifications: Array<{
    id: string;
    alertId: string;
    message: string;
    timestamp: number;
    read: boolean;
  }>;
  
  // Actions
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  toggleAlertStatus: (id: string) => void;
  triggerAlert: (id: string) => void;
  
  // Channel actions
  updateChannel: (type: AlertAction, updates: Partial<NotificationChannel>) => void;
  enableChannel: (type: AlertAction) => void;
  disableChannel: (type: AlertAction) => void;
  
  // Notification actions
  addNotification: (alertId: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
  
  // Permission
  requestNotificationPermission: () => Promise<boolean>;
  setNotificationPermission: (granted: boolean) => void;
  
  // Helpers
  getAlertsByStatus: (status: AlertStatus) => Alert[];
  getActiveAlerts: () => Alert[];
  isAlertTriggerable: (id: string) => boolean;
}

const initialChannels: NotificationChannel[] = [
  { type: 'browser_notification', enabled: false },
  { type: 'email', enabled: false },
  { type: 'discord_webhook', enabled: false },
  { type: 'telegram_bot', enabled: false },
];

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      channels: initialChannels,
      isNotificationPermissionGranted: false,
      recentNotifications: [],
      
      createAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          triggerCount: 0,
          // Ensure required fields have defaults
          condition: alert.condition || 'node_offline',
          severity: alert.severity || 'medium',
          threshold: alert.threshold || 0,
          channel: alert.channel || 'email',
          enabled: alert.enabled ?? true,
          priority: alert.priority || 'medium',
        };
        set((state) => ({
          alerts: [...state.alerts, newAlert],
        }));
      },
      
      updateAlert: (id, updates) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        }));
      },
      
      deleteAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
          recentNotifications: state.recentNotifications.filter(
            (notif) => notif.alertId !== id
          ),
        }));
      },
      
      toggleAlertStatus: (id) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id
              ? {
                  ...alert,
                  status: alert.status === 'active' ? 'paused' : 'active',
                }
              : alert
          ),
        }));
      },
      
      triggerAlert: (id) => {
        const now = Date.now();
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id
              ? {
                  ...alert,
                  status: 'triggered' as AlertStatus,
                  lastTriggered: now,
                  triggerCount: alert.triggerCount + 1,
                }
              : alert
          ),
        }));
        
        // Reset status back to active after 5 seconds
        setTimeout(() => {
          set((state) => ({
            alerts: state.alerts.map((alert) =>
              alert.id === id && alert.status === 'triggered'
                ? { ...alert, status: 'active' as AlertStatus }
                : alert
            ),
          }));
        }, 5000);
      },
      
      updateChannel: (type, updates) => {
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.type === type ? { ...channel, ...updates } : channel
          ),
        }));
      },
      
      enableChannel: (type) => {
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.type === type ? { ...channel, enabled: true } : channel
          ),
        }));
      },
      
      disableChannel: (type) => {
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.type === type ? { ...channel, enabled: false } : channel
          ),
        }));
      },
      
      addNotification: (alertId, message) => {
        const notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          alertId,
          message,
          timestamp: Date.now(),
          read: false,
        };
        set((state) => ({
          recentNotifications: [notification, ...state.recentNotifications].slice(0, 50),
        }));
      },
      
      markNotificationAsRead: (id) => {
        set((state) => ({
          recentNotifications: state.recentNotifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        }));
      },
      
      markAllNotificationsAsRead: () => {
        set((state) => ({
          recentNotifications: state.recentNotifications.map((notif) => ({
            ...notif,
            read: true,
          })),
        }));
      },
      
      clearNotifications: () => {
        set({ recentNotifications: [] });
      },
      
      getUnreadCount: () => {
        return get().recentNotifications.filter((notif) => !notif.read).length;
      },
      
      requestNotificationPermission: async () => {
        if (!('Notification' in window)) {
          return false;
        }
        
        if (Notification.permission === 'granted') {
          set({ isNotificationPermissionGranted: true });
          return true;
        }
        
        if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          const granted = permission === 'granted';
          set({ isNotificationPermissionGranted: granted });
          return granted;
        }
        
        return false;
      },
      
      setNotificationPermission: (granted) => {
        set({ isNotificationPermissionGranted: granted });
      },
      
      getAlertsByStatus: (status) => {
        return get().alerts.filter((alert) => alert.status === status);
      },
      
      getActiveAlerts: () => {
        return get().alerts.filter((alert) => alert.status === 'active');
      },
      
      isAlertTriggerable: (id) => {
        const alert = get().alerts.find((a) => a.id === id);
        if (!alert || alert.status !== 'active') return false;
        
        // Rate limiting: don't trigger same alert within 5 minutes
        if (alert.lastTriggered) {
          const timeSinceLastTrigger = Date.now() - alert.lastTriggered;
          if (timeSinceLastTrigger < 5 * 60 * 1000) {
            return false;
          }
        }
        
        return true;
      },
    }),
    {
      name: 'xandeum-alert-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        alerts: state.alerts,
        channels: state.channels,
        isNotificationPermissionGranted: state.isNotificationPermissionGranted,
      }),
    }
  )
);