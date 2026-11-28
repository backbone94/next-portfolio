'use client';

import { useEffect, useState } from 'react';
import type { BehaviorEvent } from '@/app/lib/behavior';

const LABEL = { click: '클릭', move: '마우스 이동', scroll: '스크롤' };

export default function Replay({ events }: { events: BehaviorEvent[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = events.length - 1;

  useEffect(() => {
    if (!playing || index >= last) return;
    const timer = window.setTimeout(() => {
      setIndex(index + 1);
      if (index + 1 === last) setPlaying(false);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [index, last, playing]);

  if (last < 0) return <p className="text-sm text-muted">이 페이지에서 기록한 클릭, 스크롤, 마우스 이동이 없습니다.</p>;
  const [second, kind, x, y] = events[index];
  const points = events.slice(Math.max(0, index - 12), index + 1);
  const scroll = events.slice(0, index + 1).findLast((event) => event[1] === 'scroll');

  return (
    <div className="max-w-2xl rounded-xl border bg-surface-2 p-4 sm:p-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border" style={{
        backgroundImage: 'linear-gradient(to right, rgb(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border)) 1px, transparent 1px)',
        backgroundSize: '10% 10%',
      }}>
        {scroll && <div aria-hidden className="absolute inset-x-0 top-0 border-b-2 border-dashed border-accent bg-accent/10" style={{ height: `${scroll[3]}%` }} />}
        {points.map(([, type, left, top], i) => type === 'scroll' ? null : (
          <span key={i} aria-hidden className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ${type === 'click' ? 'size-3 ring-2 ring-accent/40' : 'size-2'}`} style={{ left: `${left}%`, top: `${top}%`, opacity: 0.25 + 0.75 * (i + 1) / points.length }} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" disabled={last === 0} className="rounded-md border px-3 py-2 font-medium hover:text-accent disabled:opacity-50" onClick={() => {
          if (!playing && index === last) setIndex(0);
          setPlaying(!playing);
        }}>
          {playing ? '일시정지' : '재생'}
        </button>
        <input aria-label="기록 순서" className="min-w-28 flex-1 accent-accent" type="range" min={0} max={last} value={index} disabled={last === 0} onChange={(event) => {
          setPlaying(false);
          setIndex(Number(event.target.value));
        }} />
        <span className="tabular-nums text-muted">{index + 1}/{events.length}</span>
      </div>
      <p className="mt-3 text-sm tabular-nums text-muted">
        {second}초, {LABEL[kind]}{kind === 'scroll' ? ` 깊이 ${y}%` : ` 가로 ${x}%, 세로 ${y}%`}
      </p>
    </div>
  );
}
