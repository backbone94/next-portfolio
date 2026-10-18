// ask_log 표를 만든다. 접속 주소는 출력하지 않는다.
// 실행: node --env-file=.env.local db/init.mjs
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL이 없습니다. .env.local에 한 줄 넣어 주세요.');
  process.exit(1);
}

const sql = neon(url);
const statements = readFileSync(new URL('./ask_log.sql', import.meta.url), 'utf8')
  .replace(/--.*$/gm, '')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) await sql.query(statement);
const [{ count }] = await sql`select count(*)::int as count from ask_log`;
console.log(`ask_log 준비됨 (지금 ${count}건)`);
