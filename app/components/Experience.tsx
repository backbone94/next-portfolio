export default function Experience() {
  const experiences = [
    {
      company: '(주) 이파피루스',
      duration: '2022.04 ~ 2023.12',
      role: '정규직',
      tasks: [
        '비가시 추적 코드 삽입 기능 구현',
        '우클릭 커스텀 컨텍스트 메뉴 개발',
        '다크모드 전환 기능 추가',
        '모바일 스크린 리더(TalkBack, VoiceOver)를 활용한 문서 내용 TTS 기능 추가'
      ]
    },
    {
      company: '(주) 베스텔라랩',
      duration: '2024.07 ~ 2024.08',
      role: '인턴',
      tasks: [
        'Figma 레이어의 위경도 좌표 변환 Plugin 개발'
      ]
    }
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
              <ul className="list-disc list-inside text-gray-600 mt-2">
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
