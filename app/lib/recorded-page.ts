import { getProject } from '@/app/content/projects';

export function isRecordedPage(path: string) {
  if (path === '/' || path === '/ask') return true;
  const slug = path.match(/^\/projects\/([^/]+)$/)?.[1];
  return slug != null && getProject(slug) != null;
}
