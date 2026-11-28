import type { NextRequest } from 'next/server';

export function isAdminAuthorized(request: NextRequest, password: string) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const separator = decoded.indexOf(':');
  if (separator === -1) return false;
  const given = decoded.slice(separator + 1);
  let diff = given.length ^ password.length;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ password.charCodeAt(i % password.length);
  return diff === 0;
}
