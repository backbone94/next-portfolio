/**
 * 이력서 PDF 생성기.
 *
 *   node scripts/build-resume.mjs
 *
 * 결과물은 public/resume.pdf 이고 사이트의 "이력서 PDF" 버튼이 이 경로를 가리킨다.
 * 한글 글리프가 필요해 Windows 기본 폰트(맑은 고딕)를 임베드한다.
 *
 * 내용은 여기에 직접 적는다. app/content/projects.ts와 app/content/career.ts를
 * 고치면 이 파일도 같이 손봐야 한다 — 사실이 어긋나면 이력서가 틀린 말을 한다.
 */
import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

const FONT_REGULAR = 'C:/Windows/Fonts/malgun.ttf';
const FONT_BOLD = 'C:/Windows/Fonts/malgunbd.ttf';
const OUT = path.join(process.cwd(), 'public', 'resume.pdf');

const INK = '#1A1815';
const MUTED = '#6B655C';
const ACCENT = '#924D04'; // 사이트 라이트 테마 악센트(--accent: 146 77 4)와 동일
const RULE = '#DCD6CC';

const profile = {
  name: '이정준',
  title: 'AI Native Developer',
  contacts: ['backbone94@naver.com', '010-9287-1684', 'github.com/backbone94'],
  summary:
    'Angular, Vue, React, Next.js로 사용자 화면을 개발했고, Spring Boot와 NestJS로 백엔드도 맡았습니다. ' +
    'AWS에 운영 환경을 구성하고 기존 사이트의 데이터와 파일을 옮겼습니다. 개발에는 Claude Code와 Cursor를 활용하고, OpenAI와 Perplexity API로 음악 추천과 셔틀 시간표 조회 기능을 구현했습니다.',
};

const experiences = [
  {
    company: '와커스 (WACUS)',
    duration: '2026.07 — 재직 중',
    tasks: [
      '밝은눈안과 잠실점 홈페이지의 회원, 상담, 게시글과 첨부 파일을 옮기고 이관 결과를 대조했습니다.',
      '해외 예약을 홈페이지에서 접수하도록 구현하고 AWS 운영 환경에서 배포를 네 차례 검증했습니다.',
      '더원서울안과 홈페이지에서 사용자 화면과 관리자 화면을 API에 연결했습니다.',
      '회원가입, 로그인, 계정 찾기와 네이버, 카카오 로그인을 구현했습니다. 로그인 시도 제한과 관리자 접근 권한을 보완했습니다.',
      '관리자가 의료진 소개와 학술발표, 유튜브, 팝업을 수정하도록 연결하고, 계정 찾기에 음성 캡차를 추가했습니다.',
      'DB와 업로드 파일을 새 서버로 옮기고, 인증서 자동 갱신을 구성한 뒤 도메인을 전환했습니다.',
      '병원 정보에 구조화 데이터(JSON-LD)를 추가하고 관리자 SEO 설정 화면을 정리했습니다.',
    ],
  },
  {
    company: '아이티센엔텍',
    duration: '2025.06 — 2026.05',
    tasks: [
      '삼성전자 DS 임직원이 쓰는 OA 장비 관리 시스템을 운영하고 기능을 개선했습니다.',
      'Vue CLI(Webpack)를 Vite로 바꿔 빌드 시간을 20초에서 5초로 줄였습니다.',
      '약 8,000명에게 메일을 보낼 때 요청 시간이 초과되는 원인을 찾아 해결했습니다.',
      '모바일 SSO 인증이 실패하는 원인을 분석해 AD 연동 로그인을 안정화했습니다.',
      '같은 날짜가 동시에 선택되는 문제를 synchronized로 제어해 중복 처리를 막았습니다.',
      '질문이 등록되면 Samsung Knox API로 관리자에게 메일을 보내도록 구현했습니다.',
    ],
  },
  {
    company: '베스텔라랩 (인턴)',
    duration: '2024.07 — 2024.08',
    tasks: [
      'Figma 레이어를 지도에 올리고 위도와 경도를 내보내는 플러그인을 혼자 개발했습니다.',
      '지도 좌표를 EPSG:3857에서 EPSG:4326으로 변환해 위도와 경도를 구했습니다.',
      'OpenLayers로 도형을 옮기고 돌리거나 크기를 조절하도록 구현했습니다. Nominatim API로 장소 검색을 추가했습니다.',
    ],
  },
  {
    company: '이파피루스',
    duration: '2022.04 — 2023.12',
    tasks: [
      '상용 웹 PDF 뷰어의 프론트엔드 기능을 개발하고 유지보수했습니다.',
      '종이에 인쇄해도 남는 비가시 추적코드를 구현했습니다.',
      'Android TalkBack과 iOS VoiceOver로 PDF 내용을 읽을 수 있게 했습니다.',
      '다크 모드와 라이트 모드 전환, 관리자가 설정할 수 있는 우클릭 메뉴를 구현했습니다.',
      'i18n 라이브러리로 영어와 일본어를 지원했습니다.',
    ],
  },
];

