/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  name: 'Xandeum pNode Analytics',
  description: 'Advanced analytics and monitoring platform for Xandeum pNodes',
  version: '1.0.0',
  author: 'Xandeum Community',
  repository: 'https://github.com/xandeum/pnode-analytics',
  documentation: 'https://docs.xandeum.network',
} as const;

/**
 * Network configuration
 */
export const NETWORK_CONFIG = {
  // Seed nodes for initial connection
  seedNodes: [
    { ip: process.env.NEXT_PUBLIC_SEED_PNODE_IP || '109.199.96.218', port: 6000 },
  ],
  
  // Default RPC port for pNodes
  defaultRpcPort: 6000,
  
  // Default gossip port
  defaultGossipPort: 9001,
  
  // Atlas coordination port
  atlasPort: 5000,
  
  // Stats dashboard port
  statsPort: 80,
  
  // WebSocket port (if different from RPC)
  wsPort: 6001,
} as const;

/**
 * Timing configuration
 */
export const TIMING_CONFIG = {
  // How often to poll for pNode updates (milliseconds)
  defaultPollInterval: parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '30000', 10),
  
  // Heartbeat interval (matches pNode heartbeat)
  heartbeatInterval: parseInt(process.env.NEXT_PUBLIC_HEARTBEAT_INTERVAL || '30000', 10),
  
  // Consider node offline after this many seconds
  offlineThreshold: 120, // 2 minutes
  
  // Debounce delay for search inputs
  searchDebounceDelay: 300,
  
  // Debounce delay for filter changes
  filterDebounceDelay: 500,
  
  // Animation duration for charts
  chartAnimationDuration: 750,
  
  // Toast notification duration
  toastDuration: 5000,
  
  // Alert cooldown (minimum time between same alert)
  alertCooldown: 300000, // 5 minutes
} as const;

/**
 * Data thresholds
 */
export const THRESHOLDS = {
  // Health score thresholds
  health: {
    excellent: 90,
    good: 70,
    fair: 50,
    // Below 50 is poor
  },
  
  // Storage utilization warnings
  storage: {
    low: 5, // Below 5% is concerning
    high: 90, // Above 90% is concerning
    critical: 95, // Above 95% is critical
  },
  
  // Uptime for "perfect uptime" badge
  perfectUptime: 86400, // 24 hours
  
  // Version adoption rate (percentage)
  goodAdoptionRate: 80,
  
  // Network health thresholds
  network: {
    healthy: 85,
    degraded: 70,
    // Below 70 is critical
  },
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 100,
} as const;

/**
 * Chart configuration
 */
export const CHART_CONFIG = {
  defaultHeight: 300,
  defaultWidth: '100%',
  
  colors: {
    primary: 'hsl(var(--xandeum-blue))',
    secondary: 'hsl(var(--xandeum-teal))',
    tertiary: 'hsl(var(--xandeum-purple))',
    quaternary: 'hsl(var(--xandeum-orange))',
    quinary: 'hsl(var(--xandeum-navy))',
  },
  
  gridColor: 'hsl(var(--border))',
  textColor: 'hsl(var(--foreground))',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Rate limiting
  maxRequestsPerMinute: 60,
} as const;

/**
 * Storage keys for localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  theme: 'xandeum-theme',
  filters: 'xandeum-filters',
  alerts: 'xandeum-alerts',
  settings: 'xandeum-settings',
  monitoredNodes: 'xandeum-monitored-nodes',
  recentSearches: 'xandeum-recent-searches',
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  enableWebSocket: false, // WebSocket not implemented on pNode side yet
  enableHistoricalData: false, // Requires backend implementation
  enableExport: true,
  enableAlerts: true,
  enableComparison: true,
  enableRewardCalculator: true,
  enableNetworkGraph: true,
} as const;

/**
 * URL routes
 */
export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  explorer: '/explorer',
  pnodeDetail: (pubkey: string) => `/explorer/${pubkey}`,
  analytics: '/analytics',
  alerts: '/alerts',
  calculator: '/tools/calculator',
  compare: '/tools/compare',
} as const;

/**
 * External links
 */
export const EXTERNAL_LINKS = {
  discord: 'https://discord.gg/uqRSmmM5m',
  documentation: 'https://docs.xandeum.network',
  website: 'https://xandeum.network',
  github: 'https://github.com/xandeum',
  twitter: 'https://twitter.com/xandeum',
} as const;

/**
 * Latest version (for comparison)
 */
export const LATEST_VERSION = '0.7.3' as const;

/**
 * Regex patterns
 */
export const PATTERNS = {
  pubkey: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  version: /^\d+\.\d+\.\d+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;