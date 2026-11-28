-- 방문별 행동을 누적 스냅샷으로 저장한다. 요청이 순서를 바꿔 도착해도 최신 상태를 유지한다.
create table if not exists visit_behavior (
  env text not null,
  view_id uuid not null,
  session_id uuid not null,
  step integer not null,
  revision integer not null,
  path text not null,
  viewport text not null check (viewport in ('narrow', 'wide')),
  scroll_depth smallint not null check (scroll_depth between 0 and 100),
  events jsonb not null,
  created_at timestamptz not null default now(),
  primary key (env, view_id)
);

create index if not exists visit_behavior_recent_idx on visit_behavior (env, created_at desc);
create index if not exists visit_behavior_page_idx on visit_behavior (env, path, viewport, created_at desc);
create index if not exists visit_behavior_session_idx on visit_behavior (env, session_id, step);
