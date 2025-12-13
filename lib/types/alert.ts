/**
 * Alert trigger types
 */
export type AlertTrigger =
  | 'node_offline'
  | 'node_online'
  | 'storage_threshold'
  | 'version_mismatch'
  | 'uptime_drop'
  | 'credit_penalty'
  | 'heartbeat_failure'
  | 'network_degraded'
  | 'custom';

/**
 * Alert action types
 */
export type AlertAction =
  | 'browser_notification'
  | 'email'
  | 'discord_webhook'
  | 'telegram_bot'
  | 'custom_webhook';

/**
 * Alert scope
 */
export type AlertScope = 'all_nodes' | 'monitored_nodes' | 'specific_node' | 'network';

/**
 * Alert status
 */
export type AlertStatus = 'active' | 'paused' | 'triggered' | 'error';

/**
 * Alert priority
 */
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Alert condition operators
 */
export type AlertOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'contains' | 'not_contains';

/**
 * Alert condition
 */
export interface AlertCondition {
  field: string;
  operator: AlertOperator;
  value: number | string | boolean;
  unit?: string;
}

/**
 * Alert configuration
 */
export interface Alert {
  id: string;
  name: string;
  description?: string;
  
  // Simple single-value fields for component compatibility
  condition: string; // e.g., "health_score < 80", "storage > 90%"
  severity: 'low' | 'medium' | 'high' | 'critical';
  threshold: number;
  channel: 'email' | 'discord' | 'telegram' | 'browser';
  enabled: boolean;
  
  // Legacy fields for backward compatibility
  trigger?: AlertTrigger;
  actions?: AlertAction[];
  scope?: AlertScope;
  priority: AlertPriority;
  status?: AlertStatus;
  
  // Scope-specific
  monitoredNodes?: string[]; // pubkeys
  specificNode?: string; // pubkey
  
  // Trigger conditions (optional, for advanced use)
  conditions?: AlertCondition[];
  
  // Additional trigger-specific settings
  settings?: {
    storageThresholdPercent?: number;
    uptimeThresholdPercent?: number;
    targetVersion?: string;
    consecutiveFailures?: number;
    customExpression?: string;
  };
  
  // Rate limiting
  cooldownMinutes?: number;
  maxTriggersPerHour?: number;
  
  // Scheduling
  schedule?: {
    enabled: boolean;
    startTime?: string; // "HH:mm"
    endTime?: string; // "HH:mm"
    daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
    timezone?: string;
  };
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
  lastTriggered?: number;
  triggerCount: number;
  
  // Tags for organization
  tags?: string[];
}

/**
 * Notification channel configuration
 */
export interface NotificationChannel {
  type: AlertAction;
  enabled: boolean;
  verified?: boolean;
  
  config?: {
    // Email
    email?: string;
    emailSubjectPrefix?: string;
    
    // Discord
    discordWebhookUrl?: string;
    discordUsername?: string;
    discordAvatarUrl?: string;
    
    // Telegram
    telegramBotToken?: string;
    telegramChatId?: string;
    
    // Custom webhook
    webhookUrl?: string;
    webhookMethod?: 'POST' | 'GET' | 'PUT';
    webhookHeaders?: Record<string, string>;
    webhookBodyTemplate?: string;
  };
  
  // Rate limiting
  maxNotificationsPerHour?: number;
  
  // Retry settings
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Notification instance
 */
export interface Notification {
  id: string;
  alertId: string;
  alertName: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: AlertPriority;
  
  // Context
  context?: {
    pubkey?: string;
    nodeName?: string;
    oldValue?: any;
    newValue?: any;
    details?: Record<string, any>;
  };
  
  // Actions taken
  actionsTaken?: {
    type: AlertAction;
    success: boolean;
    error?: string;
    timestamp: number;
  }[];
}

/**
 * Alert template for quick setup
 */
export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  category: 'node' | 'network' | 'storage' | 'performance';
  trigger: AlertTrigger;
  defaultActions: AlertAction[];
  defaultPriority: AlertPriority;
  defaultConditions?: AlertCondition[];
  defaultSettings?: Alert['settings'];
  icon?: string;
}

/**
 * Alert history entry
 */
export interface AlertHistoryEntry {
  id: string;
  alertId: string;
  alertName: string;
  triggeredAt: number;
  resolvedAt?: number;
  duration?: number;
  context: Notification['context'];
  actionsTaken: Notification['actionsTaken'];
}

/**
 * Alert statistics
 */
export interface AlertStats {
  totalAlerts: number;
  activeAlerts: number;
  pausedAlerts: number;
  totalTriggers24h: number;
  totalTriggers7d: number;
  totalTriggers30d: number;
  mostTriggeredAlert?: {
    id: string;
    name: string;
    count: number;
  };
  triggersByPriority: Record<AlertPriority, number>;
}

/**
 * Alert rule evaluation result
 */
export interface AlertEvaluationResult {
  alertId: string;
  shouldTrigger: boolean;
  conditions: {
    condition: AlertCondition;
    met: boolean;
    actualValue: any;
  }[];
  timestamp: number;
}