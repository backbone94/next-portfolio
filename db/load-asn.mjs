// IP 대역별 네트워크 표(ip_asn, db/ip_asn.sql)를 iptoasn.com의 최신 데이터로 채운다. 접속 주소는 출력하지 않는다.
// 실행: node --env-file=.env.local db/load-asn.mjs   (--dry-run을 붙이면 DB를 건드리지 않고 받은 데이터만 확인한다)
// 실제 일은 db/asn.mjs가 한다.
import { neon } from '@neondatabase/serverless';
import { fetchRanges, loadAsn } from './asn.mjs';

if (process.argv.includes('--dry-run')) {
  const { rows, lines } = await fetchRanges();
  console.log(`대역 ${rows.length}개 (원본 ${lines}줄). 앞의 세 개:`);
  for (const row of rows.slice(0, 3)) console.log(`  ${row.start} – ${row.end}  AS${row.asn} ${row.name}`);
  process.exit(0);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL이 없습니다. .env.local에 한 줄 넣어 주세요.');
  process.exit(1);
}

const sql = neon(url);
const { ranges } = await loadAsn(sql, { onProgress: (done, total) => process.stdout.write(`\r${done} / ${total}`) });
process.stdout.write('\n');
const [{ size }] = await sql.query(`select pg_size_pretty(pg_total_relation_size('ip_asn')) as size`);
console.log(`ip_asn 준비됨 (대역 ${ranges}개, ${size})`);
