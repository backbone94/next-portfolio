import type { MediaItem } from '@/app/content/projects';

/** 답변 안에 그리는 프로젝트 한 건. 목록 줄과 카드가 같은 모양을 쓴다. */
export type AnswerProject = {
  slug: string;
  title: string;
  /** 실무 · 사이드 · 졸업작품 · 기타 */
  type: string;
  duration: string;
  summary: string;
  role?: string;
  stack?: string;
  /** 카드에만 쓴다. 대표 이미지 한 장과 시연 영상 한 편까지 */
  media?: MediaItem[];
};

/** /api/ask 응답. 직접 쓴 답변과 Claude 답변이 같은 모양으로 그려진다. */
export type AskAnswer = {
  /** prepared: 직접 쓴 답변 · claude: 사이트 내용을 근거로 한 AI 답변 · notice: 거절·제한 안내 */
  source: 'prepared' | 'claude' | 'notice';
  kind?: string;
  /** 본문 조각. cites는 sources의 인덱스다. */
  segments: { text: string; cites?: number[] }[];
  sources: { title: string; href: string; quote: string }[];
  links: { label: string; href: string }[];
  follow: string[];
  /** 복사 버튼을 붙일 값 (메일 주소 등) */
  copy?: string;
  /**
   * 본문 아래에 붙는 프로젝트. list는 한 줄에 한 건씩 촘촘하게(전체 훑기),
   * card는 화면과 함께 크게(한 건 자세히) 그린다.
   */
  projects?: { view: 'list' | 'card'; items: AnswerProject[] };
};

/**
 * AI 답을 흘려 보낼 때 /api/ask가 한 줄에 하나씩 보내는 소식(NDJSON).
 *
 * - segment: 새 조각이 시작된다. 출처가 붙는 단위다.
 * - text: 지금 조각에 글자가 이어진다.
 * - cite: 지금 조각에 출처 번호가 붙는다. 처음 나온 출처면 source가 함께 온다.
 * - done: 검사와 손질을 마친 최종 답. 화면은 이것으로 갈아 끼운다.
 */
export type AskStreamEvent =
  | { type: 'segment' }
  | { type: 'text'; text: string }
  | { type: 'cite'; index: number; source?: AskAnswer['sources'][number] }
  | { type: 'done'; answer: AskAnswer };
