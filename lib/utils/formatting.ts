import { formatDistanceToNow, format, parseISO } from 'date-fns';

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number, decimals: number = 1): string {
  if (num < 1000) return formatNumber(num, decimals);
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (tier === 0) return formatNumber(num, decimals);
  
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  
  return `${formatNumber(scaled, decimals)}${suffix}`;
}

/**
 * Format seconds to human-readable duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}

/**
 * Format uptime percentage
 */
export function formatUptime(uptime: number, total: number = 86400): string {
  const percentage = (uptime / total) * 100;
  return formatPercentage(percentage, 2);
}

/**
 * Format Unix timestamp to date string
 */
export function formatDate(timestamp: number, formatStr: string = 'PPpp'): string {
  return format(new Date(timestamp * 1000), formatStr);
}

/**
 * Format Unix timestamp to relative time (e.g., "2 minutes ago")
 */
export function formatTimeAgo(timestamp: number): string {
  try {
    return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

/**
 * Format ISO date string to readable format
 */
export function formatISODate(isoString: string, formatStr: string = 'PPpp'): string {
  try {
    return format(parseISO(isoString), formatStr);
  } catch {
    return isoString;
  }
}

/**
 * Format pubkey to shortened version
 */
export function formatPubkey(pubkey: string, chars: number = 4): string {
  if (pubkey.length <= chars * 2) return pubkey;
  return `${pubkey.slice(0, chars)}...${pubkey.slice(-chars)}`;
}

/**
 * Format IP address with port
 */
export function formatAddress(address: string): { ip: string; port: string } {
  const [ip, port] = address.split(':');
  return { ip: ip || address, port: port || '' };
}

/**
 * Format storage range
 */
export function formatStorageRange(min: number, max: number): string {
  return `${formatPercentage(min, 0)} - ${formatPercentage(max, 0)}`;
}

/**
 * Format credits with commas
 */
export function formatCredits(credits: number): string {
  return formatNumber(credits, 0);
}

/**
 * Format multiplier (e.g., 16x, 1.5x)
 */
export function formatMultiplier(multiplier: number, decimals: number = 1): string {
  return `${formatNumber(multiplier, decimals)}x`;
}

/**
 * Format version string (remove leading v if present)
 */
export function formatVersion(version: string): string {
  return version.replace(/^v/, '');
}

/**
 * Format health score with emoji
 */
export function formatHealthScore(score: number): string {
  let emoji = '🔴';
  if (score >= 90) emoji = '🟢';
  else if (score >= 70) emoji = '🟡';
  else if (score >= 50) emoji = '🟠';
  
  return `${emoji} ${formatNumber(score, 0)}`;
}

/**
 * Format boolean as Yes/No
 */
export function formatBoolean(value: boolean): string {
  return value ? 'Yes' : 'No';
}

/**
 * Format array as comma-separated list
 */
export function formatList(items: string[], max: number = 3): string {
  if (items.length === 0) return 'None';
  if (items.length <= max) return items.join(', ');
  
  const visible = items.slice(0, max);
  const remaining = items.length - max;
  return `${visible.join(', ')} +${remaining} more`;
}

/**
 * Format currency (XAND tokens)
 */
export function formatCurrency(amount: number, symbol: string = 'XAND'): string {
  return `${formatNumber(amount, 2)} ${symbol}`;
}

/**
 * Format latency
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.floor(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Pluralize word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? singular : pluralForm;
}

/**
 * Format file size range
 */
export function formatSizeRange(min: number, max: number): string {
  return `${formatBytes(min)} - ${formatBytes(max)}`;
}