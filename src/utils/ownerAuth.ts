import { UserAccount } from '../types/auth';

export const OWNER_EMAIL = 'biswaranjanmohapatra2000@gmail.com';
export const VALID_OWNER_KEYS = ['owner2000', '8144389665'];

const OWNER_STORAGE_KEY = 'novelrealm_owner_verified';

/**
 * Checks whether the current session is authenticated as the platform owner (Biswaranjan Mohapatra).
 * Returns true ONLY if:
 * 1. The user is logged in with biswaranjanmohapatra2000@gmail.com
 * 2. OR the owner entered the valid owner passkey on this browser.
 */
export function checkIsOwner(currentUser?: UserAccount | null): boolean {
  if (currentUser?.email && currentUser.email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase()) {
    return true;
  }

  try {
    const isStored = localStorage.getItem(OWNER_STORAGE_KEY);
    return isStored === 'true';
  } catch {
    return false;
  }
}

/**
 * Validates the secret passkey for the owner.
 */
export function verifyOwnerPasskey(passkey: string): boolean {
  const cleanKey = passkey.trim().toLowerCase();
  const isValid = VALID_OWNER_KEYS.some((k) => k.toLowerCase() === cleanKey);

  if (isValid) {
    try {
      localStorage.setItem(OWNER_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    return true;
  }
  return false;
}

/**
 * Revokes the owner verification state.
 */
export function revokeOwnerVerification(): void {
  try {
    localStorage.removeItem(OWNER_STORAGE_KEY);
  } catch {
    // ignore
  }
}
