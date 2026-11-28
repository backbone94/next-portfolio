import { neon } from '@neondatabase/serverless';
import type { NextRequest } from 'next/server';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const env = process.env.VERCEL_ENV ?? 'development';

export function clientIp(request: NextRequest) {
  return request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
}

function networkAddress(ip: string) {
  const plain = ip.replace(/^::ffff:(?=\d+\.\d+\.\d+\.\d+$)/i, '');
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(plain)) {
    const parts = plain.split('.').map(Number);
    return parts.every((part) => part <= 255) ? parts.join('.') : null;
  }
  if (!plain.includes(':')) return null;
  try {
    // IPv6 기기의 끝 64비트는 바뀔 수 있다. 같은 회선은 앞 64비트로 묶는다.
    const ip6 = new URL(`http://[${plain}]`).hostname.slice(1, -1);
    const mapped = ip6.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (mapped) {
      const [high, low] = mapped.slice(1).map((part) => parseInt(part, 16));
      return [high >> 8, high & 255, low >> 8, low & 255].join('.');
    }
    const [left, right] = ip6.split('::');
    const start = left ? left.split(':') : [];
    const end = right ? right.split(':') : [];
    const groups = right === undefined ? start : [...start, ...Array(8 - start.length - end.length).fill('0'), ...end];
    return `${groups.slice(0, 4).map((group) => group.padStart(4, '0')).join(':')}/64`;
  } catch {
    return null;
  }
}

async function fingerprint(request: NextRequest) {
  const secret = process.env.VISIT_SALT || process.env.DATABASE_URL;
  const address = networkAddress(clientIp(request));
  if (!secret || !address) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`owner-network:${address}`));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function isOwnerNetwork(request: NextRequest) {
  if (!sql) return false;
  const network = await fingerprint(request);
  if (!network) return false;
  const rows = await sql`select 1 from owner_networks where env = ${env} and fingerprint = ${network}`;
  return rows.length > 0;
}

export async function setOwnerNetwork(request: NextRequest, exclude: boolean) {
  if (!sql) return false;
  const network = await fingerprint(request);
  if (!network) return false;
  if (exclude) {
    await sql`insert into owner_networks (env, fingerprint) values (${env}, ${network}) on conflict do nothing`;
  } else {
    await sql`delete from owner_networks where env = ${env} and fingerprint = ${network}`;
  }
  return true;
}
