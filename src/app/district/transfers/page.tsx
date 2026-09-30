'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransferCard from '@/components/TransferCard';
import { getPhcById } from '@/data/phcs';
import { getMedicineById } from '@/data/medicines';
import { Truck, CheckCircle2, XCircle, ArrowLeft, MessageSquare, ShieldCheck, Clock, Bell, Smartphone, AlertCircle, ArrowRight } from 'lucide-react';

export default function TransfersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { transfers, approveTransfer, rejectTransfer, refreshForecasts } = useInventory();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'district_officer')) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  const pending = transfers.filter(t => t.status === 'pending');
  const approved = transfers.filter(t => t.status === 'approved');
  const rejected = transfers.filter(t => t.status === 'rejected');

  const handleApprove = (id: string) => {
    approveTransfer(id);
    refreshForecasts();
    setLastActionMessage('Transfer approved & dispatch notification generated.');
    setTimeout(() => setLastActionMessage(null), 5000);
  };

  const handleReject = (id: string) => {
    rejectTransfer(id);
    refreshForecasts();
    setLastActionMessage('Transfer recommendation archived.');
    setTimeout(() => setLastActionMessage(null), 5000);
  };

  // Find active transfer for notification preview
  const primaryTransfer = transfers[0] || null;
  const sourcePhc = primaryTransfer ? getPhcById(primaryTransfer.fromPhcId) : null;
  const destPhc = primaryTransfer ? getPhcById(primaryTransfer.toPhcId) : null;
  const med = primaryTransfer ? getMedicineById(primaryTransfer.medicineId) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/district" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Inter-PHC Medicine Redistribution Plan</h1>
              <p className="text-xs text-slate-500">Autonomous supply balancing between surplus and deficit health facilities</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Safety Buffer Rules: Active
            </span>
          </div>
        </div>

        {/* Action Feedback Toast */}
        {lastActionMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lastActionMessage}</span>
            </div>
            <span className="text-slate-400 font-mono text-[10px]">Just now</span>
          </div>
        )}

        {/* 3 Status KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Awaiting Authorization</div>
              <div className="text-2xl font-extrabold text-amber-900">{pending.length} Recommendations</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Pending officer review</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Approved Transfers</div>
              <div className="text-2xl font-extrabold text-emerald-900">{approved.length} Dispatched</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Stock movements in progress</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Stock-Outs Prevented</div>
              <div className="text-2xl font-extrabold text-blue-700">100% On-Time</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Zero clinic downtime achieved</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Columns: Transfer Action Cards (Left 7 cols) + Live Notification Dispatch (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Transfer List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pending Transfers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-2">
                  <span>Pending Recommendations</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {pending.length}
                  </span>
                </h2>
              </div>

              {pending.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  All transfer recommendations have been reviewed.
                </div>
              ) : (
                <div className="space-y-4">
                  {pending.map(t => (
                    <TransferCard
                      key={t.id}
                      transfer={t}
                      showActions={true}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Approved History */}
            {approved.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">Authorized Transfer History</h3>
                <div className="space-y-3">
                  {approved.map(t => (
                    <TransferCard
                      key={t.id}
                      transfer={t}
                      showActions={false}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Multilingual SMS & Notification Simulator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Automated Field Notifications</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Dispatch Simulator
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Upon authorization, automated high-priority SMS alerts are dispatched in English & Hindi to the Medical Officers in Charge (MOIC) at both facilities:
              </p>

              {/* Mock Phone Notification Bubble: English */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span>NHM-AUSHADHI (English)</span>
                  </div>
                  <span>Govt SMS Gateway</span>
                </div>
                <div className="text-xs text-slate-100 font-mono leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  {primaryTransfer?.status === 'approved' ? (
                    `TRANSFER AUTHORIZED: ${primaryTransfer.quantity} ${med?.unit} of ${med?.name} dispatched from ${sourcePhc?.name} to ${destPhc?.name}. Ref ID: ${primaryTransfer.id}. Please coordinate logistics within 24h.`
                  ) : (
                    `PENDING TRANSFER: 80 sachets of ORS recommended from PHC Chandra to PHC Aarogya. Awaiting District Health Officer confirmation.`
                  )}
                </div>
              </div>

              {/* Mock Phone Notification Bubble: Hindi */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>औषधिसेतु अलर्ट (Hindi)</span>
                  </div>
                  <span>राष्ट्रीय स्वास्थ्य मिशन</span>
                </div>
                <div className="text-xs text-slate-100 font-sans leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  {primaryTransfer?.status === 'approved' ? (
                    `स्थानांतरण स्वीकृत: ${sourcePhc?.name} से ${destPhc?.name} को ${med?.nameHi || med?.name} की ${primaryTransfer.quantity} ${med?.unit}। संदर्भ: ${primaryTransfer.id}। कृपया 24 घंटे के भीतर पिकअप का समन्वय करें।`
                  ) : (
                    `स्थानांतरण सिफारिश: PHC Chandra से PHC Aarogya को 80 sachets ओआरएस। ज़िला स्वास्थ्य अधिकारी द्वारा अनुमोदन की प्रतीक्षा है।`
                  )}
                </div>
              </div>

              {/* Technical Verification Note */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Deterministic Safety Guarantee:</span> Inter-PHC transfers are restricted to facilities holding excess safety buffers to prevent transferring stock-out risks to neighbor facilities.
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
