// Fills dist/server/wrangler.json with the real Cloudflare names after every build.
import {readFileSync, writeFileSync} from 'node:fs';
const cfg = JSON.parse(readFileSync(new URL('./deploy.config.json', import.meta.url), 'utf8'));
const file = 'dist/server/wrangler.json';
const c = JSON.parse(readFileSync(file, 'utf8'));
c.name = cfg.workerName;
c.d1_databases[0] = {...c.d1_databases[0], database_name: cfg.databaseName, database_id: cfg.databaseId};
c.r2_buckets[0] = {...c.r2_buckets[0], bucket_name: cfg.bucketName};
if (cfg.domain) c.routes = [{pattern: cfg.domain, custom_domain: true}];
c.vars = {...c.vars, ADMIN_EMAILS: cfg.adminEmails};
// Username + password login (npm run admin:password). The password itself is never stored, only a salted hash.
if (cfg.adminUsername && cfg.adminPasswordHash && cfg.sessionSecret) Object.assign(c.vars, {ADMIN_USER: cfg.adminUsername, ADMIN_PASSWORD_HASH: cfg.adminPasswordHash, SESSION_SECRET: cfg.sessionSecret});
else console.log('Note: no admin password set yet. Run `npm run admin:password`.');
// Optional visitor numbers in the admin: the token itself is stored with `wrangler secret put CF_API_TOKEN`.
if (cfg.cloudflareZoneId) c.vars.CF_ZONE_ID = cfg.cloudflareZoneId;
// Optional extra layer: Cloudflare Access (e-mail code) in front of the admin.
if (cfg.accessTeamDomain && cfg.accessAudience) Object.assign(c.vars, {TEAM_DOMAIN: cfg.accessTeamDomain, POLICY_AUD: cfg.accessAudience});

writeFileSync(file, JSON.stringify(c, null, 2));
console.log('Deploy config ready for', cfg.workerName, cfg.domain ? '→ ' + cfg.domain : '');