const projects = [
  {
    title: '밝은눈안과 잠실점 홈페이지 리뉴얼',
    meta: '2026.09–2026.11 | 백엔드, 데이터 이관, AWS 운영 | Next.js, NestJS, PostgreSQL',
    lines: [
      '기존 데이터를 옮기는 스크립트를 작성하고, 양쪽 DB의 건수와 첨부 파일을 검증했습니다.',
      'AWS Lightsail 운영 서버 두 대에 배포를 구성했습니다. 이관과 배포를 네 차례 검증한 뒤 11월 18일 새 홈페이지를 열었습니다.',
    ],
  },
  {
    title: '더원서울안과 홈페이지 리뉴얼',
    // 팀 규모는 적지 않는다. 저장소 커밋 계정으로는 실제 인원을 확정할 수 없다.
    meta: '2026.07–2026.08 | 사용자 화면, 백엔드, 인프라 | Next.js, NestJS, Prisma, PostgreSQL, AWS',
    lines: [
      '사용자 화면과 관리자 화면을 API에 연결해 병원 담당자가 주요 콘텐츠를 직접 수정할 수 있게 했습니다.',
      '회원 인증과 네이버, 카카오 로그인을 구현했습니다. 등록된 아이디가 응답에 드러나지 않도록 고치고 로그인 시도를 제한했습니다.',
      '새 서버에 DB와 업로드 파일을 옮기고 HTTPS 인증서를 준비한 뒤 도메인을 전환했습니다.',
      '구조화 데이터(JSON-LD)를 추가하고 관리자 SEO 설정을 정리했습니다. 개편한 사이트는 the1seoul.com에서 운영 중입니다.',
    ],
  },
  {
    title: '슬기로운 아이티센 생활 | 셔틀 서비스',
    meta: '2025.05–2025.06 | 프론트엔드 단독 (5인 팀) | React, Spring Boot, WebSocket',
    lines: [
      '셔틀의 실시간 위치를 확인하고 QR로 탑승하는 사내 서비스의 프론트엔드를 혼자 맡았습니다.',
      'Perplexity API로 시간표를 묻는 챗봇을 만들고, 휴대폰 홈 화면에서 열 수 있도록 PWA를 적용했습니다.',
      '신입 교육 11개 팀 중 유일하게 본사가 상용화를 검토했습니다.',
    ],
  },
  {
    title: '웹 PDF 뷰어 솔루션',
    meta: '2022.04–2023.12 | 기능 개발 전담 (2인 팀) | Angular, SCSS',
    lines: [
      '이파피루스의 상용 PDF 뷰어에서 비가시 추적코드를 구현하고, 문서를 인쇄해 코드가 읽히는지 확인했습니다.',
      '다크 모드를 추가하고 모바일 스크린 리더가 PDF 내용을 읽을 수 있게 했습니다.',
    ],
  },
  {
    title: 'Figma to Map Plugin',
    meta: '2024.07–2024.08 | 단독 개발 (인턴) | TypeScript, React, OpenLayers',
    lines: [
      'Figma 도형을 지도에 배치하고 위도와 경도를 내보내는 플러그인을 만들었습니다.',
      'EPSG:3857과 EPSG:4326의 차이를 확인해 좌표가 어긋나던 문제를 해결했습니다.',
    ],
  },
  {
    title: '살롱 | SSALON',
    meta: '2024.03–2024.06 | 백엔드 주도 (5인 팀) | Angular, Spring Boot, AWS',
    lines: [
      '아주대학교 졸업작품에서 백엔드를 맡았습니다. JWT로 인증하고 리프레시 토큰은 Redis에 저장했습니다.',
      'GitHub Actions로 배포를 자동화하고 AWS EC2, RDS, ElastiCache를 운영했습니다.',
    ],
  },
];

