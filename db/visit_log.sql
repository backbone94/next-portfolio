-- 페이지 방문 기록. middleware.ts가 첫 화면과 프로젝트 상세를 열 때마다 한 줄을 쓴다(app/lib/visit.ts).
-- IP·쿠키·User-Agent 원문은 남기지 않는다. 처음 한 번 Neon SQL Editor에서 실행하거나 `node --env-file=.env.local db/init.mjs`로 만든다.

create table if not exists visit_log (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  -- production · preview · development. 분석할 때는 production만 본다
  env         text not null,
  -- 연 주소의 경로만 (/, /projects/the1seoul). 질문(?q=)은 ask_log에 따로 남으니 붙이지 않는다
  path        text not null,
  -- 다른 사이트에서 왔을 때만 그 도메인 (www.google.com). 주소를 직접 쳤거나 사이트 안에서 옮겨 다니면 null
  referrer    text,
  -- Vercel이 붙여 주는 위치 헤더. 국가는 두 글자 코드(KR), 도시는 영문 이름이다
  country     text,
  city        text,
  -- mobile · tablet · desktop
  device      text,
  -- 같은 날 같은 방문자를 묶는 익명 값. IP와 User-Agent를 그날의 날짜와 비밀값으로 해시한 앞 16자리다.
  -- 날이 바뀌면 값이 달라져 며칠에 걸쳐 한 사람을 따라갈 수 없고, 원래 IP로 되돌릴 수도 없다
  visitor     text not null
);

create index if not exists visit_log_created_at on visit_log (created_at desc);
