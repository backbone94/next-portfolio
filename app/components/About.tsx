import Image from 'next/image';

export default function About() {
  return (
    <section
      id="about"
      className="select-none container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-sky-400"
    >
      <div className="flex flex-col items-center">
        <a
          href="https://github.com/backbone94/portfolio/blob/master/image/aboutImg.jpg?raw=true"
          target="_blank"
          rel="noopener noreferrer"
          className="relative mb-4 group"
        >
          <Image
            className="rounded-full shadow-lg"
            src="/images/about-img.jpg"
            alt="About"
            width={180}
            height={180}
            priority
            sizes="180px"
          />
        </a>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">이정준</h1>
        <div className="text-sky-500 font-semibold text-lg mb-2">Frontend Developer</div>
        <div className="text-gray-500 text-sm mb-4">더 나은 개발을 위해 오늘도 1일 1커밋</div>
        <div className="w-12 h-1 bg-sky-400 rounded mb-6" />

        <div className="space-y-4 w-full">
          <div className="flex items-start">
            <span className="mr-4 text-xl">🌱</span>
            <p className="text-base text-gray-800 leading-normal">
              이파피루스, 아이티센엔텍에서 <strong>약 2년 이상의 프론트엔드 실무 경력</strong>을 보유하고 있으며, 무엇보다 사용자의 경험을 우선시합니다.
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
