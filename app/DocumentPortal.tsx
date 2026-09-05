"use client";
import { useEffect, useState } from 'react';
import { Download, LockKeyhole } from 'lucide-react';

export default function DocumentPortal({ lang }: { lang: 'so' | 'en' }) {
  const [enabled, setEnabled] = useState(false);
  const [checking, setChecking] = useState(true);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const t = (so: string, en: string) => lang === 'so' ? so : en;
  useEffect(() => {
    fetch('/api/documents', { cache: 'no-store' }).then(r => r.json()).then(d => setEnabled(d.enabled === true)).catch(() => setEnabled(false)).finally(() => setChecking(false));
  }, []);
  const messages: Record<string, [string, string]> = {
    invalid: ['Geli koodhka gaarka ah ama xiriiriyaha QR-ka ee xafiisku ku siiyey.', 'Enter the private code or QR link provided by the office.'],
    not_found: ['Warqadda lama helin ama weli lama kaydin. La xiriir xafiiska.', 'Document not found or not yet archived. Contact the office.'],
    rate_limited: ['Codsiyo badan ayaa dhacay. Wax yar sug oo mar kale isku day.', 'Too many requests. Wait a moment and try again.'],
    unavailable: ['Soo-dejinta hadda lama heli karo. Fadlan la xiriir xafiiska.', 'Downloads are currently unavailable. Please contact the office.'],
    too_large: ['Warqaddan xafiiska ka codso; cabbirkeedu wuu weyn yahay.', 'Please request this document from the office; it is too large.'],
    success: ['Warqadda PDF-ka waa la diyaariyey. Ka eeg faylasha aad soo dejisay.', 'Your PDF is ready. Check your downloads.'],
  };
  return <div className="verification-console glass-card document-portal">
    <LockKeyhole size={32} aria-hidden="true" />
    <h3>{t('Soo dejiso warqaddaada', 'Download your document')}</h3>
    <p>{t('Isticmaal koodhka gaarka ah ama xiriiriyaha QR-ka ee xafiisku ku siiyey. Lambarka tixraaca keliya kuma filna.', 'Use the private code or QR link issued by the office. A reference number alone is not sufficient.')}</p>
    <form onSubmit={async e => {
      e.preventDefault(); if (!enabled || busy) return;
      setBusy(true); setMessage('');
      try {
        const response = await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
        if (!response.ok) { const data = await response.json(); setMessage(messages[data.error] ? data.error : 'unavailable'); return; }
        const blob = await response.blob(); const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = 'Marwaaz-document.pdf'; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000); setCode(''); setMessage('success');
      } catch { setMessage('unavailable'); } finally { setBusy(false); }
    }}>
      <label htmlFor="document-code">{t('Koodhka gaarka ah / Xiriiriyaha QR-ka', 'Private code / QR link')}</label>
      <input id="document-code" type="text" value={code} onChange={e => { setCode(e.target.value); setMessage(''); }} maxLength={512} required autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={!enabled || busy} aria-describedby="document-status" />
      <button className="button button-gold" disabled={!enabled || busy} type="submit"><Download size={18} />{busy ? t('Waa la soo dejinayaa…', 'Downloading…') : t('Soo deji PDF', 'Download PDF')}</button>
    </form>
    <p id="document-status" role="status" aria-live="polite">{checking ? t('Adeegga waa la hubinayaa…', 'Checking availability…') : !enabled ? t('Soo-dejinta onlaynka ah hadda way xiran tahay. Nuqulkaaga ka codso xafiiska.', 'Online downloads are currently unavailable. Request your copy from the office.') : message ? t(...messages[message]) : t('Koodhkan waa gaar kuu ah. Ha la wadaagin dadka kale.', 'This code is private. Do not share it with others.')}</p>
    <a className="text-link" href="#contact">{t('La xiriir xafiiska', 'Contact the office')}</a>
  </div>;
}
