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
// The admin only opens once Cloudflare Access is configured; without it nobody can sign in online.
if (cfg.accessTeamDomain && cfg.accessAudience) Object.assign(c.vars, {TEAM_DOMAIN: cfg.accessTeamDomain, POLICY_AUD: cfg.accessAudience});
else console.log('Note: Cloudflare Access is not configured yet, so /beheer stays closed online.');
writeFileSync(file, JSON.stringify(c, null, 2));
console.log('Deploy config ready for', cfg.workerName, cfg.domain ? '→ ' + cfg.domain : '');
