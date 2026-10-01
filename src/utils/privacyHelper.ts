/**
 * Utility for masking sensitive UPI identifiers and phone numbers on screen
 * e.g. "8144389665@ptsbi" -> "81******65@ptsbi"
 */
export function maskUpiId(rawUpi: string): string {
  if (!rawUpi) return 'Verified Author UPI';

  const parts = rawUpi.split('@');
  if (parts.length !== 2) {
    if (rawUpi.length <= 4) return '****';
    return rawUpi.slice(0, 2) + '******' + rawUpi.slice(-2);
  }

  const [handle, provider] = parts;
  if (handle.length <= 4) {
    return `${handle.slice(0, 1)}***@${provider}`;
  }

  const first2 = handle.slice(0, 2);
  const last2 = handle.slice(-2);
  return `${first2}******${last2}@${provider}`;
}
