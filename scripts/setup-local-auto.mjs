import {spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
// Run from the project root. This script only targets the local development DB.
function run(command,args){const r=spawnSync(command,args,{stdio:['ignore','inherit','inherit']});if(r.error)throw r.error;if(r.status)process.exit(r.status)}
run('npm',['run','build']);
const built=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
mkdirSync('.sites-runtime',{recursive:true});
writeFileSync('.sites-runtime/local-db.json',JSON.stringify({name:built.name,compatibility_date:built.compatibility_date,d1_databases:built.d1_databases.map(d=>({...d,migrations_dir:resolve('drizzle')}))}));
run(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--local','--config','.sites-runtime/local-db.json','--persist-to','.wrangler/state']);
console.log('\nLocal database prepared. Run npm run dev and open http://127.0.0.1:5173');
