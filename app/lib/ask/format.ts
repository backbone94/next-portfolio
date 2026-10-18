import type { AskAnswer, AskStreamEvent } from './types';

/**
 * AI 답에 지시를 어기고 섞여 들어온 마크다운을 걷어 낸다. 화면은 빈 줄(문단)과 "- "(목록)만 그린다.
 * 출처 조각마다 따로 돌기 때문에, 조각 경계에 걸친 기호도 각 조각에서 지워진다.
 * 흘려 보내는 도중에도 화면이 매번 다시 돌린다. 반쯤 온 기호는 다음 글자가 오면 지워진다.
 */
function plain(text: string) {
  return text
    // 출처 표시용 내부 태그가 글자로 새어 나오는 경우가 있다(Sonnet 5.5 비교 시험에서 본 `</ cite> (cite index="6-9">`).
    // 출처 번호는 API가 따로 알려 주므로 태그 조각은 통째로 지운다. 지운 자리에 남는 겹친 공백도 하나로 줄인다.
    .replace(/<\/?\s*cite\b[^>]*>/gi, '')
    .replace(/[(<]?\s*cite\s+index\s*=\s*"[^"]*"\s*>?/gi, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\*\*|__/g, '') // 굵은 글씨
    .replace(/^#{1,6}\s+/gm, '') // 제목
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크는 글자만 남긴다. 주소는 지어낸 것일 수 있다
    .replace(/^\s*(?:[*•]|\d+[.)])\s+/gm, '- '); // 다른 목록 기호는 "- "로 맞춘다
}

export function cleanSegments(segments: AskAnswer['segments']): AskAnswer['segments'] {
  const out: AskAnswer['segments'] = [];
  for (const segment of segments) {
    // 조각이 줄 중간에서 시작하면 그 첫머리는 줄 첫머리가 아니다. 목록·제목 규칙이 잘못 걸리지 않게 막아 둔다.
    const midLine = out.length > 0 && !out[out.length - 1].text.endsWith('\n');
    out.push({ ...segment, text: midLine ? plain('' + segment.text).slice(1) : plain(segment.text) });
  }
  return out;
}

/** 흘러오는 소식을 받아 쓰는 중인 답(draft)에 반영한다. 글은 손질 전 그대로 쌓는다. */
export function applyStreamEvent(draft: AskAnswer, event: Exclude<AskStreamEvent, { type: 'done' }>) {
  const current = draft.segments[draft.segments.length - 1];
  if (event.type === 'segment') draft.segments.push({ text: '', cites: [] });
  else if (event.type === 'text' && current) current.text += event.text;
  else if (event.type === 'cite' && current) {
    if (event.source) draft.sources[event.index] = event.source;
    current.cites = [...(current.cites ?? []), event.index];
  }
}

/**
 * 답 글의 짜임을 읽는 규칙. 화면(AskBox)과 "답변 복사"가 같은 규칙을 쓴다.
 *
 * - 빈 줄이 문단을 끊는다.
 * - "- "로 시작하는 줄이 이어지면 목록 하나다.
 * - 그 밖의 줄은 이어 붙여 문단 하나로 본다.
 */
export type Block = { kind: 'para'; text: string } | { kind: 'list'; items: string[] };

export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let para: Extract<Block, { kind: 'para' }> | null = null;
  let list: Extract<Block, { kind: 'list' }> | null = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) {
      para = list = null;
      continue;
    }
    if (line.startsWith('- ')) {
      para = null;
      if (!list) blocks.push((list = { kind: 'list', items: [] }));
      list.items.push(line.slice(2));
    } else {
      list = null;
      if (!para) blocks.push((para = { kind: 'para', text: '' }));
      para.text += (para.text ? ' ' : '') + line;
    }
  }
  return blocks;
}

/* ── 답변 복사 ── */

/**
 * 붙여 넣는 곳에 따라 두 가지를 함께 넣는다. 메모장·슬랙 입력창처럼 글자만 받는 곳에는
 * 마크다운이, 노션·구글 문서처럼 서식을 받는 곳에는 HTML이 붙는다. 화면에 보이는 것을
 * 빠짐없이 옮긴다: 굵은 결론, 문단과 목록, 출처 번호와 출처 목록, 프로젝트, 링크.
 * 사이트 안 주소는 붙여 넣은 곳에서도 열리게 전체 주소로 바꾼다.
 */
/** prefix는 링크 바깥 앞에 붙는다. 출처 번호를 링크 글자 안에 넣으면 대괄호가 겹쳐 마크다운 링크가 깨진다. */
type Link = { label: string; url: string; note?: string; prefix?: string };

function parts(answer: AskAnswer, origin: string) {
  const abs = (href: string) => (href.startsWith('/') ? `${origin}${href}` : href);
  // 출처 번호는 그 조각이 끝나는 자리에 [n]으로 붙인다. 화면과 같은 자리다.
  const text = answer.segments.map((s) => s.text + (s.cites ?? []).map((c) => `[${c + 1}]`).join('')).join('');
  const blocks = toBlocks(text);

  const projects: Link[] = (answer.projects?.items ?? []).map((p) => ({
    label: p.title,
    url: abs(`/projects/${p.slug}`),
    note:
      answer.projects?.view === 'card'
        ? [`기간 ${p.duration}`, p.role && `역할 ${p.role}`, p.stack && `스택 ${p.stack}`].filter(Boolean).join(', ')
        : `${p.summary} (${p.type}, ${p.duration})`,
  }));
  const links: Link[] = answer.links.map((l) => ({ label: l.label, url: abs(l.href) }));
  const sources: Link[] = answer.sources.map((s, i) => ({ prefix: `[${i + 1}] `, label: s.title, url: abs(s.href) }));
  return { blocks, lead: blocks.length > 1, projects, links, sources };
}

export function answerToMarkdown(answer: AskAnswer, origin: string) {
  const { blocks, lead, projects, links, sources } = parts(answer, origin);
  const out = blocks.map((b, i) =>
    b.kind === 'list' ? b.items.map((item) => `- ${item}`).join('\n') : i === 0 && lead ? `**${b.text}**` : b.text,
  );
  const linkList = (items: Link[]) => items.map((l) => `- ${l.prefix ?? ""}[${l.label}](${l.url})${l.note ? `: ${l.note}` : ''}`).join('\n');
  if (projects.length) out.push(linkList(projects));
  if (links.length) out.push(linkList(links));
  if (sources.length) out.push(`출처\n${linkList(sources)}`);
  return out.join('\n\n');
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function answerToHtml(answer: AskAnswer, origin: string) {
  const { blocks, lead, projects, links, sources } = parts(answer, origin);
  const out = blocks.map((b, i) =>
    b.kind === 'list'
      ? `<ul>${b.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
      : `<p>${i === 0 && lead ? `<strong>${esc(b.text)}</strong>` : esc(b.text)}</p>`,
  );
  const linkList = (items: Link[]) =>
    `<ul>${items.map((l) => `<li>${esc(l.prefix ?? "")}<a href="${esc(l.url)}">${esc(l.label)}</a>${l.note ? `: ${esc(l.note)}` : ''}</li>`).join('')}</ul>`;
  if (projects.length) out.push(linkList(projects));
  if (links.length) out.push(linkList(links));
  if (sources.length) out.push(`<p>출처</p>${linkList(sources)}`);
  return out.join('');
}
