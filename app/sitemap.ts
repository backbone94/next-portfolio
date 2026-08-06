import type { MetadataRoute } from 'next';
import { projects } from './content/projects';
import { SITE_URL } from './content/site';

/**
 * 프로젝트 상세는 12개가 SSG로 만들어지지만 홈에서 링크를 타고 들어가는 경로
 * 말고는 크롤러가 발견할 방법이 없었다. 목록을 직접 넘겨 색인 대상으로 알린다.
 *
 * lastModified는 콘텐츠가 코드에 박혀 있어 파일 수정 시각과 같다. 빌드 시각을
 * 쓰면 내용이 그대로인데도 매 배포마다 갱신됐다고 알리게 되므로 쓰지 않는다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...projectPages,
  ];
}
