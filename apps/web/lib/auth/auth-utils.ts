import crypto from 'crypto';

// Retrieve session secret from env, or fall back to a static one for dev safety
const SESSION_SECRET = process.env.SESSION_SECRET || 'g3n3r1c-s3ss10n-s3cr3t-growthmate-2026';
// Derive a 32-byte key for AES-256-CBC
const KEY = crypto.scryptSync(SESSION_SECRET, 'growthmate-salt', 32);
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Hash a password using pbkdf2
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    if (!salt || !key) {
      resolve(false);
      return;
    }
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

/**
 * Encrypt payload into a secure token string (AES-256-CBC)
 */
export function encryptSession(payload: any): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Format is iv:encryptedData
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt token string back into payload
 */
export function decryptSession(token: string): any | null {
  try {
    const [ivHex, encryptedHex] = token.split(':');
    if (!ivHex || !encryptedHex) return null;
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (err) {
    return null;
  }
}
