-- ask_log를 꺼내 보는 쿼리 모음. Neon SQL Editor에 붙여 넣어 하나씩 실행한다.
-- 모두 실제 사이트(production) 질문만 본다. 미리보기 배포에서 시험한 질문은 env = 'preview'로 따로 남는다.

-- 1. 지난 30일 동안 가장 많이 들어온 질문
select question, count(*) as asked, max(created_at) as last_asked
from ask_log
where env = 'production' and created_at > now() - interval '30 days'
group by question
order by asked desc
limit 50;

-- 2. Claude가 답한 질문. 자주 나오면 미리 써 둘 답의 후보다 (prepared.ts의 ROUTES)
select created_at, page, question, route, confidence, answer
from ask_log
where env = 'production' and answered_by = 'claude'
order by created_at desc
limit 100;

-- 3. 분류기가 헷갈린 질문. 확률이 낮았거나 미리 써 둔 답이 있는데도 Claude로 넘어간 경우다.
--    분류 기준 문장(ROUTES의 criteria)을 고칠 후보다.
select created_at, question, route, round(confidence::numeric, 2) as confidence, routed_by, answered_by
from ask_log
where env = 'production' and route <> 'none' and confidence is not null and confidence < 0.6
order by created_at desc
limit 100;

-- 4. 날짜별 Claude 호출 수와 토큰 합계. 비용 확인용이다.
--    캐시 쓰기는 입력의 1.25배, 캐시 읽기는 0.1배로 계산된다.
select date_trunc('day', created_at)::date as day,
       count(*) as calls,
       sum(input_tokens) as input,
       sum(cache_write) as cache_write,
       sum(cache_read) as cache_read,
       sum(output_tokens) as output
from ask_log
where env = 'production' and answered_by = 'claude'
group by day
order by day desc;

-- 5. 어디서 물었는지. 첫 화면(page가 null)과 상세 페이지별 질문 수
select coalesce(page, '(첫 화면)') as page, count(*) as asked
from ask_log
where env = 'production'
group by page
order by asked desc;

-- 6. 깨진 글자(�)가 섞인 Claude 답. broken에 그 주변 원본 조각과 글자 코드가 남는다.
--    codes에 FFFD가 있으면 API가 보낸 조각부터 깨져 있었다는 뜻이다. 미리보기 기록도 함께 본다.
select created_at, env, page, question, answer, broken
from ask_log
where answer like '%' || chr(65533) || '%' or broken is not null
order by created_at desc;

-- 7. 1년이 지난 기록 지우기. 지우면 되돌릴 수 없으니 먼저 select count(*)로 건수를 확인한다.
-- delete from ask_log where created_at < now() - interval '1 year';
