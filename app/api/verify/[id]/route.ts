import { NextResponse } from 'next/server';

const ORIGIN = 'https://app.marwaazpn.com';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHEET = /^NM\/\d{1,8}\/(?:\d{2}|\d{4})$/i;
const responseHeaders = { 'Cache-Control': 'no-store, private', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const value = decodeURIComponent(id).trim().replace(/\s+/g, '');
  if (!UUID.test(value) && !SHEET.test(value)) return NextResponse.json({ error: 'not_found' }, { status: 404, headers: responseHeaders });
  try {
    const upstream = await fetch(`${ORIGIN}/api/public/references/${encodeURIComponent(value)}`, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(60000), headers: { Accept: 'application/json' } });
    if (upstream.status === 404) return NextResponse.json({ error: 'not_found' }, { status: 404, headers: responseHeaders });
    if (upstream.status === 429) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: responseHeaders });
    if (!upstream.ok || !upstream.headers.get('content-type')?.startsWith('application/json')) throw new Error('upstream');
    return NextResponse.json(await upstream.json(), { headers: responseHeaders });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502, headers: responseHeaders });
  }
}
