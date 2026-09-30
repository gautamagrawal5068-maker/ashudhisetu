'use client';

import React, { useState } from 'react';
import { PHC, ForecastResult, TransferRecommendation } from '@/types';
import { getPhcById } from '@/data/phcs';
import { getMedicineById } from '@/data/medicines';

import { phcs as defaultPhcs } from '@/data/phcs';
import { useInventory } from '@/context/InventoryContext';

export interface DistrictMapProps {
  phcs?: PHC[];
  forecasts?: ForecastResult[];
  onPhcClick?: (phcId: string) => void;
  transfers?: TransferRecommendation[];
}

// Utility to map lat/lng to X/Y
const mapToX = (lng: number) => 60 + ((lng - 77.30) / (77.57 - 77.30)) * (740 - 60);
const mapToY = (lat: number) => 520 - ((lat - 23.10) / (23.33 - 23.10)) * (520 - 80);

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Critical': return '#ef4444'; // red-500
    case 'High': return '#f97316'; // orange-500
    case 'Medium': return '#eab308'; // yellow-500
    case 'Low': return '#22c55e'; // green-500
    default: return '#9ca3af'; // gray-400
  }
};

const getPhcWorstRisk = (phcId: string, forecasts: ForecastResult[]) => {
  const phcForecasts = (forecasts || []).filter(f => f.phcId === phcId);
  if (phcForecasts.some(f => f.riskLevel === 'Critical')) return 'Critical';
  if (phcForecasts.some(f => f.riskLevel === 'High')) return 'High';
  if (phcForecasts.some(f => f.riskLevel === 'Medium')) return 'Medium';
  return 'Low';
};

