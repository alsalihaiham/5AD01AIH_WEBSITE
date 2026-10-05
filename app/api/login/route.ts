import {runtime, passwordLogin, fail, HttpError, jsonBody} from '@/lib/server';
import {verifyPassword, createSession, sessionCookie} from '@/lib/auth';

const WINDOW = 15 * 60;
const MAX_FAILS = 8;

async function bucket(req: Request) {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'local';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('login:' + ip));
  return 'login:' + Array.from(new Uint8Array(digest).slice(0, 12), b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url), env = runtime();
    const origin = req.headers.get('origin');
    if (origin && origin !== url.origin) throw new HttpError(403, 'Deze aanvraag komt niet van onze website.');
    if (!passwordLogin()) throw new HttpError(503, 'Inloggen met wachtwoord is nog niet ingesteld.');
    const key = await bucket(req), now = Math.floor(Date.now() / 1000);
    const row = await env.DB.prepare('SELECT count,expires_at FROM sell_rate_limits WHERE key=?').bind(key).first<{count: number; expires_at: number}>();
    if (row && row.expires_at > now && row.count >= MAX_FAILS) throw new HttpError(429, 'Te veel pogingen. Probeer het over een kwartier opnieuw.');
    const body = await jsonBody(req) as {username?: unknown; password?: unknown};
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password.slice(0, 200) : '';
    // Both checks always run, so a wrong username takes as long as a wrong password.
    const passwordOk = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
    const userOk = username.length > 0 && username.toLowerCase() === (env.ADMIN_USER || '').toLowerCase();
    if (!passwordOk || !userOk) {
      await env.DB.prepare('INSERT INTO sell_rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<? THEN 1 ELSE count+1 END, expires_at=CASE WHEN expires_at<? THEN ? ELSE expires_at END')
        .bind(key, now + WINDOW, now, now, now + WINDOW).run();
      throw new HttpError(401, 'Gebruikersnaam of wachtwoord klopt niet.');
    }
    await env.DB.prepare('DELETE FROM sell_rate_limits WHERE key=?').bind(key).run();
    const token = await createSession(env.ADMIN_USER!, env.SESSION_SECRET!);
    return new Response(JSON.stringify({ok: true}), {headers: {'content-type': 'application/json', 'set-cookie': sessionCookie(token, url.protocol === 'https:'), 'cache-control': 'no-store'}});
  } catch (e) {
    return fail(e);
  }
}
