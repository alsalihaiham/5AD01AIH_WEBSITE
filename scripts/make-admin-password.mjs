// Run with: npm run admin:password
// Asks for a username and password, then stores only a salted hash (never the password itself).
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {randomBytes, webcrypto} from 'node:crypto';
import readline from 'node:readline';

const ITERATIONS = 100_000;
const b64 = bytes => Buffer.from(bytes).toString('base64url');

const tty = !!process.stdin.isTTY;
const rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: tty});
let muted = false;
if (tty) rl._writeToOutput = text => { if (!muted || text.includes('\n') || text.includes('\r')) rl.output.write(text); };
const lines = [];
let waiting = null;
if (!tty) { rl.on('line', line => { if (waiting) { const w = waiting; waiting = null; w(line); } else lines.push(line); }); }
function ask(question, hidden = false) {
  process.stdout.write(question);
  if (tty) return new Promise(resolve => { muted = hidden; rl.question('', answer => { muted = false; if (hidden) process.stdout.write('\n'); resolve(answer); }); });
  return new Promise(resolve => { if (lines.length) resolve(lines.shift()); else waiting = resolve; });
}
async function hash(password) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await webcrypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS}, key, 256);
  return `pbkdf2.${ITERATIONS}.${b64(salt)}.${b64(new Uint8Array(bits))}`;
}

const username = (await ask('Kies een gebruikersnaam: ')).trim();
if (!/^[\w.@-]{3,60}$/.test(username)) { console.error('\nGebruik 3 tot 60 tekens: letters, cijfers en . _ - @'); process.exit(1); }
const password = await ask('Kies een wachtwoord (minstens 12 tekens): ', true);
if (password.length < 12) { console.error('\nDat wachtwoord is te kort. Gebruik minstens 12 tekens, bv. drie woorden aan elkaar.'); process.exit(1); }
const again = await ask('Typ het wachtwoord nog eens: ', true);
if (again !== password) { console.error('\nDe wachtwoorden zijn niet gelijk. Probeer opnieuw.'); process.exit(1); }

const passwordHash = await hash(password);
const config = new URL('./deploy.config.json', import.meta.url);
const current = existsSync(config) ? JSON.parse(readFileSync(config, 'utf8')) : {};
// A fresh secret on every run, so a password change also signs out every open session.
const secret = randomBytes(32).toString('base64url');
Object.assign(current, {adminUsername: username, adminPasswordHash: passwordHash, sessionSecret: secret, accessTeamDomain: '', accessAudience: ''});
writeFileSync(config, JSON.stringify(current, null, 2) + '\n');

// The same values for running on your own computer.
const dev = new URL('../.dev.vars', import.meta.url);
const keep = (existsSync(dev) ? readFileSync(dev, 'utf8').split('\n') : []).filter(l => l.trim() && !/^(ADMIN_USER|ADMIN_PASSWORD_HASH|SESSION_SECRET)=/.test(l));
writeFileSync(dev, [...keep, `ADMIN_USER=${username}`, `ADMIN_PASSWORD_HASH=${passwordHash}`, `SESSION_SECRET=${secret}`].join('\n') + '\n');

rl.close();
console.log(`\n✔ Klaar. Gebruikersnaam: ${username}\n  Het wachtwoord zelf wordt nergens bewaard, alleen een versleutelde vingerafdruk.\n  Zet nu de site online met: npm run deploy`);
