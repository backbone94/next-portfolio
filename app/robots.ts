import type { MetadataRoute } from 'next';
import { SITE_URL } from './content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 관리자 화면은 비밀번호로 막혀 있고 noindex도 붙어 있다. 크롤러가 401을 받으러 들르지 않게 한다
      disallow: '/admin',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
