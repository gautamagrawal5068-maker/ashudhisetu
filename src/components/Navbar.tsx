'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useInventory } from '@/context/InventoryContext';
import { useApiKey } from '@/context/ApiKeyContext';
import { Activity, Globe, LogOut, Menu, X, Key, ShieldCheck, UserCheck } from 'lucide-react';
import ApiKeyModal from '@/components/ApiKeyModal';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { forecasts } = useInventory();
  const { hasCustomKey, setIsModalOpen } = useApiKey();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated || !user) return null;

  const isPhc = user.role === 'phc_worker';
  const hasCritical = (forecasts || []).some(f => f.riskLevel === 'Critical');

  const phcLinks = [
    { href: '/phc', label: language === 'hi' ? 'स्टॉक डैशबोर्ड' : 'Stock Overview' },
    { href: '/phc/upload', label: language === 'hi' ? 'रजिस्टर स्कैन (OCR)' : 'Scan Stock Register' },
  ];

  const districtLinks = [
    { href: '/district', label: language === 'hi' ? 'ज़िला मानचित्र' : 'District Command' },
    { href: '/district/forecast', label: language === 'hi' ? 'पूर्वानुमान' : 'Forecasting Engine' },
    { href: '/district/transfers', label: language === 'hi' ? 'रीडिस्ट्रिब्यूशन' : 'Redistribution Plan' },
  ];

  const navLinks = isPhc ? phcLinks : districtLinks;
  const homePath = isPhc ? '/phc' : '/district';

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand */}
            <div className="flex items-center gap-8">
              <Link href={homePath} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-lg tracking-tight">Aushadhi<span className="text-blue-700">Setu</span></span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">v1.2</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 leading-none">औषधिसेतु • National Health Mission</span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors relative ${
                        isActive 
                          ? 'bg-blue-50 text-blue-800' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      {link.label}
                      {isPhc && link.href === '/phc' && hasCritical && (
                        <span className="absolute top-2 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Controls */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* API Key Status Pill */}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  hasCustomKey
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Configure Google Gemini API Key"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{hasCustomKey ? 'Gemini 1.5 Flash Active' : 'Configure API Key'}</span>
              </button>

              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                title="Toggle English / Hindi"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>

              <div className="h-5 w-px bg-slate-200 mx-0.5"></div>

              {/* User Profile */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <UserCheck className="w-4 h-4 text-blue-700" />
                <span className="truncate max-w-[140px]">{user.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({isPhc ? 'PHC Staff' : 'District HQ'})
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Sign out of demo session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-slate-600 bg-slate-100 rounded-lg"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2 py-1 text-xs font-bold border rounded-lg bg-white"
              >
                {language === 'en' ? 'हिं' : 'EN'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 mb-2">
              <div className="text-xs font-bold text-slate-800">{user.name}</div>
              <div className="text-xs text-slate-500">{isPhc ? 'PHC Aarogya' : 'District Health Office'}</div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                  pathname === link.href ? 'bg-blue-50 text-blue-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      {/* API Key Modal Component */}
      <ApiKeyModal />
    </>
  );
}
