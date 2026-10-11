import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CivicReport } from '../types';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface CityLeafletMapProps {
  reports: CivicReport[];
  additionalReports?: CivicReport[];
  onSelectReport?: (reportId: string) => void;
}

// Fallback coordinate generator for reports without explicit GPS coordinates
function getReportCoordinates(report: CivicReport, index: number): [number, number] {
  if (report.coordinates?.lat && report.coordinates?.lng) {
    return [report.coordinates.lat, report.coordinates.lng];
  }
  // Approximate coordinate grid around Bengaluru metropolitan area
  const baseLat = 12.9716;
  const baseLng = 77.5946;
  const latOffset = ((index * 37) % 100 - 50) * 0.0018;
  const lngOffset = ((index * 53) % 100 - 50) * 0.0022;
  return [baseLat + latOffset, baseLng + lngOffset];
}

export const CityLeafletMap: React.FC<CityLeafletMapProps> = ({
  reports,
  additionalReports = [],
  onSelectReport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Resolved' | 'Escalated' | 'Pending'>('All');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.965, 77.62],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    // Clear previous markers
    markersGroup.clearLayers();

    // Filter reports
    const allReports = [...reports, ...additionalReports];
    const filtered = allReports.filter((r) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Resolved') return r.status === 'Resolved';
      if (activeFilter === 'Escalated') return r.status === 'Escalated';
      if (activeFilter === 'Pending') return r.status === 'Filed' || r.status === 'Reminder Sent';
      return true;
    });

    const latLngBounds = L.latLngBounds([]);

    filtered.forEach((r, idx) => {
      const [lat, lng] = getReportCoordinates(r, idx);
      latLngBounds.extend([lat, lng]);

      // Custom DivIcon styled according to status
      let pinColor = '#F59E0B'; // Amber default
      let pinBorder = '#D97706';
      let statusLabel = 'Filed';

      if (r.status === 'Resolved') {
        pinColor = '#10B981'; // Green
        pinBorder = '#059669';
        statusLabel = 'Resolved';
      } else if (r.status === 'Escalated') {
        pinColor = '#EF4444'; // Red
        pinBorder = '#B91C1C';
        statusLabel = 'Escalated';
      } else if (r.status === 'Not Actually Fixed') {
        pinColor = '#F97316'; // Orange
        pinBorder = '#EA580C';
        statusLabel = 'Fake Fix';
      } else if (r.status === 'Reminder Sent') {
        pinColor = '#3B82F6'; // Blue
        pinBorder = '#1D4ED8';
        statusLabel = 'Reminder';
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${
              r.status === 'Escalated'
                ? `<div style="
                    position: absolute;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.4);
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></div>`
                : ''
            }
            <div style="
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: ${pinColor};
              border: 2px solid #FFFFFF;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 13px;
              font-weight: bold;
              cursor: pointer;
            ">
              ●
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersGroup);

      // Popup Content
      const popupHtml = `
        <div style="min-width: 210px; max-width: 260px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; color: #64748B; font-family: monospace;">
              #${r.id}
            </span>
            <span style="
              font-size: 10px;
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 999px;
              background: ${pinColor}20;
              color: ${pinBorder};
              border: 1px solid ${pinColor}40;
            ">
              ${statusLabel}
            </span>
          </div>

          <div style="font-size: 13px; font-weight: 800; color: #0F172A; line-height: 1.3; margin-bottom: 5px;">
            ${r.problemType}
          </div>

          <div style="font-size: 11px; color: #475569; display: flex; align-items: center; gap: 4px; margin-bottom: 10px;">
            📍 <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.location}</span>
          </div>

          <button
            id="btn-inspect-${r.id}"
            style="
              width: 100%;
              background: #0B3D2E;
              color: #FFFFFF;
              font-weight: 700;
              font-size: 11px;
              padding: 6px 12px;
              border-radius: 8px;
              border: none;
              cursor: pointer;
              transition: background 0.2s;
            "
          >
            Inspect Report Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        className: 'custom-popup-styled',
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${r.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectReport) {
              onSelectReport(r.id);
            }
          };
        }
      });
    });

    // Fit bounds if markers exist
    if (filtered.length > 0 && latLngBounds.isValid()) {
      map.fitBounds(latLngBounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [reports, activeFilter, onSelectReport]);

  const handleCenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.965, 77.62], 12);
    }
  };

  return (
    <div className="space-y-3">
      {/* Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Filter Pins */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#071f16] p-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 font-semibold">
          {(['All', 'Resolved', 'Escalated', 'Pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === f
                  ? 'bg-white dark:bg-[#0c2e22] text-[#0B3D2E] dark:text-emerald-300 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {f} Pins
            </button>
          ))}
        </div>

        {/* Legend & Reset view */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Resolved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Escalated
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Pending
            </span>
          </div>

          <button
            onClick={handleCenterMap}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071f16] hover:bg-slate-200 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 font-bold border border-slate-200 dark:border-emerald-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Center View</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-300 dark:border-emerald-900/60 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>
      <p className="text-[10px] text-slate-400 italic">
        * Map includes {additionalReports.length} sample incidents for visualization purposes.
      </p>
    </div>
  );
};
