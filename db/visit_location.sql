-- 운영 배포 전에 적용한다. IP 위치에서 추정한 서울 자치구만 적는다.
alter table visit_log add column if not exists ip_district text;
