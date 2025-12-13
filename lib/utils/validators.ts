import { PATTERNS } from '@/lib/constants/config';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate Solana pubkey format
 */
export function validatePubkey(pubkey: string): ValidationResult {
  if (!pubkey || typeof pubkey !== 'string') {
    return { valid: false, error: 'Public key is required' };
  }
  
  if (!PATTERNS.pubkey.test(pubkey)) {
    return {
      valid: false,
      error: 'Invalid public key format (must be 32-44 characters, base58)',
    };
  }
  
  return { valid: true };
}

/**
 * Validate IPv4 address
 */
export function validateIPv4(ip: string): ValidationResult {
  if (!ip || typeof ip !== 'string') {
    return { valid: false, error: 'IP address is required' };
  }
  
  if (!PATTERNS.ipv4.test(ip)) {
    return { valid: false, error: 'Invalid IPv4 address format' };
  }
  
  // Check each octet is 0-255
  const octets = ip.split('.').map(Number);
  if (octets.some((octet) => octet < 0 || octet > 255)) {
    return { valid: false, error: 'IP address octets must be between 0-255' };
  }
  
  return { valid: true };
}

/**
 * Validate port number
 */
export function validatePort(port: number | string): ValidationResult {
  const portNum = typeof port === 'string' ? parseInt(port, 10) : port;
  
  if (isNaN(portNum)) {
    return { valid: false, error: 'Port must be a number' };
  }
  
  if (portNum < 1 || portNum > 65535) {
    return { valid: false, error: 'Port must be between 1-65535' };
  }
  
  return { valid: true };
}

/**
 * Validate version string
 */
export function validateVersion(version: string): ValidationResult {
  if (!version || typeof version !== 'string') {
    return { valid: false, error: 'Version is required' };
  }
  
  const cleaned = version.replace(/^v/, '');
  
  if (!PATTERNS.version.test(cleaned)) {
    return { valid: false, error: 'Invalid version format (e.g., 0.7.3)' };
  }
  
  return { valid: true };
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!PATTERNS.email.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

/**
 * Validate URL
 */
export function validateUrl(url: string, protocols: string[] = ['http', 'https']): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
  
  try {
    const urlObj = new URL(url);
    
    if (!protocols.includes(urlObj.protocol.replace(':', ''))) {
      return {
        valid: false,
        error: `URL must use one of: ${protocols.join(', ')}`,
      };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate webhook URL
 */
export function validateWebhookUrl(url: string): ValidationResult {
  const urlValidation = validateUrl(url);
  if (!urlValidation.valid) return urlValidation;
  
  try {
    const urlObj = new URL(url);
    
    // Check for Discord webhook
    if (url.includes('discord.com/api/webhooks/')) {
      if (!urlObj.pathname.startsWith('/api/webhooks/')) {
        return { valid: false, error: 'Invalid Discord webhook URL' };
      }
    }
    
    // Check for Slack webhook
    if (url.includes('hooks.slack.com')) {
      if (!urlObj.pathname.startsWith('/services/')) {
        return { valid: false, error: 'Invalid Slack webhook URL' };
      }
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid webhook URL' };
  }
}

/**
 * Validate percentage (0-100)
 */
export function validatePercentage(value: number): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: 'Value must be a number' };
  }
  
  if (value < 0 || value > 100) {
    return { valid: false, error: 'Percentage must be between 0-100' };
  }
  
  return { valid: true };
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: number, fieldName: string = 'Value'): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  
  if (value <= 0) {
    return { valid: false, error: `${fieldName} must be positive` };
  }
  
  return { valid: true };
}

/**
 * Validate number range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  
  if (value < min || value > max) {
    return { valid: false, error: `${fieldName} must be between ${min}-${max}` };
  }
  
  return { valid: true };
}

/**
 * Validate string length
 */
export function validateStringLength(
  str: string,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  if (!str || typeof str !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (str.length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters`,
    };
  }
  
  if (str.length > max) {
    return {
      valid: false,
      error: `${fieldName} must be no more than ${max} characters`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, error: `${fieldName} cannot be empty` };
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { valid: false, error: `${fieldName} must have at least one item` };
  }
  
  return { valid: true };
}

/**
 * Validate array length
 */
export function validateArrayLength(
  arr: any[],
  min: number,
  max: number,
  fieldName: string = 'Array'
): ValidationResult {
  if (!Array.isArray(arr)) {
    return { valid: false, error: `${fieldName} must be an array` };
  }
  
  if (arr.length < min) {
    return {
      valid: false,
      error: `${fieldName} must have at least ${min} items`,
    };
  }
  
  if (arr.length > max) {
    return {
      valid: false,
      error: `${fieldName} must have no more than ${max} items`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate JSON string
 */
export function validateJSON(str: string): ValidationResult {
  if (!str || typeof str !== 'string') {
    return { valid: false, error: 'JSON string is required' };
  }
  
  try {
    JSON.parse(str);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid JSON format' };
  }
}

/**
 * Sanitize string (remove dangerous characters)
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize user input
 */
export function validateAndSanitize(
  value: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    fieldName?: string;
  } = {}
): { valid: boolean; value: string; error?: string } {
  const { required = false, minLength = 0, maxLength = 1000, fieldName = 'Field' } = options;
  
  // Check required
  if (required) {
    const requiredCheck = validateRequired(value, fieldName);
    if (!requiredCheck.valid) {
      return { valid: false, value: '', error: requiredCheck.error };
    }
  }
  
  // Sanitize
  const sanitized = sanitizeString(value);
  
  // Check length
  const lengthCheck = validateStringLength(sanitized, minLength, maxLength, fieldName);
  if (!lengthCheck.valid) {
    return { valid: false, value: sanitized, error: lengthCheck.error };
  }
  
  return { valid: true, value: sanitized };
}

/**
 * Combine multiple validation results
 */
export function combineValidations(...results: ValidationResult[]): ValidationResult {
  const errors = results.filter((r) => !r.valid).map((r) => r.error);
  
  if (errors.length > 0) {
    return { valid: false, error: errors.join(', ') };
  }
  
  return { valid: true };
}