// ask_log·visit_log·ip_asn 표를 만든다. ip_asn의 내용은 db/load-asn.mjs가 채운다. 접속 주소는 출력하지 않는다.
// 실행: node --env-file=.env.local db/init.mjs
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL이 없습니다. .env.local에 한 줄 넣어 주세요.');
  process.exit(1);
}

const sql = neon(url);
for (const file of ['ask_log.sql', 'visit_log.sql', 'ip_asn.sql']) {
  const statements = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8')
    .replace(/--.*$/gm, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) await sql.query(statement);
}

const [{ asks }] = await sql`select count(*)::int as asks from ask_log`;
const [{ visits }] = await sql`select count(*)::int as visits from visit_log`;
console.log(`ask_log 준비됨 (지금 ${asks}건), visit_log 준비됨 (지금 ${visits}건)`);
