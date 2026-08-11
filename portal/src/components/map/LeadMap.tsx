'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Lead } from '@/types/db';
import { STATUS_COLORS } from '@/types/db';
import { CUISINE_META, cuisineSvg } from '@/lib/cuisine';

// Centred on the seeded sales territory: the Køge → Solrød → Copenhagen
// corridor plus Roskilde. Zoom 11 frames the whole corridor.
const DEFAULT_CENTER: [number, number] = [55.605, 12.35];
const DEFAULT_ZOOM = 11;

/**
 * Teardrop pin: the fill carries lead status (or the user's custom colour
 * override), the glyph inside carries the cuisine. Built as raw HTML so we
 * avoid pulling react-dom/server into the client bundle.
 */
function pinIcon(lead: Lead, selected: boolean) {
  const fill = lead.color || STATUS_COLORS[lead.status];
  const size = selected ? 40 : 32;
  const glyph = selected ? 17 : 14;
  return L.divIcon({
    className: 'na-pin',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 32 32" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
          <path d="M16 1c-6.1 0-11 4.8-11 10.8 0 7.9 9.6 18.2 10 18.6a1.4 1.4 0 0 0 2 0c.4-.4 10-10.7 10-18.6C27 5.8 22.1 1 16 1z"
                fill="${fill}" stroke="${selected ? '#0f172a' : '#ffffff'}" stroke-width="${selected ? 2.5 : 2}"/>
        </svg>
        <span style="position:absolute;left:50%;top:${selected ? 9 : 7}px;transform:translateX(-50%);line-height:0;">
          ${cuisineSvg(lead.cuisine, glyph, '#ffffff')}
        </span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    tooltipAnchor: [0, -size + 4],
  });
}

/**
 * Leaflet caches the container size at init and never re-measures on its own.
 * The pane is sized in dvh on phones, so it changes on orientation flips, when
 * the mobile URL bar collapses, and when the filter drawer opens — all of which
 * leave grey tiles until we invalidate.
 */
function ResizeWatcher() {
  const map = useMap();

  useEffect(() => {
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => map.invalidateSize());
    });
    observer.observe(map.getContainer());
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

function ClickCapture({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LeadMap({
  leads,
  selectedId,
  onSelect,
  onMapClick,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}: {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (lead: Lead) => void;
  onMapClick?: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
}) {
  // Rebuild icons only when the visual inputs actually change.
  const markers = useMemo(
    () => leads.map((lead) => ({ lead, icon: pinIcon(lead, lead.id === selectedId) })),
    [leads, selectedId]
  );

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ResizeWatcher />
      <ClickCapture onMapClick={onMapClick} />
      {markers.map(({ lead, icon }) => (
        <Marker
          key={lead.id}
          position={[lead.lat, lead.lng]}
          icon={icon}
          zIndexOffset={lead.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(lead) }}
        >
          <Tooltip direction="top">
            <span className="font-semibold">{lead.name}</span>
            <br />
            {CUISINE_META[lead.cuisine].label} · {lead.status}
            {lead.phone ? <><br /><span className="text-slate-500">{lead.phone}</span></> : null}
            {lead.email ? <><br /><span className="text-slate-500">{lead.email}</span></> : null}
            {lead.address ? <><br /><span className="text-slate-500">{lead.address}</span></> : null}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
