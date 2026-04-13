export default function Education() {
  const education = [
    {
      institution: '아주대학교 소프트웨어학과',
      duration: '2020.03 ~ 2025.02',
      icon: '🎓',
    },
  ];

  const certifications = [
    {
      title: 'SQLD',
      issueDate: '2025.12',
      icon: '🗄️',
    },
    {
      title: 'AWS SAA',
      issueDate: '2025.09',
      icon: '☁️',
    },
    {
      title: 'OPIc IM2',
      issueDate: '2024.12',
      icon: '🌍',
    },
    {
      title: '정보처리기사',
      issueDate: '2021.11',
      icon: '📜',
    },
  ];

  return (
    <section
      id="education"
      className="container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">EDUCATION</div>
      <div className="flex flex-col items-center space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
            <span className="h-6 w-6 text-blue-400 mr-4">{edu.icon}</span>
            <div>
              <div className="text-lg font-bold text-gray-800">{edu.institution}</div>
              <div className="text-gray-500">{edu.duration}</div>
            </div>
          </div>
        ))}
        {certifications.map((certification, index) => (
          <div key={index} className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
            <span className="h-6 w-6 text-blue-400 mr-4">{certification.icon}</span>
            <div>
              <div className="text-lg font-bold text-gray-800">{certification.title}</div>
              <div className="text-gray-500">{certification.issueDate}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
