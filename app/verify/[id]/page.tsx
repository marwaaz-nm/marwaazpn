import type { Metadata } from 'next';
import VerificationView from './VerificationView';
export const metadata: Metadata = { title: 'Xaqiijinta Warqadda | Nootaayo Marwaaz', robots: { index: false, follow: false } };
export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <VerificationView id={decodeURIComponent(id)} />; }
