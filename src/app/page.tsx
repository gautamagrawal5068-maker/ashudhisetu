'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, ShieldCheck, TrendingUp, Layers, CheckCircle2, ChevronRight, FileSpreadsheet, MapPin, Zap, Truck, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Government-Style Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">Aushadhi<span className="text-blue-700">Setu</span></span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">National Health Prototype</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none">AI-Powered Medicine Stock-Out Prevention Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all hover:shadow"
            >
              Launch Platform Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* Hero Section: Crisp, Trustworthy, Authoritative */}
        <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Designed for Primary Health Centres (PHCs) & District Health Offices
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                Predict shortages. Move supplies sooner. <br />
                <span className="text-blue-400">Protect every rural clinic.</span>
              </h1>

              <p className="text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                AushadhiSetu transforms handwritten stock registers into predictive supply intelligence, preventing stock-outs of essential medicines through explainable AI and automated inter-PHC redistribution.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                  Start Live District Demo <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all"
                >
                  Explore Forecasting Methodology
                </a>
              </div>

              {/* Hindi Tagline */}
              <div className="pt-2 text-sm text-slate-400 font-medium border-t border-slate-800 flex items-center gap-2">
                <span>हिन्दी:</span>
                <span className="text-slate-300">दवाइयों की कमी का पूर्वानुमान लगाएं • आपातकालीन स्टॉक-आउट रोकें • हर पीएचसी को सुरक्षित रखें</span>
              </div>
            </div>

            {/* Live Scenario Card Preview */}
            <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live Simulation Incident</span>
                </div>
                <span className="text-xs font-mono text-slate-400">District Madhavpur</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-red-900/50 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-red-400 font-bold">CRITICAL DEFICIT DETECTED</span>
                  <span className="text-slate-400">PHC Aarogya (Sadar)</span>
                </div>
                <div className="text-sm font-bold text-white flex justify-between items-center">
                  <span>ORS (Oral Rehydration Salts)</span>
                  <span className="text-red-400 font-mono">40 sachets (~4 days left)</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Monsoon seasonal demand surge ($1.3\times$) will cause total stock-out by Oct 4.
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-900/50 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-400 font-bold">AI REDISTRIBUTION PLAN</span>
                  <span className="text-slate-400">Source: PHC Chandra</span>
                </div>
                <div className="text-sm font-bold text-white flex justify-between items-center">
                  <span>Transfer 80 sachets</span>
                  <span className="text-emerald-400 font-mono">Surplus: 350 available</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Source maintains safety buffer (&gt;50 sachets). Risk at PHC Aarogya reduced to zero.
                </p>
              </div>

              <div className="pt-2 text-center">
                <Link href="/login" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1">
                  Open interactive redistribution workbench <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Public Health Reality Section */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">The Ground Reality</h2>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Why essential medicines run out in rural facilities
              </p>
              <p className="text-slate-600 mt-3 text-base">
                Primary Health Centres are the first line of care for 70% of India&apos;s population. Yet stock tracking remains manual, reactive, and delayed.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-extrabold text-red-600 mb-2 font-mono">30%+</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Monthly Stock-Outs</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rural health sub-centres frequently run out of critical treatments like ORS, Zinc, and Amoxicillin during peak disease seasons.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-extrabold text-amber-600 mb-2 font-mono">14 Days</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Paper Reporting Lag</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Physical stock registers are manually compiled at month-end. By the time district officers notice a shortage, the stock-out has already occurred.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-3xl font-extrabold text-blue-600 mb-2 font-mono">0 km</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Inter-PHC Visibility</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A clinic may suffer a stock-out while a neighboring facility 8 km away holds an expiring surplus, with no digital mechanism to redistribute stock.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">System Architecture</h2>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                How AushadhiSetu solves the stock-out cycle
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-4 text-sm">
                    01
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Register Digitization</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    PHC staff capture photos of physical registers. Google Gemini vision extracts item names, quantities, and units into structured inventory.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-blue-700">
                  Zero manual data entry
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4 text-sm">
                    02
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Predictive Forecasting</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Calculates 7-day moving consumption averages combined with seasonal multipliers (monsoon diarrhea, malaria) and patient footfall trends.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-indigo-700">
                  Early warning: 7–14 days ahead
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-4 text-sm">
                    03
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Surplus Redistribution</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Geospatially pairs deficit PHCs with nearby surplus facilities. Mathematical safety buffer verification prevents creating secondary shortages.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-700">
                  Buffer-safe transfer logic
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center mb-4 text-sm">
                    04
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Bilingual Dispatch</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    District officers approve transfers with one click. Automated SMS notifications dispatch instantly in English & Hindi to both medical officers.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-amber-700">
                  Immediate field coordination
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live CTA Section */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Test the end-to-end prototype now
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base">
              Experience the platform as a frontline PHC health worker scanning registers or as a district officer approving redistribution plans across 10 facilities.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all"
              >
                Launch Demo Experience <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Clean Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold text-xs">AS</div>
            <span className="font-bold text-slate-200">AushadhiSetu Prototype</span>
            <span>• National Medicine Supply-Chain Safety</span>
          </div>
          <div>
            Built for Google Cloud Hackathon &quot;Code for Communities — Second Edition&quot;
          </div>
        </div>
      </footer>

    </div>
  );
}
