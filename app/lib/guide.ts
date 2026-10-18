/**
 * 안내 로봇(RobotGuide)에게 지금 상황을 알린다. 복사 버튼처럼 AskBox 바깥에 있는
 * 부품도 로봇에게 말을 걸 수 있게, 상태를 끌어올리지 않고 문서 이벤트 하나로 전한다.
 *
 * 문구 자체가 아니라 상황 이름을 보낸다. 상황별 문구는 GUIDE_LINES 한 곳에서 고친다.
 *
 * ms를 주면 그 시간 뒤에 원래 상황으로 돌아간다. 주지 않으면 say(null)을 부를 때까지 남는다
 * (마우스를 올린 동안만 보이는 문구).
 */
export const GUIDE_EVENT = 'guide:say';

export type GuideCue = 'hi' | 'ask' | 'typing' | 'thinking' | 'done' | 'pick' | 'oops' | 'copied' | 'pdf' | 'mail' | 'code';

/** 말풍선 문구. typing과 thinking은 뒤에 점이 하나씩 늘어난다(RobotGuide의 DOTTED). */
export const GUIDE_LINES: Record<GuideCue, string> = {
  hi: '안녕하세요!',
  ask: '궁금한 걸 물어보세요',
  typing: '듣고 있어요',
  thinking: '답을 찾는 중',
  done: '답을 찾았어요!',
  pick: '궁금한 프로젝트를 골라 보세요',
  oops: '앗, 연결이 잠시 끊겼어요',
  copied: '복사했어요!',
  pdf: '이력서 PDF를 새 탭으로 열어요',
  mail: '누르면 메일 주소를 복사해요',
  code: 'GitHub로 이동해요',
};

export type GuideMessage = { cue: GuideCue | null; ms?: number };

export function say(cue: GuideCue | null, ms?: number) {
  window.dispatchEvent(new CustomEvent<GuideMessage>(GUIDE_EVENT, { detail: { cue, ms } }));
}
