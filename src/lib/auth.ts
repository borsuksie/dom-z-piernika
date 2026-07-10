export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

async function sign(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Buffer.from(sig).toString('hex');
}

/** Builds a signed "expiry.signature" session token. */
export async function createSessionToken(secret: string): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_SECONDS * 1000;
  const signature = await sign(secret, String(expiry));
  return `${expiry}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifySessionToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiryStr, signature] = token.split('.');
  if (!expiryStr || !signature) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const expected = await sign(secret, expiryStr);
  return expected === signature;
}

export { SESSION_TTL_SECONDS };
