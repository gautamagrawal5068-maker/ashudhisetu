import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 py-6 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold text-[10px]">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-800">AushadhiSetu (औषधिसेतु)</span>
              <span className="text-slate-400 ml-2">National Health Mission Prototype</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>AI-Assisted Medicine Stock-out Prevention • Safe Inter-PHC Redistribution</span>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            District Madhavpur Telemetry • v1.2
          </div>
        </div>
      </div>
    </footer>
  );
}
