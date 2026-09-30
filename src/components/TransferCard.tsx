'use client';

import React, { useState } from 'react';
import { TransferRecommendation } from '@/types';
import { getPhcById } from '@/data/phcs';
import { getMedicineById } from '@/data/medicines';
import { ArrowRight, Check, X, ShieldAlert, ChevronDown, ChevronUp, BrainCircuit, Navigation } from 'lucide-react';

export interface TransferCardProps {
  transfer: TransferRecommendation;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
  isFirst?: boolean;
}

export default function TransferCard({ 
  transfer, 
  onApprove, 
  onReject, 
  showActions = true,
  isFirst = false 
}: TransferCardProps) {
  const [expanded, setExpanded] = useState(isFirst && transfer.status === 'pending');

  const sourcePhc = getPhcById(transfer.fromPhcId);
  const destPhc = getPhcById(transfer.toPhcId);
  const medicine = getMedicineById(transfer.medicineId);

  if (!sourcePhc || !destPhc || !medicine) return null;

  const isPending = transfer.status === 'pending';
  const isApproved = transfer.status === 'approved' || transfer.status === 'completed';
  const isRejected = transfer.status === 'rejected';

  const urgencyColors = {
    Critical: 'text-red-700 bg-red-100 border-red-200',
    High: 'text-orange-700 bg-orange-100 border-orange-200',
    Medium: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    Low: 'text-green-700 bg-green-100 border-green-200',
  };

  // Mock relative time generator
  const getRelativeTime = (dateStr: string) => {
    const ms = new Date().getTime() - new Date(dateStr).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins || 1} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${isRejected ? 'opacity-60 grayscale-[50%]' : 'hover:shadow-md'} ${isApproved ? 'border-green-300' : 'border-gray-200'}`}>
      
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${urgencyColors[transfer.urgency]}`}>
            {transfer.urgency} Urgency
          </span>
          <span className="text-xs text-gray-500 font-medium">Generated {getRelativeTime(transfer.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
          <BrainCircuit size={14} />
          AI Confidence: 94%
        </div>
      </div>

      {/* Main Content */}
      <div className={`p-4 relative ${isApproved ? 'bg-gradient-to-r from-green-50/30 to-white' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{medicine.name}</h3>
            <p className="text-sm text-gray-500">{medicine.category} • Transfer Quantity: <span className="font-bold text-gray-900">{transfer.quantity} {medicine.unit}</span></p>
          </div>
          
          {isPending && showActions && onApprove && onReject && (
            <div className="flex gap-2">
              <button 
                onClick={() => onReject(transfer.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Reject"
              >
                <X size={20} />
              </button>
              <button 
                onClick={() => onApprove(transfer.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
              >
                <Check size={16} /> Approve
              </button>
            </div>
          )}

          {!isPending && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
              isApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {isApproved ? <Check size={16} /> : <X size={16} />}
              {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
            </div>
          )}
        </div>

        {/* Transfer Path Visualization */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-2 relative overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideRight {
              0% { transform: translateX(-10px); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateX(10px); opacity: 0; }
            }
            .animate-slide-right { animation: slideRight 1.5s infinite; }
          `}} />
          
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500 font-medium mb-1">SOURCE (SURPLUS)</p>
            <p className="font-bold text-gray-900">{sourcePhc.name}</p>
            <p className="text-xs text-green-600 font-medium mt-1">Has {transfer.reasoning.sourceRemainingStock + transfer.quantity} {medicine.unit}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center w-24">
            <div className="w-full h-1 bg-gray-300 relative rounded-full overflow-hidden flex items-center justify-center">
              {isPending && <div className="absolute animate-slide-right"><ArrowRight size={16} className="text-indigo-600" /></div>}
              {!isPending && <div className="w-full h-full bg-gray-400"></div>}
            </div>
            <div className="mt-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {transfer.quantity} {medicine.unit}
            </div>
          </div>
          
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500 font-medium mb-1">DESTINATION (CRITICAL)</p>
            <p className="font-bold text-gray-900">{destPhc.name}</p>
            <p className="text-xs text-red-600 font-medium mt-1">Stock out risk!</p>
          </div>
        </div>
      </div>

      {/* AI Reasoning Section */}
      <div className="border-t border-gray-100">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-500" />
            AI Reasoning & Impact
          </span>
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        
        {expanded && (
          <div className="px-4 pb-4 pt-2 text-sm text-gray-600 bg-gray-50/50 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-900 mb-1">Why this destination?</p>
                <p>{transfer.reasoning.whyRecipientAtRisk}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Why this source?</p>
                <p>{transfer.reasoning.whySourceSuitable}</p>
                <p className="mt-1 text-xs text-green-700 bg-green-50 inline-block px-1.5 py-0.5 rounded border border-green-200">
                  Safely remains {transfer.reasoning.sourceRemainingStock - transfer.reasoning.sourceBufferRequired} {medicine.unit} above buffer.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3">
              <Navigation className="text-blue-500 mt-0.5" size={18} />
              <div>
                <p className="font-medium text-blue-900">Expected Impact</p>
                <p className="text-blue-800">{transfer.reasoning.expectedRiskReduction}</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
