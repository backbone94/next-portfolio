-- IP 대역마다 그 대역을 가진 네트워크(AS). 방문 기록이 IP 원문 대신 네트워크 이름만 남기는 데 쓴다(app/lib/visit.ts).
-- 데이터는 iptoasn.com의 ip2asn-combined(퍼블릭 도메인, PDDL 1.0)다. 표만 여기서 만들고,
-- 내용은 `node --env-file=.env.local db/load-asn.mjs`로 채운다. 대역 주인은 조금씩 바뀌니 한두 달에 한 번 다시 돌린다.
-- 표가 비어 있어도 방문 기록은 그대로 남고, 네트워크 칸만 비어 있다.

create table if not exists ip_asn (
  -- 대역의 처음과 끝 주소. IPv4와 IPv6가 한 표에 있다. inet끼리 비교하면 IPv4가 IPv6보다 앞에 온다
  range_start inet primary key,
  range_end   inet not null,
  -- AS 번호와 이름 (16509 · AMAZON-02, 4766 · KIXS-AS-KR Korea Telecom)
  asn         bigint not null,
  name        text not null
);
