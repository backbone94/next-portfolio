'use client';

import Image from 'next/image';

export default function Contact() {
  return (
    <section
      id="contact"
      className="select-none container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">Contact</div>
      <div className="flex justify-center">
        <div className="w-full md:w-2/3">
          <div className="flex items-center mb-8">
            <Image width={24} height={24} src="/images/mail.png" alt="Mail" />
            <span className="select-text ml-4 text-lg text-gray-700">backbone94@naver.com</span>
          </div>
          <div className="flex items-center mb-8">
            <Image width={24} height={24} src="/images/github-brands.svg" alt="GitHub" />
            <span className="ml-4 text-lg text-gray-700">
              <a
                href="https://github.com/backbone94"
                target="_blank"
                className="hover:text-black transition-colors duration-300"
              >
                GitHub
              </a>
            </span>
          </div>
          <div className="flex items-center mb-8">
            <Image width={24} height={24} src="/images/notion.svg" alt="Notion" />
            <span className="ml-4 text-lg text-gray-700">
              <a
                href="https://sandy-cyclone-cbb.notion.site/55b2fd6390f540caa557399c36957e70"
                target="_blank"
                className="hover:text-black transition-colors duration-300"
              >
                Blog
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
