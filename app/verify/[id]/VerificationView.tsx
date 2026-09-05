'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, FileCheck2, LoaderCircle, MapPinned, ShieldCheck, ShieldX } from 'lucide-react';
const VerificationMap = dynamic(() => import('./VerificationMap'), { ssr: false });
type Survey = { serial_no: number; survey_no?: string | null; neighborhood?: string; land_type?: string; sketch_area?: string; gps_location?: string; polygon_boundary?: string };
type Reference = { ref_number: string; subject: string; issue_date?: string; surveys?: Survey | null };

export default function VerificationView({ id }: { id: string }) {
  const [record, setRecord] = useState<Reference | null>(null); const [state, setState] = useState<'loading'|'ready'|'missing'|'error'>('loading');
  useEffect(() => { fetch(`https://app.marwaazpn.com/api/public/references/${encodeURIComponent(id)}`, { cache: 'no-store' }).then(async response => { if (!response.ok) { setState(response.status === 404 ? 'missing' : 'error'); return; } const data = await response.json(); setRecord(data.reference); setState('ready'); }).catch(() => setState('error')); }, [id]);
  const survey = record?.surveys; const hasMap = Boolean(survey?.polygon_boundary || survey?.gps_location);
  return <main className="verify-page"><div className="verify-shell">
    <div className="verify-topbar"><Link className="verify-brand" href="/"><img src="/logo.png" alt="Nootaayo Marwaaz" /><span><strong>NOOTAAYO MARWAAZ</strong><span>Public Notary · Baydhabo</span></span></Link><Link className="verify-back" href="/#verify"><ArrowLeft size={15}/> Dib u noqo</Link></div>
    <article className="verify-card"><header className="verify-hero"><span className="verify-badge"><ShieldCheck size={14}/> XAQIIJIN RASMI AH</span><h1>Hubinta Warqadda</h1><p>Xogtan waxaa si toos ah looga hubiyey diiwaanka Nootaayo Marwaaz.</p></header>
      {state === 'loading' && <div className="verify-state"><div><LoaderCircle className="animate-spin" size={34}/><strong>Warqadda waa la hubinayaa…</strong></div></div>}
      {(state === 'missing'||state === 'error') && <div className="verify-state"><div><ShieldX size={38}/><strong>{state === 'missing'?'Warqaddan lama helin':'Adeegga hadda lama heli karo'}</strong><p>Fadlan reference-ka hubi ama la xiriir xafiiska.</p></div></div>}
      {state === 'ready' && record && <><div className="verify-success"><ShieldCheck size={21}/> Warqaddan waa sax waana ka diiwaangashan tahay Nootaayo Marwaaz</div><div className="verify-body">
        <div className="verify-reference"><span><FileCheck2 size={23}/></span><div><small>Official reference record</small><strong>{record.ref_number}</strong></div></div>
        <div className="verify-grid"><div className="verify-field"><small>Ujeeddo</small><strong>{record.subject}</strong></div><div className="verify-field"><small>Taariikhda</small><strong><CalendarDays size={14} style={{verticalAlign:'middle',marginRight:6}}/>{record.issue_date?new Date(record.issue_date).toLocaleDateString('so-SO'):'-'}</strong></div></div>
        {survey && <><h2 className="verify-section-title"><MapPinned size={17}/> Xogta survey-ga ku xiran</h2><div className="verify-grid"><div className="verify-field"><small>Survey Lr.</small><strong>{survey.survey_no||survey.serial_no}</strong></div><div className="verify-field"><small>Nooca dhulka</small><strong>{survey.land_type||'-'}</strong></div><div className="verify-field"><small>Xaafadda</small><strong>{survey.neighborhood||'-'}</strong></div><div className="verify-field"><small>Cabbirka</small><strong>{survey.sketch_area||'-'}</strong></div></div>{hasMap&&<div className="verify-map"><VerificationMap polygon={survey.polygon_boundary} gps={survey.gps_location}/></div>}</>}
      </div></>}
    </article>
  </div></main>;
}
