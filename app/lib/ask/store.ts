import { neon } from '@neondatabase/serverless';
import { waitUntil } from '@vercel/functions';
import type { BrokenText } from './claude';
import type { RouteDecision } from './router';
import type { AskAnswer } from './types';

/**
 * 질문 기록. 들어온 질문을 Neon Postgres의 ask_log 표에 한 줄씩 남긴다(표는 db/ask_log.sql).
 *
 * 쓰는 곳은 셋이다. Claude로 자주 넘어가는 질문을 찾아 직접 답을 써 두고, 실제 질문으로
 * 답변 품질을 시험하고, 분류기가 헷갈린 질문으로 분류 기준을 고친다.
 *
 * - 답을 먼저 보내고 기록은 그 뒤에 한다. 기록이 느리거나 실패해도 방문자는 기다리지 않는다.
 *   Vercel 함수는 응답을 보내면 멈출 수 있어서 waitUntil로 기록이 끝날 때까지 붙잡아 둔다.
 * - 테스트 모드(ASK_DRY_RUN=1)이거나 접속 주소가 없으면 남기지 않는다. 화면을 시험한 질문이
 *   실제 기록에 섞이지 않게 한다.
 * - IP는 남기지 않는다.
 */

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

/** broken: 답에 깨진 글자가 섞였을 때만 붙는 원본 조각(claude.ts의 findBroken) */
export type Usage = { model: string; input: number; cacheRead: number; cacheWrite: number; output: number; broken?: BrokenText };

export type AskRecord = {
  question: string;
  /** 상세 페이지 옆 대화창이면 그 프로젝트 slug */
  page?: string;
  route: string;
  decision?: RouteDecision;
  answer: AskAnswer;
  usage?: Usage;
};

export function recordAsk({ question, page, route, decision, answer, usage }: AskRecord) {
  if (!sql || process.env.ASK_DRY_RUN === '1') return;
  const text = answer.source === 'claude' ? answer.segments.map((s) => s.text).join('') : null;
  const write = sql`
    insert into ask_log (env, question, page, route, confidence, off_topic, routed_by, answered_by, answer,
      model, input_tokens, cache_read, cache_write, output_tokens, broken)
    values (${process.env.VERCEL_ENV ?? 'development'}, ${question}, ${page ?? null}, ${route},
      ${decision?.confidence ?? null}, ${decision?.offTopic ?? null}, ${decision?.by ?? null}, ${answer.source}, ${text},
      ${usage?.model ?? null}, ${usage?.input ?? null}, ${usage?.cacheRead ?? null}, ${usage?.cacheWrite ?? null}, ${usage?.output ?? null},
      ${usage?.broken ? JSON.stringify(usage.broken) : null}::jsonb)
  `.then(
    () => undefined,
    (error) => console.warn('[ask] 질문 기록 실패', error instanceof Error ? error.message : error),
  );
  waitUntil(write);
}