export default function DistrictMap({ 
  phcs: propPhcs, 
  forecasts: propForecasts, 
  onPhcClick, 
  transfers: propTransfers 
}: DistrictMapProps = {}) {
  const { forecasts: contextForecasts, transfers: contextTransfers } = useInventory();
  const phcs = propPhcs || defaultPhcs;
  const forecasts = propForecasts || contextForecasts || [];
  const transfers = propTransfers || contextTransfers || [];
  const [hoveredPhc, setHoveredPhc] = useState<string | null>(null);

  const renderTooltip = () => {
    if (!hoveredPhc) return null;
    const phc = phcs.find(p => p.id === hoveredPhc);
    if (!phc) return null;

    const phcForecasts = forecasts.filter(f => f.phcId === hoveredPhc);
    const riskCounts = {
      Critical: phcForecasts.filter(f => f.riskLevel === 'Critical').length,
      High: phcForecasts.filter(f => f.riskLevel === 'High').length,
      Medium: phcForecasts.filter(f => f.riskLevel === 'Medium').length,
      Low: phcForecasts.filter(f => f.riskLevel === 'Low').length,
    };
    const worstRisk = getPhcWorstRisk(hoveredPhc, forecasts);
    const x = mapToX(phc.longitude);
    const y = mapToY(phc.latitude) - 40;

    return (
      <foreignObject x={x - 100} y={y - 120} width="200" height="140" style={{ pointerEvents: 'none' }}>
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 text-sm">
          <div className="font-bold text-base mb-1">{phc.name}</div>
          <div className="text-gray-400 text-xs mb-2">{phc.block} Block</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> {riskCounts.Critical} Critical</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> {riskCounts.High} High</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> {riskCounts.Medium} Medium</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> {riskCounts.Low} Low</div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700 text-center font-semibold" style={{ color: getRiskColor(worstRisk) }}>
            Status: {worstRisk}
          </div>
        </div>
      </foreignObject>
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#f8f9fa] border border-gray-200 shadow-inner">
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 p-2 px-4 rounded-full shadow-sm z-10 font-semibold text-gray-800">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        District Madhavpur — Demo Map
      </div>

      <svg viewBox="0 0 800 600" className="w-full h-auto">
        <defs>
          <pattern id="topo" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5"/>
            <circle cx="20" cy="20" r="1" fill="#d1d5db" />
          </pattern>
          <style>
            {`
              @keyframes pulse {
                0% { r: 18; opacity: 1; stroke-width: 2; }
                100% { r: 35; opacity: 0; stroke-width: 0; }
              }
              @keyframes dash {
                to { stroke-dashoffset: -20; }
              }
              .critical-pulse { transform-origin: center; animation: pulse 1.5s infinite; fill: none; stroke: #ef4444; }
              .transfer-arrow { stroke-dasharray: 8 4; animation: dash 1s linear infinite; }
            `}
          </style>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" />
          </marker>
        </defs>

        {/* District Boundary & Background */}
        <polygon points="40,60 760,40 780,560 60,580" fill="url(#topo)" stroke="#d1d5db" strokeWidth="2" />
        <polygon points="40,60 760,40 780,560 60,580" fill="#f0fdf4" opacity="0.4" />

        {/* Block Regions */}
        {/* Sadar: northeast-ish */}
        <polygon points="400,60 750,50 760,250 400,280" fill="#e0f2fe" opacity="0.5" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="5,5" />
        <text x="580" y="150" fill="#0284c7" opacity="0.7" fontWeight="bold" fontSize="18" textAnchor="middle">Sadar Block</text>

        {/* Mofussil: east */}
        <polygon points="400,280 760,250 770,550 400,500" fill="#fef08a" opacity="0.3" stroke="#fde047" strokeWidth="2" strokeDasharray="5,5" />
        <text x="580" y="380" fill="#ca8a04" opacity="0.7" fontWeight="bold" fontSize="18" textAnchor="middle">Mofussil Block</text>

        {/* Tribal: west */}
        <polygon points="50,250 400,280 400,500 60,570" fill="#dcfce7" opacity="0.4" stroke="#86efac" strokeWidth="2" strokeDasharray="5,5" />
        <text x="220" y="400" fill="#16a34a" opacity="0.7" fontWeight="bold" fontSize="18" textAnchor="middle">Tribal Block</text>

        {/* Riverside: north */}
        <polygon points="45,65 400,60 400,280 50,250" fill="#f3e8ff" opacity="0.4" stroke="#d8b4fe" strokeWidth="2" strokeDasharray="5,5" />
        <text x="220" y="160" fill="#9333ea" opacity="0.7" fontWeight="bold" fontSize="18" textAnchor="middle">Riverside Block</text>

        {/* Hilltop: south */}
        <polygon points="60,570 400,500 770,550 400,580" fill="#ffedd5" opacity="0.4" stroke="#fdba74" strokeWidth="2" strokeDasharray="5,5" />
        <text x="400" y="550" fill="#ea580c" opacity="0.7" fontWeight="bold" fontSize="18" textAnchor="middle">Hilltop Block</text>

        {/* Geographic Features */}
        {/* River */}
        <path d="M 80,40 Q 200,200 400,300 T 780,480" fill="none" stroke="#3b82f6" strokeWidth="8" opacity="0.4" strokeLinecap="round" />
        
        {/* Roads */}
        <path d="M 60,200 Q 400,250 700,100" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="6,4" />
        <path d="M 300,50 Q 350,300 600,550" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="6,4" />

        {/* Hill Indicators */}
        <g stroke="#9a3412" fill="none" strokeWidth="1.5" opacity="0.6">
          <path d="M 380,530 L 390,510 L 400,530" />
          <path d="M 420,540 L 435,515 L 450,540" />
          <path d="M 410,535 L 420,520 L 430,535" />
        </g>

        {/* Tree Clusters */}
        <g fill="#15803d" opacity="0.6">
          <circle cx="150" cy="350" r="3" /><circle cx="155" cy="355" r="4" /><circle cx="145" cy="360" r="3" />
          <circle cx="200" cy="450" r="4" /><circle cx="210" cy="445" r="3" />
        </g>

        {/* Transfers */}
        {transfers.filter(t => t.status === 'pending').map((t, i) => {
          const source = phcs.find(p => p.id === t.fromPhcId);
          const dest = phcs.find(p => p.id === t.toPhcId);
          if (!source || !dest) return null;
          
          const sx = mapToX(source.longitude);
          const sy = mapToY(source.latitude);
          const dx = mapToX(dest.longitude);
          const dy = mapToY(dest.latitude);
          
          // Calculate midpoint for label
          const mx = (sx + dx) / 2;
          const my = (sy + dy) / 2;

          return (
            <g key={`transfer-${i}`}>
              <line 
                x1={sx} y1={sy} x2={dx} y2={dy} 
                stroke="#4f46e5" strokeWidth="2" 
                className="transfer-arrow" 
                markerEnd="url(#arrowhead)" 
              />
              <rect x={mx - 15} y={my - 10} width="30" height="20" rx="4" fill="white" stroke="#4f46e5" strokeWidth="1" />
              <text x={mx} y={my + 4} fontSize="10" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{t.quantity}</text>
            </g>
          );
        })}

        {/* PHC Markers */}
        {phcs.map(phc => {
          const x = mapToX(phc.longitude);
          const y = mapToY(phc.latitude);
          const worstRisk = getPhcWorstRisk(phc.id, forecasts);
          const color = getRiskColor(worstRisk);
          const isCritical = worstRisk === 'Critical';

          return (
            <g 
              key={phc.id} 
              transform={`translate(${x}, ${y})`} 
              onMouseEnter={() => setHoveredPhc(phc.id)}
              onMouseLeave={() => setHoveredPhc(null)}
              onClick={() => onPhcClick?.(phc.id)}
              style={{ cursor: 'pointer' }}
            >
              {isCritical && <circle cx="0" cy="0" r="18" className="critical-pulse" />}
              <circle cx="0" cy="0" r="18" fill="white" stroke={color} strokeWidth="4" />
              <path d="M-5,-1 h3 v-3 h4 v3 h3 v4 h-3 v3 h-4 v-3 h-3 z" fill={color} />
              <text x="0" y="32" fontSize="12" fontWeight="bold" fill="#374151" textAnchor="middle" className="pointer-events-none select-none drop-shadow-md">
                {phc.name.replace('PHC ', '')}
              </text>
            </g>
          );
        })}

        {renderTooltip()}
      </svg>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-md border border-gray-200 text-xs">
        <div className="font-bold mb-2">Risk Levels</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critical (Stockout &lt; 7 days)</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> High (Stockout 7-14 days)</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Medium (Near Buffer)</div>
        <div className="flex items-center gap-2 mb-3"><span className="w-3 h-3 rounded-full bg-green-500"></span> Low (Healthy)</div>
        
        <div className="border-t pt-2 font-bold mb-1">Map Features</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-6 h-0 border-t-2 border-indigo-600 border-dashed"></div> AI Transfer Route</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-6 h-1 bg-blue-400 opacity-60 rounded-full"></div> River</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-6 h-0 border-t-2 border-gray-400 border-dashed"></div> Road</div>
      </div>

      {/* Compass & Scale */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
        <div className="bg-white/90 p-2 rounded-full shadow-md flex flex-col items-center justify-center w-10 h-10 border border-gray-200">
          <div className="text-red-600 text-[10px] font-bold leading-none">N</div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L8 22L12 18L16 22L12 2Z" fill="#374151"/></svg>
        </div>
        <div className="bg-white/90 px-2 py-1 rounded shadow-md border border-gray-200 text-[10px] font-mono flex flex-col items-center">
          <div className="w-16 h-1 border-x-2 border-b-2 border-gray-800 mb-1"></div>
          ~5 km
        </div>
      </div>
    </div>
  );
}
