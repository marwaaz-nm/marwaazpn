const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ORIGIN = 'https://app.marwaazpn.com';
const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };
export function documentCode(input: string): string | null {
  let code = input.trim();
  if (code.startsWith('https://')) {
    try {
      const url = new URL(code);
      if (url.origin !== ORIGIN || url.search || url.hash || url.username || url.password) return null;
      const match = /^\/verify\/([^/]+)\/?$/.exec(url.pathname);
      if (!match) return null;
      code = match[1];
    } catch { return null; }
  }
  return UUID.test(code) ? code.toLowerCase() : null;
}
export async function documents(request: Request, enabled: boolean, upstream: typeof fetch = fetch): Promise<Response> {
  const reply = (error: string, status: number) => Response.json({ error }, { status, headers });
  if (request.method === 'GET') return Response.json({ enabled }, { headers });
  if (request.method !== 'POST') return reply('method_not_allowed', 405);
  if (!enabled) return reply('unavailable', 503);
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply('forbidden', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply('invalid', 400);
  let code: string | null;
  try {
    const body = await request.text();
    if (body.length > 1024) return reply('invalid', 400);
    const data = JSON.parse(body);
    code = typeof data.code === 'string' ? documentCode(data.code) : null;
  } catch { return reply('invalid', 400); }
  if (!code) return reply('invalid', 400);
  try {
    const response = await upstream(`${ORIGIN}/api/public/references/${code}/document`, {
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000), headers: { Accept: 'application/pdf' },
    });
    if (response.status === 404) return reply('not_found', 404);
    if (response.status === 429) return reply('rate_limited', 429);
    if (!response.ok || !response.headers.get('content-type')?.startsWith('application/pdf')) return reply('unavailable', 502);
    const reader = response.body?.getReader();
    if (!reader) return reply('unavailable', 502);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 25 * 1024 * 1024) { await reader.cancel(); return reply('too_large', 413); }
      chunks.push(value);
    }
    const pdf = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { pdf.set(chunk, offset); offset += chunk.length; }
    if (new TextDecoder().decode(pdf.slice(0, 5)) !== '%PDF-') return reply('unavailable', 502);
    return new Response(pdf, { headers: { ...headers, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="Marwaaz-document.pdf"' } });
  } catch { return reply('unavailable', 502); }
}
