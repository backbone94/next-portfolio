'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { MediaItem } from '../content/projects';

type Props = {
  media: MediaItem[];
  /** 첫 화면에 보이는 캐러셀이면 true. 첫 이미지를 우선 로드한다. */
  priority?: boolean;
};

export default function ProjectMedia({ media, priority = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  /**
   * 영상은 클릭해야 로드한다. poster가 없어 자동 로드 시 검은 사각형만 보이고,
   * 일부 파일은 75MB라 첫 프레임까지 파일 전체를 받아야 한다.
   */
  const [playing, setPlaying] = useState<number[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 셀렉터 문자열 대신 엘리먼트를 넘겨 인스턴스를 이 컴포넌트에 가둔다.
    const instance = new Swiper(el, {
      modules: [Navigation, Pagination],
      navigation: {
        nextEl: el.querySelector<HTMLElement>('.swiper-button-next'),
        prevEl: el.querySelector<HTMLElement>('.swiper-button-prev'),
      },
      pagination: {
        el: el.querySelector<HTMLElement>('.swiper-pagination'),
        clickable: true,
      },
    });

    return () => instance.destroy(true, true);
  }, []);

  return (
    /*
      바깥 래퍼가 CSS 변수를 든다. .swiper에 직접 걸면 destroy(cleanStyles)가
      style 속성을 통째로 지워버려서 기본 iOS 블루로 되돌아간다.
    */
    <div
      className="mx-auto max-w-4xl"
      style={
        {
          '--swiper-theme-color': 'rgb(var(--accent))',
          '--swiper-pagination-color': 'rgb(var(--accent))',
          '--swiper-pagination-bullet-inactive-color': 'rgb(var(--text))',
          '--swiper-navigation-size': '24px',
        } as React.CSSProperties
      }
    >
      <div
        ref={containerRef}
        className="swiper relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface-2"
      >
        <div className="swiper-wrapper">
          {media.map((item, index) => (
            <div key={item.src} className="swiper-slide flex items-center justify-center">
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={450}
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority={priority && index === 0}
                  loading={priority && index === 0 ? undefined : 'lazy'}
                  className="h-full w-full object-contain"
                />
              ) : playing.includes(index) ? (
                /* eslint-disable-next-line jsx-a11y/media-has-caption */
                <video
                  src={item.src}
                  controls
                  autoPlay
                  playsInline
                  className="swiper-no-swiping h-full w-full object-contain"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying((prev) => [...prev, index])}
                  className="group flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-2"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:scale-105">
                    <svg width="18" height="18" viewBox="0 0 15 15" fill="currentColor" aria-hidden>
                      <path d="M4.5 2.8v9.4l8-4.7z" />
                    </svg>
                  </span>
                  <span className="text-sm text-muted">데모 영상 재생</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {media.length > 1 && (
          <>
            <div className="swiper-button-prev" />
            <div className="swiper-button-next" />
            <div className="swiper-pagination" />
          </>
        )}
      </div>
    </div>
  );
}
