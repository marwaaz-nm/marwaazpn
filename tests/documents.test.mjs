import test from 'node:test';
import assert from 'node:assert/strict';
import { documentCode, documents } from '../lib/documents.ts';
const code = '12345678-abcd-4abc-8abc-123456789abc';
const request = value => new Request('https://marwaazpn.com/api/documents', { method: 'POST', headers: { Origin: 'https://marwaazpn.com', 'Content-Type': 'application/json' }, body: JSON.stringify({ code: value }) });
test('accepts only UUIDv4 codes and exact official verification URLs', () => {
  assert.equal(documentCode(code), code);
  assert.equal(documentCode(`https://app.marwaazpn.com/verify/${code}`), code);
  for (const input of ['1', 'MNP-2026-04141', '1-0123456789abcdef', `https://evil.test/verify/${code}`, `https://app.marwaazpn.com/verify/${code}?x=1`, '../secret']) assert.equal(documentCode(input), null);
});
test('disabled integration never calls backend', async () => {
  const result = await documents(request(code), false, () => { throw new Error('must not call'); });
  assert.equal(result.status, 503);
  assert.equal(result.headers.get('cache-control'), 'no-store');
});
test('server rejects numeric IDs before backend access', async () => {
  assert.equal((await documents(request('1'), true, () => { throw new Error('must not call'); })).status, 400);
});
test('rejects cross-origin requests', async () => {
  const req = request(code); req.headers.set('origin', 'https://evil.test');
  assert.equal((await documents(req, true)).status, 403);
});
test('downloads only PDF responses from fixed backend with no redirects', async () => {
  const response = await documents(request(code), true, async (url, options) => {
    assert.equal(url, `https://app.marwaazpn.com/api/public/references/${code}/document`);
    assert.equal(options.redirect, 'error');
    return new Response('%PDF-1.7\ntest', { headers: { 'Content-Type': 'application/pdf' } });
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-disposition'), /attachment/);
  assert.match(await response.text(), /^%PDF-/);
});
test('handles missing archives and suppresses backend error details', async () => {
  for (const [status, expected] of [[404,404], [429,429], [500,502]]) {
    const response = await documents(request(code), true, async () => new Response('secret backend details', {status}));
    assert.equal(response.status, expected);
    assert.doesNotMatch(await response.text(), /secret/);
  }
  assert.equal((await documents(request(code), true, async () => new Response('fake', {headers:{'Content-Type':'application/pdf'}}))).status, 502);
});