const skills = [
  ['프론트엔드', 'TypeScript, React, Vue.js, Angular, Next.js, Tailwind CSS'],
  ['백엔드와 DB', 'Java, Spring Boot, Node.js, NestJS, Prisma, Oracle, MySQL, PostgreSQL'],
  ['인프라', 'AWS (EC2, S3, RDS, ElastiCache), Docker, nginx, GitHub Actions, Vercel'],
  ['AI 활용', 'OpenAI, Perplexity, Naver CLOVA, Cursor'],
];

const education = { school: '아주대학교 소프트웨어학과', duration: '2020.03 — 2025.02' };
const certifications = 'SQLD (2025.12), AWS SAA (2025.09), OPIc IM2 (2024.11), 정보처리기사 (2021.11)';

// ---------------------------------------------------------------------------

for (const font of [FONT_REGULAR, FONT_BOLD]) {
  if (!fs.existsSync(font)) {
    console.error(`한글 폰트를 찾지 못했습니다: ${font}`);
    process.exit(1);
  }
}

const doc = new PDFDocument({ size: 'A4', margins: { top: 48, bottom: 48, left: 52, right: 52 } });
doc.registerFont('kr', FONT_REGULAR);
doc.registerFont('kr-bold', FONT_BOLD);
doc.pipe(fs.createWriteStream(OUT));

const W = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const L = doc.page.margins.left;

/** 남은 높이가 부족하면 페이지를 넘긴다. */
function ensure(space) {
  if (doc.y + space > doc.page.height - doc.page.margins.bottom) doc.addPage();
}

/** 한 페이지에 담을 수 있는 최대 높이. 이보다 큰 덩어리는 어차피 쪼개진다. */
const PAGE_BODY = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;

/** 불릿 한 줄이 실제로 차지하는 높이. 두 줄로 감기면 그만큼 커진다. */
function bulletHeight(item) {
  doc.font('kr').fontSize(9.8);
  return doc.heightOfString(item, { width: W - 12, lineGap: 2.2 }) + 4;
}

/** 프로젝트 한 건(제목 + 메타 + 서술)이 통째로 차지하는 높이. */
function projectHeight(project) {
  doc.font('kr-bold').fontSize(11);
  let height = doc.heightOfString(project.title, { width: W });
  doc.font('kr').fontSize(8.8);
  height += doc.heightOfString(project.meta, { width: W });
  for (const line of project.lines) height += bulletHeight(line);
  return height + 12;
}

/**
 * 섹션 제목. following에 뒤따를 첫 덩어리의 높이를 넘기면 제목만 페이지
 * 끝에 홀로 남지 않는다. 기본값 40은 "적어도 두어 줄은 따라온다"는 최소선.
 */
function sectionTitle(text, following = 40) {
  ensure(Math.min(48 + following, PAGE_BODY));
  doc.moveDown(0.7);
  doc.font('kr-bold').fontSize(11).fillColor(ACCENT).text(text.toUpperCase(), L, doc.y);
  doc.moveDown(0.28);
  doc
    .strokeColor(RULE)
    .lineWidth(0.8)
    .moveTo(L, doc.y)
    .lineTo(L + W, doc.y)
    .stroke();
  doc.moveDown(0.55);
}

