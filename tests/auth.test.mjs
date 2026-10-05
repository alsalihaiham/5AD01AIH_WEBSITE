import test from 'node:test';
import assert from 'node:assert/strict';
import {hashPassword, verifyPassword, createSession, readSession, SESSION_SECONDS} from '../lib/auth.ts';

const SECRET = 'x'.repeat(40);

test('a password only verifies against its own hash', async () => {
  const hash = await hashPassword('correct horse battery staple');
  assert.match(hash, /^pbkdf2\.100000\.[\w-]+\.[\w-]+$/);
  assert.equal(await verifyPassword('correct horse battery staple', hash), true);
  assert.equal(await verifyPassword('wrong password', hash), false);
  assert.equal(await verifyPassword('', hash), false);
});
test('hashes are salted and malformed or missing hashes never verify', async () => {
  assert.notEqual(await hashPassword('same'), await hashPassword('same'));
  for (const bad of [undefined, '', 'nope', 'pbkdf2.5.a.b', 'pbkdf2.999999999.a.b', 'plain.100000.a.b']) assert.equal(await verifyPassword('same', bad), false);
});
test('sessions round-trip and reject tampering, wrong secrets and expiry', async () => {
  const token = await createSession('hp-admin', SECRET);
  assert.equal(await readSession(token, SECRET), 'hp-admin');
  const [body, sig] = token.split('.');
  const forged = Buffer.from(JSON.stringify({u: 'root', exp: 9999999999})).toString('base64url');
  assert.equal(await readSession(forged + '.' + sig, SECRET), null, 'edited payload');
  assert.equal(await readSession(body + '.' + sig.slice(0, -2) + 'AA', SECRET), null, 'edited signature');
  assert.equal(await readSession(token, 'y'.repeat(40)), null, 'wrong secret');
  assert.equal(await readSession(token, 'short'), null, 'weak secret refused');
  assert.equal(await readSession(token, SECRET, Date.now() + (SESSION_SECONDS + 5) * 1000), null, 'expired');
  for (const junk of [undefined, '', 'abc', 'a.b', '.']) assert.equal(await readSession(junk, SECRET), null);
});
