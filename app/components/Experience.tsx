import Reveal from './Reveal';
import Section from './Section';

/**
 * 한 회사에서 여러 프로젝트를 한다. 회사 아래 프로젝트를 두고 한 일은 그
 * 아래에 붙인다. 평평한 목록이면 프로젝트가 늘었을 때 어느 일이 어느
 * 프로젝트 것인지 읽는 쪽에서 알 수 없다.
 *
 * 스택도 회사가 아니라 프로젝트가 갖는다. 같은 회사에서도 프로젝트마다
 * 다르기 때문이다.
 */
type Project = {
  name: string;
  stack?: string[];
  tasks: string[];
};

type Job = {
  company: string;
  duration: string;
  /** 확인된 경우에만 적는다. 추정해서 채우지 않는다. */
  role?: string;
  current?: boolean;
  projects: Project[];
};

const experiences: Job[] = [
  {
    company: '와커스 (WACUS)',
    duration: '2026.07 — 재직 중',
    current: true,
    // 직무(정규직/계약직)는 아직 확인 전이라 비워 둔다. 지어내지 않는다.
    projects: [
      {
        name: '더원서울안과 홈페이지 리뉴얼',
        stack: ['Next.js', 'React', 'NestJS', 'Prisma', 'PostgreSQL'],
        tasks: [
          '사용자 사이트·관리자 페이지·백엔드 API 전반 참여',
          '회원가입·로그인·계정 찾기 인증 흐름 구축 및 네이버·카카오 소셜 로그인 연동',
          '아이디 열거 방지, 로그인 시도 제한, 관리자 화면 접근 제어 등 인증·권한 취약점 보완',
          '병원소식·공지사항·칼럼·수술체험기·예약문의 게시판을 실데이터로 전환',
          '의료진 소개·학술발표·유튜브·메인 팝업을 관리자 페이지에서 직접 운영하도록 연동',
          '시각장애 사용자가 계정을 찾을 수 있도록 캡차에 음성 듣기 추가',
          '신규 서버 이관 — DB·업로드 파일 옮기고 SSL 인증서 발급·자동 갱신 구성 후 도메인 전환',
        ],
      },
    ],
  },
  {
    company: '아이티센엔텍',
    duration: '2025.06 — 2026.05',
    role: '정규직',
    projects: [
      {
        name: '삼성전자 DS 임직원 OA 장비 관리 시스템',
        stack: ['Vue.js', 'Spring Boot', 'Oracle', 'MyBatis'],
        tasks: [
          '모바일 SSO 인증 실패 이슈 분석 및 AD 연동 로그인 안정성 확보',
          'synchronized 기반 동시성(날짜 중복 선택) 제어 로직 구현으로 데이터 정합성 보장',
          '약 8,000명 대상 대량 메일 발송 Timeout 이슈 원인 분석 및 해결',
          'Vue CLI(Webpack) → Vite 마이그레이션으로 빌드 시간 20초 → 5초 단축',
          'Samsung Knox API 기반 Q&A 등록 시 관리자 자동 메일 발송 기능 개발',
          '운영 중 장애 대응과 사용자 문의 처리로 서비스 안정성 유지',
        ],
      },
    ],
  },
  {
    company: '베스텔라랩',
    duration: '2024.07 — 2024.08',
    role: '인턴',
    projects: [
      {
        name: 'Figma 지도 연동 플러그인',
        stack: ['TypeScript', 'React', 'Webpack', 'OpenLayers'],
        tasks: [
          'Figma Plugin API 기반 플러그인 구조 설계 및 개발',
          'Figma 레이어(폴리곤)의 EPSG:3857 ↔ EPSG:4326 좌표계 변환 및 위경도 좌표 추출 구현',
          'OpenLayers 라이브러리로 폴리곤 드래그/리사이즈/회전 등 커스텀 기능 구현',
          'Nominatim API로 지도 내 장소 검색 기능 추가',
          'Figma ↔ Plugin 간 레이어 데이터 Import / Export 기능 개발',
          'MUI(Material UI) 기반 플러그인 UI 설계 및 구현',
        ],
      },
    ],
  },
  {
    company: '이파피루스',
    duration: '2022.04 — 2023.12',
    role: '정규직',
    projects: [
      {
        name: '웹 PDF 뷰어 솔루션',
        stack: ['Angular', 'TypeScript', 'SCSS'],
        tasks: [
          '프론트엔드 기능 개발 및 유지보수',
          'i18n 라이브러리로 다국어(영어, 일본어) 처리',
          '인쇄된 PDF에도 남는 비가시 워터마크(추적코드) 삽입 기능 구현',
          '우클릭 커스텀 컨텍스트 메뉴 개발',
          '다크모드 / 라이트모드 테마 전환 기능 구현',
          'Android TalkBack / iOS VoiceOver로 PDF 내용 TTS 지원',
        ],
      },
    ],
  },
];

export default function Experience() {
  return (
    <Section
      id="experience"
      title="경력"
      lead="프론트엔드로 시작해 백엔드와 클라우드 운영까지 넓은 영역의 이력을 쌓았습니다."
    >
      <ol className="space-y-4">
        {experiences.map((job, index) => (
          <li key={job.company}>
            <Reveal
              // 경력은 시간순 목록이라 차례로 도착하는 것이 내용상 참이다.
              delay={index * 0.06}
              className={`rounded-xl border p-6 md:p-7 ${
                job.current ? 'border-accent/45 bg-surface' : 'border-border bg-surface'
              }`}
            >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
              <h3 className="text-lg font-bold tracking-[-0.01em]">{job.company}</h3>
              {job.role && <span className="text-sm text-muted">{job.role}</span>}
              {job.current && (
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-ink">
                  현재
                </span>
              )}
              <time className="ml-auto text-sm text-muted">{job.duration}</time>
            </div>

            {/* 구분선은 프로젝트가 둘 이상일 때만 보인다. 하나뿐이면 없던 층처럼 조용하다 */}
            <ol className="mt-5 divide-y divide-border">
              {job.projects.map((project) => (
                <li key={project.name} className="py-5 first:pt-0 last:pb-0">
                  <h4 className="font-bold tracking-[-0.01em]">{project.name}</h4>

                  {project.stack && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="mt-4 space-y-2">
                    {project.tasks.map((task) => (
                      <li key={task} className="flex gap-3 text-sm leading-relaxed text-text/80">
                        <span
                          aria-hidden
                          className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent/70"
                        />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
