'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DistrictMap from '@/components/DistrictMap';
import StockTable from '@/components/StockTable';
import { phcs } from '@/data/phcs';
import { medicines } from '@/data/medicines';
import { Activity, AlertTriangle, ShieldCheck, Truck, RefreshCw, ArrowRight, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export default function DistrictDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { forecasts, transfers, refreshForecasts } = useInventory();
  const [mounted, setMounted] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedMedicine, setSelectedMedicine] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');

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
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-24 bg-slate-200 rounded-2xl"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>)}
            </div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const criticalPhcsCount = new Set(
    forecasts.filter(f => f.riskLevel === 'Critical').map(f => f.phcId)
  ).size;

  const totalAtRiskItems = forecasts.filter(f => f.riskLevel === 'Critical' || f.riskLevel === 'High').length;
  const pendingTransfers = transfers.filter(t => t.status === 'pending');
  const approvedTransfers = transfers.filter(t => t.status === 'approved');

  const blocks = ['All', ...Array.from(new Set(phcs.map(p => p.block)))];
  const filteredPhcs = selectedBlock === 'All' ? phcs : phcs.filter(p => p.block === selectedBlock);

  const filters = {
    medicine: selectedMedicine,
    riskLevel: selectedRisk,
    block: selectedBlock,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* District Command Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                District Health Command Center
              </span>
              <span className="text-xs text-slate-500 font-medium">Madhya Pradesh State Health Mission</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Madhavpur District Supply Network
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitoring 10 Primary Health Centres across 5 blocks • Real-time stock-out forecasting
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/district/forecast"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-blue-700" /> Forecasting Engine
            </Link>
            <Link
              href="/district/transfers"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Redistribution Plan</span>
              {pendingTransfers.length > 0 && (
                <span className="bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingTransfers.length} Action
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total PHCs Monitored</div>
            <div className="text-2xl font-extrabold text-slate-900">{phcs.length} Facilities</div>
            <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% telemetry synced
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-red-200 bg-red-50/30 shadow-sm">
            <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Deficit Facilities</div>
            <div className="text-2xl font-extrabold text-red-700">{criticalPhcsCount} PHC (PHC Aarogya)</div>
            <div className="text-xs text-red-600 font-medium mt-1">ORS deficit (~4 days buffer)</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Items Under Watch</div>
            <div className="text-2xl font-extrabold text-amber-700">{totalAtRiskItems} Medicines</div>
            <div className="text-xs text-amber-600 font-medium mt-1">High/Critical threshold</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-indigo-200 bg-indigo-50/30 shadow-sm">
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Redistribution Plan</div>
            <div className="text-2xl font-extrabold text-indigo-700">
              {pendingTransfers.length} Recommended
            </div>
            <div className="text-xs text-indigo-600 font-medium mt-1">
              {approvedTransfers.length} approved & dispatched
            </div>
          </div>
        </div>

        {/* Actionable Incident Banner */}
        {pendingTransfers.length > 0 && (
          <div className="bg-blue-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-800 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  Recommended Stock Transfer: 80 sachets ORS from PHC Chandra $\rightarrow$ PHC Aarogya
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  PHC Aarogya faces stock-out in ~4 days. PHC Chandra has 350 units surplus (&gt;50 unit safety buffer preserved).
                </p>
              </div>
            </div>

            <Link
              href="/district/transfers"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-colors shrink-0"
            >
              Review & Authorize Transfer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* District Map & Facility List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Facility Status Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Facility Health Matrix</h3>
                <p className="text-[11px] text-slate-500">10 Primary Health Centres</p>
              </div>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white font-medium text-slate-700"
              >
                {blocks.map(b => (
                  <option key={b} value={b}>{b === 'All' ? 'All Blocks' : `${b}`}</option>
                ))}
              </select>
            </div>

            <div className="overflow-y-auto flex-grow divide-y divide-slate-100 p-2 space-y-1">
              {filteredPhcs.map(phc => {
                const phcForecasts = forecasts.filter(f => f.phcId === phc.id);
                const hasCritical = phcForecasts.some(f => f.riskLevel === 'Critical');
                const hasHigh = phcForecasts.some(f => f.riskLevel === 'High');

                let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                let statusText = 'Normal';
                if (hasCritical) {
                  statusBadge = 'bg-red-50 text-red-700 border-red-200 font-bold';
                  statusText = 'Critical Shortage';
                } else if (hasHigh) {
                  statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                  statusText = 'High Risk';
                }

                return (
                  <div 
                    key={phc.id} 
                    className={`p-3 rounded-xl border transition-all ${
                      hasCritical ? 'bg-red-50/30 border-red-200' : 'bg-white border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{phc.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadge}`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{phc.block} Block • {phc.staffCount} Staff</span>
                      <span>Avg Footfall: {phc.avgDailyFootfall}/day</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive GIS Map (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between h-[560px]">
            <DistrictMap 
              phcs={phcs}
              forecasts={forecasts}
              transfers={transfers}
            />
          </div>

        </div>

        {/* District Inventory Matrix */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">District-Wide Medicine Inventory Matrix</h2>
              <p className="text-xs text-slate-500">Aggregated stock levels and days-of-supply forecasts for all 8 essential drugs</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-white font-semibold text-slate-700"
              >
                <option value="All">All Medicines</option>
                {medicines.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>

              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-white font-semibold text-slate-700"
              >
                <option value="All">All Risk Levels</option>
                <option value="Critical">Critical (≤ 3 days)</option>
                <option value="High">High (4–7 days)</option>
                <option value="Medium">Medium (8–14 days)</option>
                <option value="Low">Low (&gt; 14 days)</option>
              </select>

              {(selectedMedicine !== 'All' || selectedRisk !== 'All' || selectedBlock !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedMedicine('All');
                    setSelectedRisk('All');
                    setSelectedBlock('All');
                  }}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <StockTable 
            forecasts={forecasts}
            filters={filters}
            showPhcColumn={true}
          />
        </div>

      </main>

      <Footer />
    </div>
  );
}