/** 좌측 제목, 우측 기간을 같은 줄에 놓는다. */
function rowHeading(left, right) {
  ensure(34);
  const y = doc.y;
  doc.font('kr-bold').fontSize(11.5).fillColor(INK).text(left, L, y, { width: W * 0.68 });
  const bottom = doc.y;
  doc
    .font('kr')
    .fontSize(9.5)
    .fillColor(MUTED)
    .text(right, L + W * 0.68, y + 1.5, { width: W * 0.32, align: 'right' });
  doc.y = bottom;
}

function bullets(items) {
  doc.font('kr').fontSize(9.8).fillColor(INK);
  for (const item of items) {
    // 한 줄(24pt)만 잡으면 두 줄로 감기는 항목이 아래 여백을 넘어 흘러내린다.
    ensure(bulletHeight(item));
    doc.font('kr').fontSize(9.8).fillColor(INK);
    const y = doc.y;
    doc.fillColor(MUTED).text('-', L + 2, y, { width: 8 });
    doc.fillColor(INK).text(item, L + 12, y, { width: W - 12, lineGap: 2.2 });
    doc.moveDown(0.12);
  }
}

// 헤더
doc.font('kr-bold').fontSize(25).fillColor(INK).text(profile.name, L, doc.y);
doc.moveDown(0.18);
doc.font('kr-bold').fontSize(11.5).fillColor(ACCENT).text(profile.title);
doc.moveDown(0.35);
doc.font('kr').fontSize(9.5).fillColor(MUTED).text(profile.contacts.join('     '));
doc.moveDown(0.7);
doc.font('kr').fontSize(10).fillColor(INK).text(profile.summary, { width: W, lineGap: 3 });

// 경력
sectionTitle('경력');
experiences.forEach((job, index) => {
  if (index > 0) doc.moveDown(0.45);

  // 회사명만 페이지 끝에 홀로 남지 않도록 첫 두 항목까지 자리를 함께 본다.
  const lead = job.tasks.slice(0, 2).reduce((sum, task) => sum + bulletHeight(task), 0);
  ensure(Math.min(34 + lead, PAGE_BODY));

  rowHeading(job.company, job.duration);
  if (job.tasks.length) {
    doc.moveDown(0.25);
    bullets(job.tasks);
  }
});

// 학력과 자격증
sectionTitle('학력과 자격증');
rowHeading(education.school, education.duration);
doc.moveDown(0.4);
doc.font('kr').fontSize(9.8).fillColor(INK).text(certifications, L, doc.y, { width: W, lineGap: 2 });

// 프로젝트
sectionTitle('주요 프로젝트', projectHeight(projects[0]));
projects.forEach((project, index) => {
  if (index > 0) doc.moveDown(0.5);

  // 제목·메타·서술을 한 덩어리로 본다. 자리가 모자라면 통째로 다음 장에서
  // 시작한다 — 제목만 남고 내용이 넘어가면 읽는 쪽에서 둘을 잇지 못한다.
  ensure(Math.min(projectHeight(project), PAGE_BODY));

  doc.font('kr-bold').fontSize(11).fillColor(INK).text(project.title, L, doc.y, { width: W });
  doc.moveDown(0.12);
  doc.font('kr').fontSize(8.8).fillColor(MUTED).text(project.meta, { width: W });
  doc.moveDown(0.3);
  bullets(project.lines);
});

// 기술
sectionTitle('기술');
doc.font('kr').fontSize(9.8);
for (const [label, value] of skills) {
  ensure(20);
  const y = doc.y;
  doc.font('kr-bold').fillColor(INK).text(label, L, y, { width: 82 });
  doc.font('kr').fillColor(INK).text(value, L + 90, y, { width: W - 90, lineGap: 2 });
  doc.moveDown(0.25);
}

doc.end();
console.log(`생성 완료: ${OUT}`);
