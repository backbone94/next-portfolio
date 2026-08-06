import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = "Jun's Portfolio — 이정준";

const LABEL = "JUN'S PORTFOLIO";
const TITLE = '이정준';
const SUBTITLE = '고객과 제품, 그리고 피드백';
const STATS = 'AI Native Developer';
const DOMAIN = 'leejj.dev';
const ALL_TEXT = [LABEL, TITLE, SUBTITLE, STATS, DOMAIN].join(' ');

/**
 * Satori는 Wanted Sans TTF의 GSUB lookupType 6를 못 읽어서 렌더링이 깨진다.
 * Google Fonts CSS API에 text= 서브셋 파라미터를 주고, TTF만 내려주는
 * 구형 User-Agent(PhantomJS)로 요청해 실제 쓰는 글자만 담긴 정적 TTF를 받는다.
 */
async function loadGoogleFont(weight: number) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(ALL_TEXT)}`;
  const css = await (
    await fetch(cssUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.7 Safari/534.34',
      },
    })
  ).text();

  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`Noto Sans KR ${weight} 폰트 URL을 찾지 못함`);

  const res = await fetch(fontUrl);
  return res.arrayBuffer();
}

export default async function Image() {
  const [regular, semibold, black] = await Promise.all([
    loadGoogleFont(400),
    loadGoogleFont(600),
    loadGoogleFont(900),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#131210',
          color: '#F7F4EF',
          fontFamily: 'Noto Sans KR',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', background: '#FFB224' }} />
          <div
            style={{
              fontSize: '22px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              color: '#AAA49C',
            }}
          >
            {LABEL}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', fontSize: '104px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            {TITLE}
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: '920px',
              fontSize: '32px',
              fontWeight: 400,
              lineHeight: 1.45,
              color: '#AAA49C',
            }}
          >
            {SUBTITLE}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #3E3933',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '26px', fontWeight: 600, color: '#F7F4EF' }}>{STATS}</div>
          <div style={{ display: 'flex', fontSize: '26px', fontWeight: 600, color: '#FFB224' }}>{DOMAIN}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto Sans KR', data: regular, weight: 400, style: 'normal' },
        { name: 'Noto Sans KR', data: semibold, weight: 600, style: 'normal' },
        { name: 'Noto Sans KR', data: black, weight: 900, style: 'normal' },
      ],
    },
  );
}
