'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';

const polygonPoints = (value?: string): [number, number][] => (value || '').split(';').map(pair => pair.split(',').map(Number) as [number, number]).filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
const gpsPoint = (value?: string): [number, number] | null => { const point = (value || '').split(',').map(Number) as [number, number]; return point.length === 2 && point.every(Number.isFinite) ? point : null; };

export default function VerificationMap({ polygon, gps }: { polygon?: string; gps?: string }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const points = polygonPoints(polygon); const location = gpsPoint(gps);
    if (points.length < 3 && !location) return;
    const map = L.map(container.current, { attributionControl: false, scrollWheelZoom: false });
    L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);
    if (points.length >= 3) { const shape = L.polygon(points, { color: '#16a34a', weight: 3, fillColor: '#22c55e', fillOpacity: .28 }).addTo(map); map.fitBounds(shape.getBounds(), { padding: [28, 28] }); }
    else if (location) { L.circleMarker(location, { radius: 9, color: '#fff', weight: 3, fillColor: '#0f766e', fillOpacity: 1 }).addTo(map); map.setView(location, 19); }
    const timer = setTimeout(() => map.invalidateSize(), 50);
    return () => { clearTimeout(timer); map.remove(); };
  }, [polygon, gps]);
  return <div ref={container} aria-label="Mapka dhulka" />;
}
