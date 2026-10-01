/**
 * SecurityShield Utility
 * Provides client-side defense against Cross-Site Scripting (XSS),
 * input tampering, payload injection, and rapid bot spam.
 */

// Basic HTML entity encoding to prevent XSS in text rendering
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Validates text length and character limits for public reader input
 */
export function validateSafeComment(comment: string): { isValid: boolean; sanitized: string; error?: string } {
  const trimmed = comment.trim();
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Comment cannot be empty.' };
  }
  if (trimmed.length > 800) {
    return { isValid: false, sanitized: '', error: 'Comment exceeds 800 characters limit.' };
  }

  // Check for malicious script patterns
  if (/<script|eval\(|document\.cookie|<iframe/i.test(trimmed)) {
    return { isValid: false, sanitized: '', error: 'Invalid or prohibited characters detected.' };
  }

  return { isValid: true, sanitized: sanitizeInput(trimmed) };
}

/**
 * In-memory client rate limiter to protect buttons (passes, voting, tips) from bot flooding
 */
const rateLimitMap = new Map<string, number>();

export function isActionAllowed(actionKey: string, cooldownMs = 1500): boolean {
  const now = Date.now();
  const lastTime = rateLimitMap.get(actionKey) || 0;
  if (now - lastTime < cooldownMs) {
    return false; // Action throttled
  }
  rateLimitMap.set(actionKey, now);
  return true;
}
