import type { NextRequest } from 'next/server';
import { isSeoulDistrict } from '@/app/lib/seoul-location';
import { saveVisitDistrict } from '@/app/lib/visit';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return new Response(null, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Object.keys(body).length !== 1 || !isSeoulDistrict(body.district)) {
    return new Response(null, { status: 400 });
  }

  try {
    const saved = await saveVisitDistrict(request, body.district);
    return new Response(null, { status: saved ? 204 : 404 });
  } catch (error) {
    console.warn('[visit] 자치구 공유 저장 실패', error instanceof Error ? error.message : error);
    return new Response(null, { status: 500 });
  }
}
