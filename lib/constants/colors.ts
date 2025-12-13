/**
 * Xandeum brand colors
 * Using the exact colors specified in the design system
 */

export const COLORS = {
  // Primary brand colors
  blue: '#2596be',
  teal: '#0f9c84',
  purple: '#7c2b6d',
  orange: '#c6731d',
  navy: '#09103a',
  
  // Dark mode variants
  tealDark: '#0f9982',
  purpleDark: '#872f77',
  orangeDark: '#cc761e',
  
  // Status colors
  online: '#0f9c84',
  offline: '#7c2b6d',
  warning: '#cc761e',
  success: '#0f9c84',
  error: '#872f77',
  info: '#2596be',
} as const;

/**
 * HSL color values for CSS custom properties
 * Format: "H S% L%"
 */
export const HSL_COLORS = {
  // Light mode
  light: {
    blue: '197 66% 43%',
    teal: '173 89% 34%',
    purple: '318 46% 31%',
    orange: '25 77% 45%',
    navy: '225 60% 15%',
  },
  
  // Dark mode
  dark: {
    blue: '197 66% 43%',
    teal: '173 89% 35%',
    purple: '321 48% 35%',
    orange: '30 78% 46%',
    navy: '225 60% 15%',
  },
} as const;

/**
 * Chart colors in order of usage
 */
export const CHART_COLORS = [
  COLORS.blue,
  COLORS.teal,
  COLORS.purple,
  COLORS.orange,
  COLORS.navy,
] as const;

/**
 * Health score color mapping
 */
export const HEALTH_COLORS = {
  excellent: COLORS.teal, // 90-100
  good: COLORS.blue, // 70-89
  fair: COLORS.orange, // 50-69
  poor: COLORS.purple, // 0-49
} as const;

/**
 * Status badge color mapping
 */
export const STATUS_COLORS = {
  online: COLORS.online,
  offline: COLORS.offline,
  degraded: COLORS.warning,
  unknown: '#6c757d',
} as const;

/**
 * Priority color mapping for alerts
 */
export const PRIORITY_COLORS = {
  low: '#6c757d',
  medium: COLORS.blue,
  high: COLORS.orange,
  critical: COLORS.error,
} as const;

/**
 * Version status colors
 */
export const VERSION_COLORS = {
  latest: COLORS.success,
  outdated: COLORS.warning,
  deprecated: COLORS.error,
} as const;

/**
 * Gradient definitions
 */
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.blue} 100%)`,
  secondary: `linear-gradient(135deg, ${COLORS.purple} 0%, ${COLORS.orange} 100%)`,
  health: `linear-gradient(90deg, ${COLORS.error} 0%, ${COLORS.warning} 50%, ${COLORS.success} 100%)`,
  mesh: `
    radial-gradient(at 0% 0%, ${COLORS.blue}15 0px, transparent 50%),
    radial-gradient(at 100% 0%, ${COLORS.teal}15 0px, transparent 50%),
    radial-gradient(at 100% 100%, ${COLORS.purple}15 0px, transparent 50%),
    radial-gradient(at 0% 100%, ${COLORS.orange}15 0px, transparent 50%)
  `,
} as const;

/**
 * Opacity levels
 */
export const OPACITY = {
  disabled: 0.5,
  hover: 0.8,
  pressed: 0.6,
  subtle: 0.1,
  medium: 0.3,
  strong: 0.7,
} as const;

/**
 * Box shadow definitions
 */
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: `0 0 20px ${COLORS.teal}50`,
  glowBlue: `0 0 20px ${COLORS.blue}50`,
} as const;

/**
 * Color utility functions
 */
export const colorUtils = {
  /**
   * Convert hex to RGB
   */
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },
  
  /**
   * Add alpha channel to hex color
   */
  hexWithAlpha: (hex: string, alpha: number): string => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  },
  
  /**
   * Get health color based on score
   */
  getHealthColor: (score: number): string => {
    if (score >= 90) return HEALTH_COLORS.excellent;
    if (score >= 70) return HEALTH_COLORS.good;
    if (score >= 50) return HEALTH_COLORS.fair;
    return HEALTH_COLORS.poor;
  },
  
  /**
   * Get status color
   */
  getStatusColor: (status: 'online' | 'offline' | 'degraded' | 'unknown'): string => {
    return STATUS_COLORS[status];
  },
};