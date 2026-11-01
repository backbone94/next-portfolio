// IP 대역별 네트워크 표(ip_asn, db/ip_asn.sql)를 iptoasn.com의 최신 데이터로 다시 채운다.
// 명령줄(db/load-asn.mjs)과 관리자 화면의 "지금 갱신" 버튼(app/admin/network/route.ts)이 같이 쓴다.
//
// 새 표(ip_asn_new)를 다 채운 뒤에 한 번에 바꿔 끼우므로, 도는 동안에도 방문 기록은 예전 표로 네트워크를 찾는다.
// 중간에 끊겨도 예전 표는 그대로다. 내려받은 파일은 디스크에 남기지 않는다.
// 다 바꿔 끼우면 표 설명(comment)에 갱신 시각을 적는다. 관리자 화면이 이 값으로 마지막 갱신 날짜를 보여 준다.
import { gunzipSync } from 'node:zlib';

const SOURCE = 'https://iptoasn.com/data/ip2asn-combined.tsv.gz';
// 한 번에 보내는 대역 수. 관리자 화면 버튼은 60초 안에 끝나야 해서(app/admin/network/route.ts) DB 왕복을 20번 안쪽으로 줄인다
const BATCH = 25000;

/** 받은 파일을 대역 목록으로 정리한다. DB는 건드리지 않는다 */
export async function fetchRanges() {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`내려받기 실패: ${response.status}`);
  const lines = gunzipSync(Buffer.from(await response.arrayBuffer())).toString('utf8').split('\n');

  // 한 줄은 "처음 끝 AS번호 국가 이름"이다. AS 번호 0은 아무도 쓰지 않는 대역이라 뺀다.
  // 같은 AS의 대역이 이어지면 하나로 합친다. 사이에 쓰지 않는 대역만 있으면 그 대역에서는 접속이 올 수 없으니 함께 합친다.
  // 받은 값은 믿지 않는다. 주소 모양과 AS 번호를 확인하고, 이름은 길이를 자른다. 주소가 맞는지는 DB가 inet으로 바꾸며 한 번 더 본다
  const ADDRESS = /^[0-9a-f.:]{2,39}$/i;
  const rows = [];
  for (const line of lines) {
    const [start, end, asText, , name = ''] = line.split('\t');
    if (!start || !end || !ADDRESS.test(start) || !ADDRESS.test(end)) continue;
    const asn = Number(asText);
    if (!Number.isInteger(asn) || asn <= 0 || asn > 4294967295) continue;
    const last = rows.at(-1);
    if (last && last.asn === asn && last.start.includes(':') === start.includes(':')) {
      last.end = end;
      continue;
    }
    rows.push({ start, end, asn, name: name.trim().slice(0, 200) || `AS${asn}` });
  }
  if (rows.length < 100000) throw new Error(`대역이 ${rows.length}개뿐입니다. 받은 파일이 잘못된 것 같아 표를 바꾸지 않습니다.`);
  return { rows, lines: lines.length };
}

/**
 * 표를 새 데이터로 바꾼다. sql은 @neondatabase/serverless의 neon()이다.
 * onProgress(채운 수, 전체 수)는 명령줄에서 진행 상황을 찍는 데 쓴다.
 */
export async function loadAsn(sql, { onProgress } = {}) {
  const { rows } = await fetchRanges();

  await sql.query('drop table if exists ip_asn_new');
  // 기본 키(인덱스)는 다 채운 뒤에 만든다. 한 줄씩 인덱스를 고치며 넣는 것보다 한 번에 만드는 쪽이 훨씬 빠르다
  await sql.query(`create table ip_asn_new (
    range_start inet not null,
    range_end   inet not null,
    asn         bigint not null,
    name        text not null
  )`);
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    await sql.query(
      `insert into ip_asn_new (range_start, range_end, asn, name)
       select * from unnest($1::inet[], $2::inet[], $3::bigint[], $4::text[])`,
      [batch.map((r) => r.start), batch.map((r) => r.end), batch.map((r) => r.asn), batch.map((r) => r.name)],
    );
    onProgress?.(Math.min(i + BATCH, rows.length), rows.length);
  }
  await sql.query('alter table ip_asn_new add constraint ip_asn_new_pkey primary key (range_start)');

  const refreshedAt = new Date().toISOString();
  await sql.transaction([
    sql.query('drop table if exists ip_asn'),
    sql.query('alter table ip_asn_new rename to ip_asn'),
    sql.query('alter index ip_asn_new_pkey rename to ip_asn_pkey'),
    // comment 문은 값을 매개변수로 받지 못한다. ISO 시각은 숫자와 -:.TZ만 있어 따옴표가 섞일 일이 없다
    sql.query(`comment on table ip_asn is 'refreshed ${refreshedAt}'`),
  ]);
  return { ranges: rows.length, refreshedAt };
}
