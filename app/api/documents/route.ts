import { documents } from '../../../lib/documents';
export const dynamic = 'force-dynamic';
export function GET(request: Request) { return documents(request, true); }
export function POST(request: Request) { return documents(request, true); }
