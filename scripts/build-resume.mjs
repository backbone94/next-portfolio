/**
 * 이력서 PDF 생성기.
 *
 *   node scripts/build-resume.mjs
 *
 * 결과물은 public/resume.pdf 이고 사이트의 "이력서 PDF" 버튼이 이 경로를 가리킨다.
 * 한글 글리프가 필요해 Windows 기본 폰트(맑은 고딕)를 임베드한다.
 *
 * 내용은 여기에 직접 적는다. app/content/projects.ts 와 Experience.tsx 를
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
    '프론트엔드에서 시작해 백엔드와 인프라까지 맡아 왔습니다. Angular · Vue · React · Next.js 프론트엔드 프레임워크 모두를 실무에서 사용한 경험이 있고 ' +
    'Spring Boot/Nest.js와 AWS로 서버 및 클라우드도 직접 운영했습니다. Claude Code, Cursor 등 AI 도구를 개발 전 과정에 적극 활용하며, OpenAI·Perplexity API로 서비스 기능도 직접 구현했습니다.',
};

const experiences = [
  {
    company: '와커스 (WACUS)',
    duration: '2026.07 — 재직 중',
    tasks: [
      '더원서울안과 홈페이지 리뉴얼 — 사용자 · 관리자 화면 · 백엔드 API 연동 전반 참여',
      '회원가입 · 로그인 · 계정 찾기 인증 흐름 구축 및 네이버 · 카카오 소셜 로그인 연동',
      '인증 · 권한 취약점 보완 — 아이디 열거 방지, 로그인 시도 제한, 관리자 화면 접근 제어',
      '의료진 소개 · 학술발표 · 유튜브 · 메인 팝업을 관리자 화면에서 직접 운영하도록 연동',
      '웹 접근성 향상 — 시각장애 사용자를 위한 캡차에 음성 듣기 추가',
      '신규 서버 이관 — DB · 업로드 파일 옮기고 SSL 인증서 발급 · 자동 갱신 구성 후 도메인 전환',
      'SEO 강화 — 검색 결과 노출을 위한 구조화 데이터(JSON-LD) 적용 및 SEO 관리자 설정 화면 정리',
    ],
  },
  {
    company: '아이티센엔텍',
    duration: '2025.06 — 2026.05',
    tasks: [
      '삼성전자 DS 임직원 대상 OA 장비 관리 시스템 운영 및 기능 개선',
      'Vue CLI(Webpack) → Vite 마이그레이션으로 빌드 시간 20초 → 5초 단축',
      '약 8,000명 대상 대량 메일 발송 Timeout 이슈 원인 분석 및 해결',
      '모바일 SSO 인증 실패 이슈 분석 및 AD 연동 로그인 안정성 확보',
      'synchronized 기반 동시성 제어 로직 구현으로 데이터 정합성 보장',
      'Samsung Knox API 기반 Q&A 등록 시 관리자 자동 메일 발송 기능 개발',
    ],
  },
  {
    company: '베스텔라랩 (인턴)',
    duration: '2024.07 — 2024.08',
    tasks: [
      'Figma Plugin API 기반 지도 연동 플러그인 단독 개발',
      'EPSG:3857 ↔ EPSG:4326 좌표계 변환 및 위경도 좌표 추출 구현',
      'OpenLayers로 폴리곤 드래그 / 리사이즈 / 회전 커스텀 인터랙션 구현',
      'Nominatim API 연동으로 지도 내 장소 검색 기능 추가',
    ],
  },
  {
    company: '이파피루스',
    duration: '2022.04 — 2023.12',
    tasks: [
      '상용 웹 PDF 뷰어 솔루션 프론트엔드 기능 개발 및 유지보수',
      '인쇄된 PDF에도 남는 비가시 워터마크(추적코드) 삽입 기능 구현',
      'Android TalkBack / iOS VoiceOver 지원으로 PDF 내용 TTS 대응',
      '다크모드 / 라이트모드 테마 전환, 우클릭 커스텀 컨텍스트 메뉴 개발',
      'i18n 라이브러리로 다국어(영어, 일본어) 처리',
    ],
  },
];

const projects = [
  {
    title: '더원서울안과 홈페이지 리뉴얼',
    // 팀 규모는 적지 않는다. 저장소 커밋 계정으로는 실제 인원을 확정할 수 없다.
    meta: '2026.07—2026.08 · 사용자 사이트 · 백엔드 · 인프라 참여 · Next.js, NestJS, Prisma, PostgreSQL, AWS',
    lines: [
      '안과 병원 홈페이지 전면 리뉴얼. 사용자 사이트와 관리자 페이지, 백엔드 API를 오가며 작업했습니다. (the1seoul.com 운영 중)',
      '회원가입부터 네이버 · 카카오 소셜 로그인까지 인증 전반을 맡았고 아이디 열거와 무차별 로그인 시도를 막는 처리를 함께 넣었습니다.',
      '게시판과 의료진 · 유튜브 · 팝업 등 메인 콘텐츠를 병원 담당자가 관리자 페이지에서 직접 고칠 수 있도록 실데이터로 전환했습니다.',
      '운영 중인 사이트를 신규 서버로 이관했습니다. DB와 업로드 파일을 옮기고 SSL 인증서 발급 · 자동 갱신을 구성한 뒤 도메인을 전환했습니다.',
      '검색 결과 노출을 위해 구조화 데이터(JSON-LD)를 적용하고 SEO 관리자 설정 화면을 정비했습니다.',
    ],
  },
  {
    title: '슬기로운 아이티센 생활 | 셔틀 서비스',
    meta: '2025.05—2025.06 · 프론트엔드 단독 (5인 팀) · React, Spring Boot, WebSocket',
    lines: [
      '셔틀이 지금 어디쯤인지 확인하고 QR로 탑승하는 사내 모바일 서비스. 프론트엔드를 혼자 맡아 전체 화면을 구현했습니다.',
      'Perplexity API로 시간표를 자연어로 조회하는 챗봇을 붙이고 PWA 도입을 제안해 적용했습니다.',
      '신입 교육 11개 팀 가운데 유일하게 본사 상용화 검토까지 갔습니다.',
    ],
  },
  {
    title: '웹 PDF 뷰어 솔루션',
    meta: '2022.04—2023.12 · 기능 개발 전담 (2인 팀) · Angular, SCSS',
    lines: [
      '이파피루스의 상용 웹 PDF 뷰어. 인쇄물에도 남는 비가시 추적코드를 구현하며 DPI·해상도를 실무로 익혔습니다.',
      '다크모드와 모바일 스크린리더 대응으로 웹 접근성을 개선했습니다.',
    ],
  },
  {
    title: 'Figma to Map Plugin',
    meta: '2024.07—2024.08 · 단독 개발 (인턴) · TypeScript, React, OpenLayers',
    lines: [
      'Figma에서 그린 도형을 지도 위에 올려놓고 위경도를 뽑아내는 플러그인.',
      '좌표 변환이 어긋나는 문제를 만나 EPSG:3857과 4326의 차이를 공부해 직접 해결했습니다.',
    ],
  },
  {
    title: '살롱 | SSALON',
    meta: '2024.03—2024.06 · 백엔드 주도 (5인 팀) · Angular, Spring Boot, AWS',
    lines: [
      '아주대학교 졸업작품. 프론트엔드만 하던 상태에서 백엔드를 맡아 JWT와 Redis Refresh Token으로 인증을 설계했습니다.',
      'GitHub Actions CI/CD와 EC2·RDS·ElastiCache 클라우드 환경을 직접 운영했습니다.',
    ],
  },
];

const skills = [
  ['프론트엔드', 'TypeScript, React, Vue.js, Angular, Next.js, Tailwind CSS'],
  ['백엔드 · DB', 'Java, Spring Boot, Node.js, NestJS, Prisma, Oracle, MySQL, PostgreSQL'],
  ['인프라', 'AWS (EC2, S3, RDS, ElastiCache), Docker, nginx, GitHub Actions, Vercel'],
  ['AI 활용', 'OpenAI, Perplexity, Naver CLOVA, Cursor'],
];

const education = { school: '아주대학교 소프트웨어학과', duration: '2020.03 — 2025.02' };
const certifications = 'SQLD (2025.12) · AWS SAA (2025.09) · OPIc IM2 (2024.11) · 정보처리기사 (2021.11)';

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
    doc.fillColor(MUTED).text('·', L + 2, y, { width: 8 });
    doc.fillColor(INK).text(item, L + 12, y, { width: W - 12, lineGap: 2.2 });
    doc.moveDown(0.12);
  }
}

// 헤더
doc.font('kr-bold').fontSize(25).fillColor(INK).text(profile.name, L, doc.y);
doc.moveDown(0.18);
doc.font('kr-bold').fontSize(11.5).fillColor(ACCENT).text(profile.title);
doc.moveDown(0.35);
doc.font('kr').fontSize(9.5).fillColor(MUTED).text(profile.contacts.join('   ·   '));
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

// 학력 · 자격증
sectionTitle('학력 · 자격증');
rowHeading(education.school, education.duration);
doc.moveDown(0.4);
doc.font('kr').fontSize(9.8).fillColor(INK).text(certifications, L, doc.y, { width: W, lineGap: 2 });

doc.end();
console.log(`생성 완료: ${OUT}`);
