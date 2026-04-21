import Image from 'next/image';

export default function Skill() {
  const categories = [
    {
      label: 'Frontend',
      skills: [
        { src: "/images/skill/typescript.ico", alt: "TypeScript", label: "TypeScript" },
        { src: "/images/skill/react.ico", alt: "React", label: "React" },
        { src: "/images/skill/vue.ico", alt: "Vue.js", label: "Vue.js" },
        { src: "/images/skill/angular.ico", alt: "Angular", label: "Angular" },
        { src: "/images/skill/nextjs.ico", alt: "Next.js", label: "Next.js" },
      ],
    },
    {
      label: 'Backend & Database',
      skills: [
        { src: "/images/skill/java.ico", alt: "Java", label: "Java" },
        { src: "/images/skill/spring.ico", alt: "Spring Boot", label: "Spring Boot" },
        { src: "/images/skill/oracle.ico", alt: "Oracle", label: "Oracle" },
      ],
    },
  ];

  return (
    <section id="skill" className="select-none container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-violet-50 via-white to-violet-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-violet-400">
      <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">SKILL</div>
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.label}>
            <div className="text-sm font-semibold text-violet-500 mb-3 pl-1">{category.label}</div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {category.skills.map((skill, index) => (
                <div key={index} className="text-center group bg-white p-3 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <Image src={skill.src} alt={skill.alt} width={48} height={48} className="mx-auto w-12 h-12 rounded-lg group-hover:scale-110 transition-transform duration-300" />
                  <span className="block mt-2 text-sm font-medium text-gray-700">{skill.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
