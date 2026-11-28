import { NextResponse, type NextRequest } from 'next/server';
import { isAdminAuthorized } from '@/app/lib/admin-auth';
import { setOwnerNetwork } from '@/app/lib/owner-network';

export async function POST(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !isAdminAuthorized(request, password) || request.headers.get('origin') !== request.nextUrl.origin) {
    return new Response(null, { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  const action = form?.get('action');
  if (action !== 'exclude' && action !== 'include') return new Response(null, { status: 400 });

  const updated = await setOwnerNetwork(request, action === 'exclude').catch(() => false);
  const redirect = new URL('/admin', request.url);
  redirect.searchParams.set('network', updated ? (action === 'exclude' ? 'excluded' : 'included') : 'failed');
  return NextResponse.redirect(redirect, 303);
}
