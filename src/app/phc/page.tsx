'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RiskBadge from '@/components/RiskBadge';
import { getPhcById } from '@/data/phcs';
import { getMedicineById } from '@/data/medicines';
import { AlertTriangle, CheckCircle, Edit3, Camera, RefreshCw, Send, ShieldAlert, ArrowRight, Package, Clock, CloudRain } from 'lucide-react';

export default function PhcDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { inventory, forecasts, transfers, updateInventory, refreshForecasts } = useInventory();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const [updateMedicine, setUpdateMedicine] = useState('');
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'phc_worker')) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-28 bg-slate-200 rounded-2xl"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>)}
            </div>
            <div className="h-80 bg-slate-200 rounded-2xl"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const phcId = user?.phcId || 'phc-a';
  const phcData = getPhcById(phcId);
  const myInventory = inventory.filter(item => item.phcId === phcId);

  const getForecast = (medId: string) => forecasts.find(f => f.medicineId === medId && f.phcId === phcId);

  const criticalItems = myInventory.filter(item => {
    const f = getForecast(item.medicineId);
    return f?.riskLevel === 'Critical';
  });

  const highRiskItems = myInventory.filter(item => {
    const f = getForecast(item.medicineId);
    return f?.riskLevel === 'High';
  });

  const getIncomingTransfers = (medId: string) => {
    return transfers.filter(t => t.toPhcId === phcId && t.medicineId === medId && (t.status === 'pending' || t.status === 'approved'));
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);

    if (!updateMedicine || !updateQuantity) {
      setUpdateError('Please select a medicine and enter quantity.');
      return;
    }

    const qty = parseInt(updateQuantity, 10);
    if (isNaN(qty) || qty < 0) {
      setUpdateError('Quantity must be a positive number.');
      return;
    }

    updateInventory(phcId, updateMedicine, qty);
    refreshForecasts();
    setUpdateSuccess(true);
    setUpdateQuantity('');
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Facility Header Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {phcData?.block} Block • PHC Facility
              </span>
              <span className="text-xs text-slate-500 font-medium">Facility ID: {phcData?.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {phcData?.name}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Logged in as <span className="font-semibold text-slate-700">{user?.name}</span> • Primary Health Center Inventory Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900 flex items-center gap-2.5">
              <CloudRain className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold">Monsoon Season Multiplier: 1.3x</div>
                <div className="text-[11px] text-blue-700">Higher seasonal demand applied for ORS & Antimalarials</div>
              </div>
            </div>

            <Link
              href="/phc/upload"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors shrink-0"
            >
              <Camera className="w-4 h-4" /> Scan Register (OCR)
            </Link>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Stock Items</div>
            <div className="text-2xl font-extrabold text-slate-900">{myInventory.length} Medicines</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Active daily monitoring</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-red-200 bg-red-50/30 shadow-sm">
            <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Critical Shortages</div>
            <div className="text-2xl font-extrabold text-red-700">{criticalItems.length} Items</div>
            <div className="text-xs text-red-600 font-medium mt-1">Depletion within ≤ 4 days</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">High Risk Items</div>
            <div className="text-2xl font-extrabold text-amber-700">{highRiskItems.length} Items</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Depletion within 4–7 days</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Incoming Transfers</div>
            <div className="text-2xl font-extrabold text-blue-700">
              {transfers.filter(t => t.toPhcId === phcId && t.status === 'pending').length} Pending
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Inter-PHC redistribution</div>
          </div>
        </div>

        {/* Critical Alert Warning Bar (if applicable) */}
        {criticalItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 text-sm">
                  Urgent Stock-Out Risk: {criticalItems.map(i => getMedicineById(i.medicineId)?.name).join(', ')}
                </h3>
                <p className="text-xs text-red-700 mt-0.5">
                  Current stock will run out in ~4 days. A transfer recommendation has been queued for District Officer authorization.
                </p>
              </div>
            </div>
            <Link
              href="/district/transfers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              View Transfer Status <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Main Grid: Inventory Table (Left) + Actions/Forms (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inventory Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Facility Inventory & Forecasts</h2>
                  <p className="text-xs text-slate-500">Real-time depletion predictions based on 7-day moving consumption</p>
                </div>
                <button
                  onClick={refreshForecasts}
                  className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Recalculate
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Medicine</th>
                      <th className="px-4 py-3 text-right">In Stock</th>
                      <th className="px-4 py-3 text-right">Daily Rate</th>
                      <th className="px-4 py-3 text-right">Days Left</th>
                      <th className="px-5 py-3 text-center">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myInventory.map(item => {
                      const med = getMedicineById(item.medicineId);
                      const f = getForecast(item.medicineId);
                      const isCritical = f?.riskLevel === 'Critical';

                      return (
                        <tr 
                          key={item.medicineId} 
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isCritical ? 'bg-red-50/40 font-medium' : ''
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-slate-900">{med?.name}</div>
                            <div className="text-xs text-slate-400">{med?.category} • {language === 'hi' && med?.nameHi ? med.nameHi : `Buffer: ${med?.minSafetyBuffer} ${med?.unit}`}</div>
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                            {item.currentStock} <span className="text-xs text-slate-500 font-sans font-normal">{med?.unit}</span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono text-slate-600 text-xs">
                            ~{f?.predictedDailyConsumption.toFixed(1)} /day
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                              f && f.daysRemaining <= 4 
                                ? 'bg-red-100 text-red-800 border border-red-200' 
                                : f && f.daysRemaining <= 7 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {f?.daysRemaining} days
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <RiskBadge level={f?.riskLevel || 'Low'} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Last confirmed physical count: Sep 29, 2026</span>
              <Link href="/phc/upload" className="text-blue-700 font-bold hover:underline">
                Upload new physical register sheet →
              </Link>
            </div>
          </div>

          {/* Right Column: Actions & Update (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stock Update Form */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                <Edit3 className="w-4 h-4 text-blue-700" />
                <h3 className="font-bold text-slate-900 text-sm">Quick Stock Update</h3>
              </div>

              {updateSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  Inventory updated & forecasts recalculated!
                </div>
              )}
              {updateError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium">
                  {updateError}
                </div>
              )}

              <form onSubmit={handleUpdateStock} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Medicine
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={updateMedicine}
                    onChange={(e) => setUpdateMedicine(e.target.value)}
                  >
                    <option value="">-- Choose item --</option>
                    {myInventory.map(item => {
                      const med = getMedicineById(item.medicineId);
                      return (
                        <option key={item.medicineId} value={item.medicineId}>
                          {med?.name} (Current: {item.currentStock} {med?.unit})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    New Physical Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter current count"
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={updateQuantity}
                    onChange={(e) => setUpdateQuantity(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Save Count & Update Predictions
                </button>
              </form>
            </div>

            {/* OCR Digitization Banner */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-200" />
                <h3 className="font-bold text-base">Paper Register Scanner</h3>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Take a photo of your paper stock ledger. Google Gemini AI will automatically extract medicine names, quantities, and units.
              </p>
              <Link
                href="/phc/upload"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Launch Register OCR <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
