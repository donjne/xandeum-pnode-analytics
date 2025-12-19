import crypto from 'crypto';

export function generateToken() {
  return crypto.randomBytes(6).toString('hex'); // 12 chars
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
