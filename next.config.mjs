/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
    옛 포트폴리오 화면은 다른 포트폴리오 사이트와 생김새가 거의 같아 내렸다.
    내용은 첫 화면의 대화가 대신 보여 준다. 이미 퍼진 링크와 검색 결과로
    들어와도 옛 화면이 보이지 않게 대화 화면으로 넘긴다.
    프로젝트 상세(/projects/[slug])는 근거 자료라 남긴다.

    permanent: true(308). 새 구조로 확정해서 영구 넘김으로 바꿨다(2026-10-18). 검색엔진이
    옛 주소의 색인을 새 주소로 옮긴다. 308은 브라우저가 오래 기억하므로, 옛 주소를 다시 살릴
    일이 생기면 방문자 브라우저에서는 한동안 풀리지 않는다는 점을 알고 바꾼다.
  */
  async redirects() {
    return [
      { source: '/portfolio', destination: '/', permanent: true },
      // 포트폴리오 사이트 자체는 프로젝트 목록에서 뺐다. 지금 사이트는 방문자가 이미 쓰고 있고,
      // 어떻게 만들었는지는 "이 사이트는 어떻게 만들었어요?"에 직접 써 둔 답이 맡는다.
      { source: '/projects/portfolio-original', destination: '/', permanent: true },
      { source: '/projects/portfolio-nextjs', destination: '/', permanent: true },
      {
        source: '/projects',
        destination: `/?q=${encodeURIComponent(encodeURIComponent('프로젝트 전부 보여 주세요'))}`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
