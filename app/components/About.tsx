import Image from 'next/image';

export default function About() {
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
        <div className="text-center text-lg font-semibold mb-16 text-gray-600 leading-relaxed">
          도전과 성취를 향해 끊임없이 전진하는 개발자,<br />이정준입니다.
        </div>

        <div className="space-y-4 w-full">
          <div className="flex items-start">
            <span className="mr-4 text-xl">🌱</span>
            <p className="text-base text-gray-800 leading-normal">
              도전하며 성장하는 프론트엔드 개발자입니다. 사용자 경험을 중요시하며, 신속하고 효율적인 개발을 목표로 하고 있습니다.
            </p>
          </div>

          <div className="flex items-start">
            <span className="mr-4 text-xl">💡</span>
            <p className="text-base text-gray-800 leading-normal">
              새로운 기술을 배우고 적용해보는 것을 즐기며, 더 나은 결과물을 만들어내는 것에 큰 보람을 느낍니다.
            </p>
          </div>

          <div className="flex items-start">
            <span className="mr-4 text-xl">🔧</span>
            <p className="text-base text-gray-800 leading-normal">
              웹 개발을 중심으로 풀스택 개발 경험을 쌓아가고 있으며, 프론트엔드부터 백엔드까지 모든 과정을 이해하며 더 나은 소프트웨어를 만들기 위해 노력합니다.
            </p>
          </div>

          <div className="flex items-start">
            <span className="mr-4 text-xl">⚡</span>
            <p className="text-base text-gray-800 leading-normal">
              다양한 프로젝트를 통해 쌓아온 경험을 공유하고 발전시켜 나가고자 합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
