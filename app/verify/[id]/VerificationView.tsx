'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowLeft, CalendarDays, FileCheck2, FileText, LoaderCircle, MapPinned, Phone, ShieldCheck, ShieldX } from 'lucide-react';
const VerificationMap = dynamic(() => import('./VerificationMap'), { ssr: false });
type Survey = { serial_no: number; survey_no?: string | null; neighborhood?: string; land_type?: string; sketch_area?: string; gps_location?: string; polygon_boundary?: string };
type Reference = { ref_number: string; subject?: string | null; issue_date?: string | null; document_summary?: string | null; surveys?: Survey | null };

export default function VerificationView({ id }: { id: string }) {
  const [record, setRecord] = useState<Reference | null>(null); const [state, setState] = useState<'awaiting'|'loading'|'ready'|'error'>('awaiting'); const [phone, setPhone] = useState('');
  const verify = async (event: FormEvent) => { event.preventDefault(); setState('loading'); try { const response = await fetch('https://app.marwaazpn.com/api/public/references/verify', { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reference: id, phone }) }); if (!response.ok) { setState('error'); return; } const data = await response.json(); setRecord(data.reference); setPhone(''); setState('ready'); } catch { setState('error'); } };
  const survey = record?.surveys; const hasMap = Boolean(survey?.polygon_boundary || survey?.gps_location);
  return <main className="verify-page"><div className="verify-shell">
    <div className="verify-topbar"><Link className="verify-brand" href="/"><img src="/logo.png" alt="Nootaayo Marwaaz" /><span><strong>NOOTAAYO MARWAAZ</strong><span>Public Notary · Baydhabo</span></span></Link><Link className="verify-back" href="/#verify"><ArrowLeft size={15}/> Dib u noqo</Link></div>
    <article className="verify-card"><header className="verify-hero"><span className="verify-badge"><ShieldCheck size={14}/> XAQIIJIN RASMI AH</span><h1>Hubinta Warqadda</h1><p>Xogtan waxaa si toos ah looga hubiyey diiwaanka Nootaayo Marwaaz.</p></header>
      {(state === 'awaiting'||state === 'loading'||state === 'error') && <div className="verify-phone-panel"><div className="verify-reference"><span><FileCheck2 size={23}/></span><div><small>Reference-ka la hubinayo</small><strong>{id}</strong></div></div><form onSubmit={verify}><label htmlFor="verify-phone">Lambarka telefoonka warqadda ku qoran</label><div className="verify-phone-input"><Phone size={18}/><input id="verify-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={event=>{setPhone(event.target.value);if(state==='error')setState('awaiting')}} required placeholder="Tusaale: 0612345678"/><button disabled={state==='loading'} type="submit">{state==='loading'?<LoaderCircle className="animate-spin" size={18}/>:<ShieldCheck size={18}/>} Xaqiiji</button></div>{state==='error'&&<p className="verify-error"><ShieldX size={15}/> Xogta la geliyey lama xaqiijin. Hubi reference-ka iyo telefoonka.</p>}<p className="verify-help">Telefoonka waxaa lagu barbar dhigaa lambarka ku jira dukumiintiga; laguma kaydinayo browser-ka.</p></form></div>}
      {state === 'ready' && record && <><div className="verify-success"><ShieldCheck size={21}/> Warqaddan waa sax waana ka diiwaangashan tahay Nootaayo Marwaaz</div><div className="verify-body">
        <div className="verify-reference"><span><FileCheck2 size={23}/></span><div><small>Official reference record</small><strong>{record.ref_number}</strong></div></div>
        <div className="verify-grid"><div className="verify-field"><small>Ujeeddo</small><strong>{record.subject}</strong></div><div className="verify-field"><small>Taariikhda</small><strong><CalendarDays size={14} style={{verticalAlign:'middle',marginRight:6}}/>{record.issue_date?new Date(record.issue_date).toLocaleDateString('so-SO'):'-'}</strong></div></div>
        {record.document_summary && <section className="verify-document"><div className="verify-document-heading"><span><FileText size={19}/></span><div><small>Dukumiinti la xaqiijiyey</small><h2>Dulmar warqadeed</h2></div></div><div className="verify-document-summary">{record.document_summary}</div><p className="verify-document-note"><ShieldCheck size={14}/> Nuxurkan waxaa laga soo saaray warqadda ku kaydsan diiwaanka rasmiga ah.</p></section>}
        {survey && <><h2 className="verify-section-title"><MapPinned size={17}/> Xogta survey-ga ku xiran</h2><div className="verify-grid"><div className="verify-field"><small>Survey Lr.</small><strong>{survey.survey_no||survey.serial_no}</strong></div><div className="verify-field"><small>Nooca dhulka</small><strong>{survey.land_type||'-'}</strong></div><div className="verify-field"><small>Xaafadda</small><strong>{survey.neighborhood||'-'}</strong></div><div className="verify-field"><small>Cabbirka</small><strong>{survey.sketch_area||'-'}</strong></div></div>{hasMap&&<div className="verify-map"><VerificationMap polygon={survey.polygon_boundary} gps={survey.gps_location}/></div>}</>}
      </div></>}
    </article>
  </div></main>;
}
