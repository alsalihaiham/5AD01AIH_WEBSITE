// Username + password login for the admin. Pure Web Crypto, so it runs on Cloudflare Workers and in Node tests.
// Passwords are never stored: only a salted PBKDF2 hash. Sessions are HMAC-signed cookies that expire.
export const COOKIE = 'hp_admin';
export const SESSION_SECONDS = 12 * 60 * 60;
// Workers cap PBKDF2 at 100,000 iterations.
export const ITERATIONS = 100_000;

const enc = new TextEncoder();
const b64 = (bytes: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt, iterations}, key, 256));
}
function same(a: Uint8Array, b: Uint8Array) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

/** Format: pbkdf2.<iterations>.<salt>.<hash> (no `$`, so it is safe inside .env files). */
export async function hashPassword(password: string, iterations = ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
  return `pbkdf2.${iterations}.${b64(salt)}.${b64(await derive(password, salt, iterations))}`;
}

export async function verifyPassword(password: string, stored: string | undefined) {
  const [scheme, iter, salt, hash] = (stored || '').split('.');
  const iterations = Number(iter);
  // Always burn the same work, even when nothing is configured, so timing reveals nothing.
  const fallback = scheme !== 'pbkdf2' || !Number.isInteger(iterations) || iterations < 1000 || iterations > ITERATIONS || !salt || !hash;
  const actual = await derive(password, fallback ? new Uint8Array(16) : unb64(salt), fallback ? ITERATIONS : iterations);
  return !fallback && same(actual, unb64(hash));
}

async function hmacKey(secret: string, usage: 'sign' | 'verify') {
  return crypto.subtle.importKey('raw', enc.encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, [usage]);
}

export async function createSession(username: string, secret: string, now = Date.now()) {
  const body = b64(enc.encode(JSON.stringify({u: username, exp: Math.floor(now / 1000) + SESSION_SECONDS})));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret, 'sign'), enc.encode(body));
  return body + '.' + b64(sig);
}

/** Returns the username when the cookie is genuine and not expired, otherwise null. */
export async function readSession(token: string | undefined | null, secret: string | undefined, now = Date.now()) {
  try {
    if (!token || !secret || secret.length < 32) return null;
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret, 'verify'), unb64(sig), enc.encode(body));
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(unb64(body)));
    return typeof data.u === 'string' && typeof data.exp === 'number' && data.exp > Math.floor(now / 1000) ? data.u as string : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (token: string, secure: boolean) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_SECONDS}${secure ? '; Secure' : ''}`;
export const clearCookie = (secure: boolean) => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`;
export const cookieValue = (header: string | null, name = COOKIE) => (header || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'))?.[1];
