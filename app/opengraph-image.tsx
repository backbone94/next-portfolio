import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = "Jun's Portfolio: 이정준에게 무엇이든 물어보세요";

/*
  공유 카드는 첫 화면을 줄여 놓은 모습이다. 인사, 질문 상자, 주소.
  링크를 받은 사람이 눌러 보기 전에 "물어보는 사이트"라는 걸 알 수 있게 한다.
*/
const LABEL = "Jun's Portfolio";
const TITLE = '안녕하세요, 이정준입니다.';
const SUBTITLE = '무엇이든 물어보세요.';
const PLACEHOLDER = '가장 자신 있는 프로젝트는?';
const DOMAIN = 'leejj.dev';
const ALL_TEXT = [LABEL, TITLE, SUBTITLE, PLACEHOLDER, DOMAIN].join(' ');

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
          padding: '72px 80px',
          background: '#F6F7F9',
          color: '#0A0C12',
          fontFamily: 'Noto Sans KR',
        }}
      >
        <div style={{ display: 'flex', fontSize: '26px', fontWeight: 600, color: '#545B6A' }}>{LABEL}</div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: '76px', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.03em' }}>{TITLE}</div>
          <div style={{ display: 'flex', fontSize: '76px', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.03em', color: '#1E3AFF' }}>
            {SUBTITLE}
          </div>

          {/* 첫 화면의 입력창. 글자는 예시 질문, 오른쪽 끝은 보내기 버튼 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '48px',
              padding: '0 14px 0 36px',
              height: '96px',
              
              border: '2px solid #0A0C12',
              background: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 400, color: '#545B6A' }}>{PLACEHOLDER}</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '68px',
                height: '68px',
                
                background: '#1E3AFF',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '26px', fontWeight: 600, color: '#1E3AFF' }}>{DOMAIN}</div>
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
