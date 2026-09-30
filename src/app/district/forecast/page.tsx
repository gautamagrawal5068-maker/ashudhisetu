'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StockTable from '@/components/StockTable';
import { TrendingUp, Info, ChevronDown, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { phcs } from '@/data/phcs';
import { medicines } from '@/data/medicines';

export default function ForecastPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { forecasts } = useInventory();
  const [mounted, setMounted] = useState(false);
  const [showMethodology, setShowMethodology] = useState(true); // START EXPANDED
  const [filters, setFilters] = useState<{ medicine?: string; riskLevel?: string; block?: string }>({
    medicine: 'All',
    riskLevel: 'All',
    block: 'All',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'district_officer')) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
           <div className="animate-pulse space-y-8">
             <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
             <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
             <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
           </div>
        </main>
      </div>
    );
  }

  // Analytics Calculations
  const criticalCount = forecasts.filter(f => f.riskLevel === 'Critical').length;
  const highCount = forecasts.filter(f => f.riskLevel === 'High').length;
  const normalCount = forecasts.filter(f => f.riskLevel === 'Low').length;
  const total = forecasts.length || 1;

  // Group by medicine to find top risks
  const medicineRisks = medicines.map(med => {
    const medsForecasts = forecasts.filter(f => f.medicineId === med.id);
    const criticalMedForecasts = medsForecasts.filter(f => f.riskLevel === 'Critical');
    
    return {
      med,
      criticalCount: criticalMedForecasts.length,
      affectedPhcs: criticalMedForecasts.map(f => {
        const phc = phcs.find(p => p.id === f.phcId);
        return { name: phc?.name || 'Unknown', daysRemaining: f.daysRemaining };
      })
    };
  }).filter(m => m.criticalCount > 0).sort((a, b) => b.criticalCount - a.criticalCount);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Predictive Analytics & Forecasting</h1>
            <p className="text-gray-500 dark:text-gray-400">AI-driven consumption predictions based on historical trends and seasonal factors.</p>
          </div>
        </div>

        {/* Methodology Section - Expanded by default */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all">
          <button 
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
            onClick={() => setShowMethodology(!showMethodology)}
          >
            <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300">
              <Info size={18} className="text-blue-500" /> Forecasting Engine Methodology
            </div>
            <ChevronDown size={20} className={`text-gray-500 transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
          </button>
          
          {showMethodology && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Our prediction model calculates the estimated daily consumption dynamically, adjusting for seasonal surges (e.g., Malaria in Monsoon) and facility patient load.
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-inner border border-gray-700">
                  <div className="text-blue-400 mb-2">// Core Prediction Formula</div>
                  <div className="mb-4 text-lg">P = μ₇ × Sₘ × Fₚ</div>
                  <div>Where:</div>
                  <div className="pl-4">P  = Predicted daily consumption</div>
                  <div className="pl-4">μ₇ = 7-day moving average</div>
                  <div className="pl-4">Sₘ = Seasonal multiplier</div>
                  <div className="pl-4">Fₚ = Patient footfall multiplier</div>
                  <div className="mt-4 pt-4 border-t border-gray-700 text-yellow-300">
                    Days Remaining = Current Stock ÷ P
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Risk Thresholds</h4>
                <div className="space-y-4">
                  {/* Visual Bar */}
                  <div className="relative h-4 rounded-full overflow-hidden flex w-full">
                    <div className="bg-red-500 h-full" style={{ width: '15%' }}></div>
                    <div className="bg-orange-500 h-full" style={{ width: '20%' }}></div>
                    <div className="bg-green-500 h-full" style={{ width: '65%' }}></div>
                  </div>
                  {/* Labels */}
                  <div className="relative flex justify-between text-xs text-gray-500 font-medium px-1">
                    <span>0 days</span>
                    <span className="absolute left-[15%] -translate-x-1/2">3 days</span>
                    <span className="absolute left-[35%] -translate-x-1/2">7 days</span>
                    <span>14+ days</span>
                  </div>

                  <ul className="space-y-3 mt-6">
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100 block">Critical Risk (&lt; 3 days)</strong>
                        <span className="text-sm text-gray-500">Immediate action required. Transfer recommended.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5"></div>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100 block">High Risk (3 - 7 days)</strong>
                        <span className="text-sm text-gray-500">Monitor closely. Plan next procurement.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2"><Activity size={18}/> District Risk Distribution</h3>
            
            <div className="h-12 w-full flex rounded-xl overflow-hidden shadow-sm mb-4 border border-gray-100 dark:border-gray-700">
              <div className="bg-red-500 flex items-center justify-center text-white font-bold text-sm transition-all hover:opacity-90" style={{ width: `${(criticalCount/total)*100}%` }}>
                {(criticalCount/total) > 0.05 && `${Math.round((criticalCount/total)*100)}%`}
              </div>
              <div className="bg-orange-500 flex items-center justify-center text-white font-bold text-sm transition-all hover:opacity-90" style={{ width: `${(highCount/total)*100}%` }}>
                {(highCount/total) > 0.05 && `${Math.round((highCount/total)*100)}%`}
              </div>
              <div className="bg-green-500 flex items-center justify-center text-white font-bold text-sm transition-all hover:opacity-90" style={{ width: `${(normalCount/total)*100}%` }}>
                {(normalCount/total) > 0.1 && `${Math.round((normalCount/total)*100)}%`}
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="text-center"><div className="font-bold text-red-600">{criticalCount}</div><div className="text-gray-500">Critical</div></div>
              <div className="text-center"><div className="font-bold text-orange-600">{highCount}</div><div className="text-gray-500">High Risk</div></div>
              <div className="text-center"><div className="font-bold text-green-600">{normalCount}</div><div className="text-gray-500">Healthy</div></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 shadow-sm border border-red-100 dark:border-red-900/30">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
              <ShieldAlert size={18}/> Highest Risk Items
            </h3>
            <div className="space-y-4">
              {medicineRisks.slice(0, 3).map((mr, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-red-100 dark:border-red-900/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">{mr.med.name}</span>
                    <span className="text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">{mr.criticalCount} PHCs</span>
                  </div>
                  <div className="space-y-1">
                    {mr.affectedPhcs.slice(0, 2).map((p, i) => (
                      <div key={i} className="flex justify-between text-xs items-center">
                        <span className="text-gray-600 dark:text-gray-300 truncate w-32">{p.name}</span>
                        <div className="flex-1 mx-2 bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-red-500 h-full" style={{ width: `${Math.max(5, (p.daysRemaining / 7) * 100)}%`}}></div>
                        </div>
                        <span className="text-red-600 dark:text-red-400 font-medium w-8 text-right">{p.daysRemaining}d</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {medicineRisks.length === 0 && <p className="text-gray-500 text-sm">No critical medicines found.</p>}
            </div>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
             <div>
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Detailed Forecast Data</h2>
               <p className="text-xs text-gray-500">Click on any row to expand the detailed AI calculation rationale</p>
             </div>
             
             {/* Filter Controls */}
             <div className="flex flex-wrap items-center gap-3">
               <select
                 value={filters.medicine}
                 onChange={(e) => setFilters(f => ({ ...f, medicine: e.target.value }))}
                 className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:ring-blue-500"
               >
                 <option value="All">All Medicines</option>
                 {medicines.map(m => (
                   <option key={m.id} value={m.name}>{m.name}</option>
                 ))}
               </select>

               <select
                 value={filters.riskLevel}
                 onChange={(e) => setFilters(f => ({ ...f, riskLevel: e.target.value }))}
                 className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:ring-blue-500"
               >
                 <option value="All">All Risk Levels</option>
                 <option value="Critical">Critical (&lt;3d)</option>
                 <option value="High">High (3-7d)</option>
                 <option value="Medium">Medium (7-14d)</option>
                 <option value="Low">Low (&gt;14d)</option>
               </select>

               <select
                 value={filters.block}
                 onChange={(e) => setFilters(f => ({ ...f, block: e.target.value }))}
                 className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:ring-blue-500"
               >
                 <option value="All">All Blocks</option>
                 {Array.from(new Set(phcs.map(p => p.block))).map(b => (
                   <option key={b} value={b}>{b} Block</option>
                 ))}
               </select>

               {(filters.medicine !== 'All' || filters.riskLevel !== 'All' || filters.block !== 'All') && (
                 <button
                   onClick={() => setFilters({ medicine: 'All', riskLevel: 'All', block: 'All' })}
                   className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                 >
                   Reset
                 </button>
               )}
             </div>
          </div>
          <StockTable forecasts={forecasts} filters={filters} showPhcColumn={true} />
        </div>

      </main>
      <Footer />
    </div>
  );
}
