'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { projects } from '../content/projects';
import { Navigation, Pagination } from 'swiper/modules';

export default function Project() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    Swiper.use([Navigation, Pagination]);

    new Swiper('.swiper', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      preventClicks: false,
      preventClicksPropagation: false,
    });
  }, []);

  const displayedProjects = isExpanded ? projects : projects.slice(0, 2);

  return (
    <div className="relative">
      <section
        id="project"
        className={`select-none container mx-auto p-8 my-12 max-w-8xl bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300
        ${isExpanded ? 'h-auto' : 'h-[1000px] overflow-hidden'}`}
      >
        <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">PROJECTS</div>
        {displayedProjects.map((project, index) => (
          <div key={index} className="my-8 p-6 bg-white rounded-lg shadow-md">
            <div className="text-2xl font-bold mb-4 text-center">{project.title}</div>
            <div className="border-b border-dashed border-gray-400 mb-8" />
            <div className="flex flex-col md:flex-row mb-6">
              <div className="flex-1 mb-4 md:mb-0 max-w-full overflow-hidden">
                <div className="border swiper rounded-lg shadow-lg max-w-full overflow-hidden w-[800px] h-[450px]">
                  <div className="swiper-wrapper">
                    {project.media.map((item, index) => (
                      <div key={index} className="swiper-slide w-full h-full flex justify-center items-center">
                        {item.type === 'image' ? (
                          <Image
                            src={item.src}
                            alt={item.alt}
                            width={800}
                            height={450}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <video
                            width="800"
                            height="450"
                            src={item.src}
                            controls
                            className="w-full h-full object-contain rounded-lg swiper-no-swiping"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="swiper-pagination"></div>
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-button-next"></div>
                </div>
              </div>
              <div className="flex-1 pl-0 md:pl-8">
                <div className="mb-4">
                  <div className="font-semibold text-lg mb-2">주요 기능</div>
                  <div>{project.features}</div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-lg mb-2">기술 스택</div>
                  <div>{project.stack}</div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-lg mb-2">GitHub</div>
                  <a href={project.github} target="_blank" className="text-blue-500 hover:underline break-words">
                    {project.github}
                  </a>
                </div>
                <hr className="mb-4" />
                <div>{project.description}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {!isExpanded && (
        <div className="z-50 absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-1/2 bottom-[-15px] transform -translate-x-1/2 px-4 py-2 bg-sky-400 text-white font-semibold rounded-lg hover:bg-sky-500 transition duration-300 z-50"
      >
        {isExpanded ? '프로젝트 접기 ⭡' : '프로젝트 더보기 ⭣'}
      </button>
    </div>
  );
}
