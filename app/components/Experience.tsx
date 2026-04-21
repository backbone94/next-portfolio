export default function Experience() {
  const experiences = [
    {
      company: '아이티센엔텍',
      duration: '2025.06 ~',
      role: '정규직',
      tasks: [
        'Vue.js & Spring Boot 기반 삼성전자 DS 임직원 대상 OA 장비 관리 시스템 운영 및 기능 개선',
        '모바일 SSO 인증 실패 이슈 분석 및 AD 연동 로그인 안정성 확보',
        'synchronized 기반 동시성(날짜 중복 선택) 제어 로직 구현으로 데이터 정합성 보장',
        '약 8,000명 대상 대량 메일 발송 Timeout 이슈 원인 분석 및 해결',
        'Vue CLI(Webpack) → Vite 마이그레이션으로 빌드 시간 약 40% 단축',
        'Samsung Knox API 기반 Q&A 등록 시 관리자 자동 메일 발송 기능 개발',
        '운영 중 장애 대응 및 사용자 문의 처리를 통한 서비스 안정성 지속 개선'
      ]
    },
    {
      company: '베스텔라랩',
      duration: '2024.07 ~ 2024.08',
      role: '인턴',
      tasks: [
        'Figma Plugin API 기반 지도 연동 플러그인 개발 (TypeScript, React, Webpack)',
        'Figma 레이어(폴리곤)의 EPSG:3857 ↔ EPSG:4326 좌표계 변환 및 위경도 좌표 추출 구현',
        'OpenLayers 라이브러리로 폴리곤 드래그/리사이즈/회전 등 커스텀 기능 구현',
        'Nominatim API를 활용한 지도 내 장소 검색 기능 추가',
        'Figma ↔ Plugin 간 레이어 데이터 Import / Export 기능 개발',
        'MUI(Material UI) 기반 플러그인 UI 설계 및 구현'
      ]
    },
    {
      company: '이파피루스',
      duration: '2022.04 ~ 2023.12',
      role: '정규직',
      tasks: [
        'Angular 기반 웹 PDF 뷰어 솔루션 프론트엔드 기능 개발 및 유지보수',
        'i18n 라이브러리를 활용한 다국어(영어, 일본어) 처리',
        'PDF 인쇄 문서 보안 강화를 위한 비가시 워터마크(추적코드) 삽입 기능 구현',
        '우클릭 커스텀 컨텍스트 메뉴 개발',
        '다크모드 / 라이트모드 테마 전환 기능 구현',
        'Android TalkBack / iOS VoiceOver 지원을 통한 PDF 내용 TTS 기능 구현'
      ]
    },
  ];

  return (
    <section
      id="experience"
      className="select-none container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">EXPERIENCE</div>
      <div className="flex flex-col items-center space-y-4">
        {experiences.map((experience, index) => (
          <div key={index} className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
            <span className="h-6 w-6 text-blue-400 mr-4">💼</span>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {experience.company}
                {experience.role === '인턴' && (
                  <span className="text-sm text-blue-400 ml-2">({experience.role})</span>
                )}
              </div>
              <div className="text-gray-500">{experience.duration}</div>
              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm">
                {experience.tasks.map((task, taskIndex) => (
                  <li key={taskIndex}>{task}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
