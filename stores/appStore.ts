import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface MonitoredNode {
  pubkey: string;
  nickname?: string;
  addedAt: number;
  notes?: string;
}

export interface AppSettings {
  theme: Theme;
  enableAnimations: boolean;
  enableSounds: boolean;
  compactMode: boolean;
  showTestNodes: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // milliseconds
  enableExperimentalFeatures: boolean;
}

export interface NetworkStatus {
  isConnected: boolean;
  lastSync?: number;
  errorCount: number;
  currentSeedNode?: string;
}

interface AppState {
  // Settings
  settings: AppSettings;
  
  // Monitored nodes (watchlist)
  monitoredNodes: MonitoredNode[];
  
  // Network status
  networkStatus: NetworkStatus;
  
  // UI state
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  
  // Feature flags
  featureFlags: {
    enableNetworkGraph: boolean;
    enableHistoricalData: boolean;
    enableComparisonTool: boolean;
    enableRewardCalculator: boolean;
  };
  
  // Recent searches
  recentSearches: string[];
  
  // Actions - Settings
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // Actions - Monitored Nodes
  addMonitoredNode: (pubkey: string, nickname?: string, notes?: string) => void;
  removeMonitoredNode: (pubkey: string) => void;
  updateMonitoredNode: (pubkey: string, updates: Partial<Omit<MonitoredNode, 'pubkey' | 'addedAt'>>) => void;
  isNodeMonitored: (pubkey: string) => boolean;
  getMonitoredNode: (pubkey: string) => MonitoredNode | undefined;
  
  // Actions - Network Status
  setNetworkConnected: (connected: boolean) => void;
  updateLastSync: () => void;
  incrementErrorCount: () => void;
  resetErrorCount: () => void;
  setCurrentSeedNode: (seedNode: string) => void;
  
  // Actions - UI
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Actions - Recent Searches
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Helpers
  getEffectiveTheme: () => 'light' | 'dark';
}

const defaultSettings: AppSettings = {
  theme: 'system',
  enableAnimations: true,
  enableSounds: false,
  compactMode: false,
  showTestNodes: true,
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  enableExperimentalFeatures: false,
};

const defaultFeatureFlags = {
  enableNetworkGraph: true,
  enableHistoricalData: false, // Not implemented yet
  enableComparisonTool: true,
  enableRewardCalculator: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      monitoredNodes: [],
      networkStatus: {
        isConnected: true,
        errorCount: 0,
      },
      sidebarOpen: true,
      commandPaletteOpen: false,
      featureFlags: defaultFeatureFlags,
      recentSearches: [],
      
      // Settings actions
      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }));
      },
      
      toggleTheme: () => {
        set((state) => {
          const currentTheme = state.settings.theme;
          let newTheme: Theme;
          
          if (currentTheme === 'light') {
            newTheme = 'dark';
          } else if (currentTheme === 'dark') {
            newTheme = 'system';
          } else {
            newTheme = 'light';
          }
          
          return {
            settings: { ...state.settings, theme: newTheme },
          };
        });
      },
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
      
      resetSettings: () => {
        set({ settings: defaultSettings });
      },
      
      // Monitored nodes actions
      addMonitoredNode: (pubkey, nickname, notes) => {
        set((state) => {
          // Don't add if already monitored
          if (state.monitoredNodes.some((node) => node.pubkey === pubkey)) {
            return state;
          }
          
          const newNode: MonitoredNode = {
            pubkey,
            nickname,
            notes,
            addedAt: Date.now(),
          };
          
          return {
            monitoredNodes: [...state.monitoredNodes, newNode],
          };
        });
      },
      
      removeMonitoredNode: (pubkey) => {
        set((state) => ({
          monitoredNodes: state.monitoredNodes.filter(
            (node) => node.pubkey !== pubkey
          ),
        }));
      },
      
      updateMonitoredNode: (pubkey, updates) => {
        set((state) => ({
          monitoredNodes: state.monitoredNodes.map((node) =>
            node.pubkey === pubkey ? { ...node, ...updates } : node
          ),
        }));
      },
      
      isNodeMonitored: (pubkey) => {
        return get().monitoredNodes.some((node) => node.pubkey === pubkey);
      },
      
      getMonitoredNode: (pubkey) => {
        return get().monitoredNodes.find((node) => node.pubkey === pubkey);
      },
      
      // Network status actions
      setNetworkConnected: (connected) => {
        set((state) => ({
          networkStatus: { ...state.networkStatus, isConnected: connected },
        }));
      },
      
      updateLastSync: () => {
        set((state) => ({
          networkStatus: { ...state.networkStatus, lastSync: Date.now() },
        }));
      },
      
      incrementErrorCount: () => {
        set((state) => ({
          networkStatus: {
            ...state.networkStatus,
            errorCount: state.networkStatus.errorCount + 1,
          },
        }));
      },
      
      resetErrorCount: () => {
        set((state) => ({
          networkStatus: { ...state.networkStatus, errorCount: 0 },
        }));
      },
      
      setCurrentSeedNode: (seedNode) => {
        set((state) => ({
          networkStatus: { ...state.networkStatus, currentSeedNode: seedNode },
        }));
      },
      
      // UI actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },
      
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },
      
      toggleCommandPalette: () => {
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
      },
      
      setCommandPaletteOpen: (open) => {
        set({ commandPaletteOpen: open });
      },
      
      // Recent searches actions
      addRecentSearch: (query) => {
        if (!query.trim()) return;
        
        set((state) => {
          const filtered = state.recentSearches.filter((q) => q !== query);
          return {
            recentSearches: [query, ...filtered].slice(0, 10),
          };
        });
      },
      
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
      
      // Helpers
      getEffectiveTheme: () => {
        const { theme } = get().settings;
        
        if (theme === 'system') {
          // Check system preference
          if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
          }
          return 'dark'; // Default to dark if can't determine
        }
        
        return theme;
      },
    }),
    {
      name: 'xandeum-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        monitoredNodes: state.monitoredNodes,
        sidebarOpen: state.sidebarOpen,
        featureFlags: state.featureFlags,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// Keyboard shortcut handler (can be used in layout)
export const setupKeyboardShortcuts = () => {
  if (typeof window === 'undefined') return;
  
  const handleKeyPress = (e: KeyboardEvent) => {
    // Command/Ctrl + K for command palette
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      useAppStore.getState().toggleCommandPalette();
    }
    
    // Command/Ctrl + B for sidebar toggle
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      useAppStore.getState().toggleSidebar();
    }
    
    // Command/Ctrl + / for help (future)
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      // Future: Open help dialog
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
};