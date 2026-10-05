// Verifies the signed login token that Cloudflare Access adds to every request it lets through.
// Identity headers sent by a browser are never trusted; only a valid signature from Cloudflare counts.
type Jwk = JsonWebKey & {kid?: string};
let cache: {team: string; at: number; keys: Jwk[]} | null = null;

const decode = (part: string) => Uint8Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const json = (part: string) => JSON.parse(new TextDecoder().decode(decode(part)));
export const normaliseTeam = (team: string) => team.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

async function keys(team: string): Promise<Jwk[]> {
  if (cache && cache.team === team && Date.now() - cache.at < 10 * 60_000) return cache.keys;
  const response = await fetch(`https://${team}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error('Access keys unavailable');
  const data = await response.json() as {keys: Jwk[]};
  cache = {team, at: Date.now(), keys: data.keys};
  return data.keys;
}

/** Returns the verified, lower-cased e-mail address from an Access token, or null when anything is wrong. */
export async function verifyAccessToken(token: string | null | undefined, teamDomain: string, audience: string): Promise<string | null> {
  try {
    const parts = token?.split('.');
    if (!parts || parts.length !== 3) return null;
    const team = normaliseTeam(teamDomain);
    const header = json(parts[0]), payload = json(parts[1]);
    if (header.alg !== 'RS256') return null;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now || (typeof payload.nbf === 'number' && payload.nbf > now + 60)) return null;
    if (payload.iss !== `https://${team}`) return null;
    const aud: string[] = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!aud.includes(audience)) return null;
    const jwk = (await keys(team)).find(k => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'}, false, ['verify']);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    return valid && typeof payload.email === 'string' ? payload.email.toLowerCase() : null;
  } catch {
    return null;
  }
}
