'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Activity, Stethoscope, Building2, ArrowRight, Shield, Globe, ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [loadingRole, setLoadingRole] = useState<'phc_worker' | 'district_officer' | null>(null);

  const handleLogin = (role: 'phc_worker' | 'district_officer') => {
    setLoadingRole(role);
    setTimeout(() => {
      login(role, role === 'phc_worker' ? 'phc-a' : undefined);
      if (role === 'phc_worker') {
        router.push('/phc');
      } else {
        router.push('/district');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      
      {/* Top Bar */}
      <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight">Aushadhi<span className="text-blue-700">Setu</span></span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" /> Demo Access Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? 'भूमिका का चयन करें' : 'Select a Demo Role to Enter'}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Experience AushadhiSetu from the perspective of frontline health workers or district supply coordinators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* Card 1: PHC Health Worker */}
          <div 
            onClick={() => handleLogin('phc_worker')}
            className="bg-white rounded-2xl p-7 border-2 border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Primary Health Centre
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {language === 'hi' ? 'पीएचसी स्वास्थ्य कार्यकर्ता' : 'PHC Health Worker'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-4">
                Priya Sharma • PHC Aarogya (Sadar Block)
              </p>

              <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  <span>Scan handwritten stock registers via Gemini OCR</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  <span>View local medicine buffer levels & stock-out dates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  <span>Receive emergency transfer alerts</span>
                </div>
              </div>
            </div>

            <button
              disabled={loadingRole !== null}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {loadingRole === 'phc_worker' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Entering PHC View...
                </>
              ) : (
                <>
                  Login as PHC Worker <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Card 2: District Health Officer */}
          <div 
            onClick={() => handleLogin('district_officer')}
            className="bg-white rounded-2xl p-7 border-2 border-slate-200 hover:border-indigo-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  District Command
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                {language === 'hi' ? 'ज़िला स्वास्थ्य अधिकारी' : 'District Health Officer'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-4">
                Dr. Rajesh Kumar • Madhavpur District HQ
              </p>

              <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  <span>District geospatial map & real-time risk monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  <span>Review AI-generated redistribution transfer plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  <span>Authorize emergency stock transfers & dispatch SMS</span>
                </div>
              </div>
            </div>

            <button
              disabled={loadingRole !== null}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {loadingRole === 'district_officer' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Entering Command View...
                </>
              ) : (
                <>
                  Login as District Officer <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Clean Footer */}
      <div className="py-6 text-center text-xs text-slate-500">
        Demo Environment • Simulated Data for District Madhavpur
      </div>

    </div>
  );
}
