-- 기존 운영 DB는 배포 전에 Neon SQL Editor에서 이 파일을 실행한다.
alter table visit_log add column if not exists is_bot boolean not null default false;

create index if not exists visit_log_env_visitor_at on visit_log (env, visitor, created_at desc);
create index if not exists ask_log_env_visitor_at on ask_log (env, visitor, created_at desc);

-- 관리자가 등록한 네트워크의 HMAC만 저장한다. IP 주소 원문은 쓰지 않는다.
create table if not exists owner_networks (
  env         text not null,
  fingerprint text not null,
  primary key (env, fingerprint)
);
