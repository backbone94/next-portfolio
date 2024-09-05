import Image from 'next/image';

export default function Skill() {
  const skills = [
    { src: "/images/skill/html.ico", alt: "HTML", label: "HTML" },
    { src: "/images/skill/css.ico", alt: "CSS", label: "CSS" },
    { src: "/images/skill/javascript.ico", alt: "JavaScript", label: "JavaScript" },
    { src: "/images/skill/typescript.ico", alt: "TypeScript", label: "TypeScript" },
    { src: "/images/skill/react.ico", alt: "React", label: "React" },
    { src: "/images/skill/redux.ico", alt: "Redux", label: "Redux" },
    { src: "/images/skill/angular.ico", alt: "Angular", label: "Angular" },
    { src: "/images/skill/nextjs.ico", alt: "NextJS", label: "NextJS" },
    { src: "/images/skill/nodejs.ico", alt: "NodeJs", label: "NodeJs" },
    { src: "/images/skill/java.ico", alt: "Java", label: "Java" },
    { src: "/images/skill/spring.ico", alt: "Spring", label: "Spring" },
    { src: "/images/skill/mysql.ico", alt: "MySQL", label: "MySQL" },
  ];

  const descriptions = [
    { emoji: "💻", text: "HTML, CSS, JavaScript를 통해 기본적인 동적 기능을 하는 웹사이트를 만들 수 있습니다." },
    { emoji: "🎨", text: "사용자 경험에 최적화된 웹사이트를 만들기 위해 React/Angular 프레임워크를 활용할 수 있습니다." },
    { emoji: "⚙️", text: "Redux, TypeScript를 활용함으로써 더욱 효율적인 개발을 할 수 있습니다." },
    { emoji: "🚀", text: "Next.js를 사용하여 SSR과 SSG 기능을 통해 성능이 뛰어나고 SEO에 최적화된 웹 애플리케이션을 구축할 수 있습니다." },
    { emoji: "🌐", text: "NodeJS 또는 Spring을 활용하여 확장성과 안정성이 높은 서버를 개발할 수 있습니다." },
    { emoji: "📊", text: "MySQL을 사용해 데이터의 효율적인 전송 및 관리를 체계적으로 수행할 수 있습니다." },
  ];

  return (
    <section id="skill" className="select-none container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">SKILL</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <div key={index} className="text-center group bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image src={skill.src} alt={skill.alt} width={64} height={64} className="mx-auto w-16 h-16 rounded-lg group-hover:scale-110 transition-transform duration-300" />
            <span className="block mt-2 text-md font-medium text-gray-700 transition-colors duration-300">{skill.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-gray-700">
        <ul className="divide-y divide-gray-200">
          {descriptions.map((desc, index) => (
            <li key={index} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-300">
              <span className="text-2xl text-indigo-500 mr-4">{desc.emoji}</span>
              <span className="text-md text-gray-800 font-medium">{desc.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
