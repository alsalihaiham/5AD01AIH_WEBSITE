import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync, createSign} from 'node:crypto';
import {verifyAccessToken} from '../lib/access.ts';

const TEAM = 'hp-test.cloudflareaccess.com', AUD = 'aud-123';
const {publicKey, privateKey} = generateKeyPairSync('rsa', {modulusLength: 2048});
const other = generateKeyPairSync('rsa', {modulusLength: 2048});
const b64 = v => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
const sign = (claims, key = privateKey, header = {alg: 'RS256', kid: 'k1'}) => {
  const body = b64(header) + '.' + b64(claims);
  const sig = createSign('RSA-SHA256').update(body).sign(key).toString('base64url');
  return body + '.' + sig;
};
const now = Math.floor(Date.now() / 1000);
const good = {iss: 'https://' + TEAM, aud: [AUD], exp: now + 600, email: 'Automotive@HP-Company.be'};
globalThis.fetch = async () => Response.json({keys: [{...publicKey.export({format: 'jwk'}), kid: 'k1'}]});

test('a token signed by Cloudflare is accepted and the e-mail is normalised', async () => {
  assert.equal(await verifyAccessToken(sign(good), TEAM, AUD), 'automotive@hp-company.be');
  assert.equal(await verifyAccessToken(sign(good), 'https://' + TEAM + '/', AUD), 'automotive@hp-company.be');
});
test('forged, expired or foreign tokens are rejected', async () => {
  assert.equal(await verifyAccessToken(sign(good, other.privateKey), TEAM, AUD), null, 'wrong signature');
  assert.equal(await verifyAccessToken(sign({...good, exp: now - 5}), TEAM, AUD), null, 'expired');
  assert.equal(await verifyAccessToken(sign({...good, aud: ['other']}), TEAM, AUD), null, 'wrong application');
  assert.equal(await verifyAccessToken(sign({...good, iss: 'https://evil.example'}), TEAM, AUD), null, 'wrong issuer');
  assert.equal(await verifyAccessToken(sign(good, privateKey, {alg: 'none', kid: 'k1'}), TEAM, AUD), null, 'wrong algorithm');
  assert.equal(await verifyAccessToken(sign(good, privateKey, {alg: 'RS256', kid: 'zzz'}), TEAM, AUD), null, 'unknown key');
  assert.equal(await verifyAccessToken('not.a.jwt', TEAM, AUD), null);
  assert.equal(await verifyAccessToken(undefined, TEAM, AUD), null);
});
