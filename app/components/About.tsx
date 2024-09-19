import Image from 'next/image';

export default function About() {
  const aboutItems = [
    { icon: '🛠️', text: '백엔드를 충분히 잘 다룰 수 있는 프론트엔드 개발자가 되는 것이 목표입니다.' },
    { icon: '🤝', text: '팀원들과의 원활한 소통과 배려를 통해 강력한 협동심을 발휘합니다.' },
    { icon: '📚', text: '지속적으로 배우고 발전하는 개발자가 되겠습니다.' }
  ];

  return (
    <section
      id="about"
      className="select-none container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">ABOUT</div>

      <div className="flex flex-col items-center">
        <a
          href="https://github.com/backbone94/portfolio/blob/master/image/aboutImg.jpg?raw=true"
          target="_blank"
          rel="noopener noreferrer"
          className="relative mb-6 group"
        >
          <Image
            className="rounded-3xl shadow-lg"
            src="/images/about-img.jpg"
            alt="About"
            width={150}
            height={150}
          />
        </a>
        <div className="text-center text-lg font-semibold mb-8 text-gray-600 leading-relaxed">
          도전과 성취를 향해 끊임없이 전진하는 개발자,<br />이정준입니다.
        </div>

        <div className="grid grid-cols-[100px_1fr] text-gray-700 mb-8">
          <p><strong>이름:</strong></p>
          <p>이정준</p>
          <p><strong>학력:</strong></p>
          <p>아주대학교 소프트웨어학과</p>
          <p><strong>생년월일:</strong></p>
          <p>1994.11.11</p>
          <p><strong>주소지:</strong></p>
          <p>경기도 수원시</p>
          <p><strong>연락처:</strong></p>
          <p>010-9287-1684</p>
        </div>

        <ul className="text-left text-base font-normal space-y-4 list-none">
          {aboutItems.map((item, index) => (
            <li key={index} className="flex items-center group">
              <span className="mr-3 text-2xl transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
