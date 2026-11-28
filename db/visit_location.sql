-- 운영 배포 전에 적용한다. 위치 공유를 선택한 방문에만 서울 자치구 이름을 기록한다.
alter table visit_log add column if not exists shared_district text;
