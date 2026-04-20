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
          더 나은 개발을 위해 오늘도 1일 1커밋,<br />풀스택 개발자 이정준입니다.
        </div>

        <div className="space-y-4 w-full">
          <div className="flex items-start">
            <span className="mr-4 text-xl">🌱</span>
            <p className="text-base text-gray-800 leading-normal">
              1년 9개월 간의 프론트엔드 개발자로서의 경력을 가지고 있으며, 무엇보다 사용자의 경험을 우선시 합니다.
            </p>
          </div>

          <div className="flex items-start">
            <span className="mr-4 text-xl">💡</span>
            <p className="text-base text-gray-800 leading-normal">
              삼성전자 DS 임직원 전용 사이트 운영 경력을 시작으로, 풀스택 개발자의 첫 발걸음을 떼고 있는 중입니다.
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
