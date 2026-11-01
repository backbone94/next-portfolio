-- 검색창에 들어온 질문 기록. app/lib/ask/store.ts가 질문 한 건마다 한 줄을 쓴다.
-- IP는 남기지 않는다. 처음 한 번 Neon SQL Editor에서 실행하거나 `node --env-file=.env.local db/init.mjs`로 만든다.

create table if not exists ask_log (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  -- production · preview · development. 분석할 때는 production만 본다
  env           text not null,
  question      text not null,
  -- 상세 페이지 옆 대화창에서 왔으면 그 프로젝트 slug, 첫 화면이면 null
  page          text,
  -- 어느 답으로 보냈는지 (best, career, none, starter:the1seoul:hard …)
  route         text,
  confidence    real,
  off_topic     real,
  -- jev · keyword · button(버튼 문장이라 Jev 없이 키워드 규칙으로 고름). 분류기를 거치지 않은 경우(미리 써 둔 프로젝트 답 등)는 null
  routed_by     text,
  -- prepared · claude · notice
  answered_by   text not null,
  -- Claude가 답한 경우에만 본문을 남긴다. 미리 써 둔 답은 route로 다시 만들 수 있다
  answer        text,
  model         text,
  input_tokens  integer,
  cache_read    integer,
  cache_write   integer,
  output_tokens integer,
  -- Claude 답에 깨진 글자(U+FFFD)가 섞였을 때만 그 주변 원본 조각을 남긴다 (claude.ts의 findBroken)
  broken        jsonb,
  -- 질문한 방문자. 방문 기록(visit_log.visitor)과 같은 값이라 어떤 페이지를 보고 물었는지 이어 볼 수 있다.
  -- 사이트 주인의 질문은 기록하지 않으므로 늘 채워진다. 이 칸을 더하기 전의 질문만 null이다
  visitor       text
);

-- 표를 먼저 만든 뒤에 추가한 칸. 이미 만든 표에도 붙도록 따로 둔다
alter table ask_log add column if not exists broken jsonb;
alter table ask_log add column if not exists visitor text;

create index if not exists ask_log_created_at on ask_log (created_at desc);
