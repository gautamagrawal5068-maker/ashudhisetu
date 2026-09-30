'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { useApiKey } from '@/context/ApiKeyContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { medicines } from '@/data/medicines';
import { getPhcById } from '@/data/phcs';
import { UploadCloud, CheckCircle, AlertCircle, FileText, Camera, ArrowLeft, ArrowRight, RotateCw, Loader2, Key, Sparkles, Trash2, Plus } from 'lucide-react';
import { ExtractedItem } from '@/types';

type Step = 'upload' | 'processing' | 'review' | 'saved';

export default function UploadPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { updateInventory, refreshForecasts } = useInventory();
  const { apiKey, hasCustomKey, setIsModalOpen } = useApiKey();

  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedItem[]>([]);
  const [isMockResult, setIsMockResult] = useState(false);
  const [modelUsed, setModelUsed] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'phc_worker') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'phc_worker' || !user.phcId) {
    return null;
  }

  const phc = getPhcById(user.phcId);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, or WebP).');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const processImage = async (useSample = false) => {
    setStep('processing');
    setError(null);

    try {
      let base64 = previewUrl;
      let mimeType = file?.type || 'image/jpeg';

      if (useSample) {
        // Use blank 1x1 test image to trigger sample data
        base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        mimeType = 'image/png';
        setPreviewUrl('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');
      }

      const base64Data = base64?.includes(',') ? base64.split(',')[1] : base64;

      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          mimeType,
          apiKey: apiKey || undefined,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extract data');

      setExtractedData(data.items);
      setIsMockResult(data.isMock);
      setModelUsed(data.modelUsed || (data.isMock ? 'Demo Simulation' : 'Google Gemini 1.5 Flash'));
      setStep('review');
    } catch (err: any) {
      setError(err.message || 'An error occurred during vision extraction.');
      setStep('upload');
    }
  };

  const updateItem = (index: number, field: keyof ExtractedItem, value: any) => {
    const next = [...extractedData];
    next[index] = { ...next[index], [field]: value };
    setExtractedData(next);
  };

  const removeRow = (index: number) => {
    setExtractedData(extractedData.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setExtractedData([
      ...extractedData,
      {
        medicineName: 'New Medicine',
        quantity: 100,
        unit: 'tablets',
        confidence: 0.95,
        matchedMedicineId: 'paracetamol'
      }
    ]);
  };

  const handleConfirmSave = () => {
    if (!user.phcId) return;

    extractedData.forEach(item => {
      if (item.matchedMedicineId && item.quantity >= 0) {
        updateInventory(user.phcId!, item.matchedMedicineId, item.quantity);
      }
    });

    refreshForecasts();
    setStep('saved');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/phc" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Stock Register OCR Digitization</h1>
              <p className="text-xs text-slate-500">{phc?.name} • Automated data extraction via Multimodal Vision AI</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-blue-700" />
            {hasCustomKey ? 'Gemini 1.5 Flash Configured' : 'Set Gemini API Key'}
          </button>
        </div>

        {/* 4-Step Flow Stepper */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className={`p-2.5 rounded-xl border ${step === 'upload' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              1. Upload Ledger
            </div>
            <div className={`p-2.5 rounded-xl border ${step === 'processing' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              2. Gemini Vision OCR
            </div>
            <div className={`p-2.5 rounded-xl border ${step === 'review' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              3. Review & Validate
            </div>
            <div className={`p-2.5 rounded-xl border ${step === 'saved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              4. Inventory Updated
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Upload View */}
        {step === 'upload' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                previewUrl ? 'border-blue-400 bg-blue-50/20' : 'border-slate-300 hover:border-blue-600 hover:bg-slate-50'
              }`}
            >
              {previewUrl ? (
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  <img src={previewUrl} alt="Ledger Preview" className="max-h-64 mx-auto rounded-xl shadow-sm border border-slate-200 object-cover" />
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => { setFile(null); setPreviewUrl(null); }}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                      Choose Different Photo
                    </button>
                    <button
                      onClick={() => processImage(false)}
                      className="px-6 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm"
                    >
                      Process Image with Gemini Vision
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Drag & Drop Stock Register Image</h3>
                  <p className="text-xs text-slate-500">Supports JPG, PNG, and camera photos of paper ledger sheets (up to 10MB)</p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
                      Browse Local Files
                    </span>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Don&apos;t have a physical photo handy?</span>
              <button
                type="button"
                onClick={() => processImage(true)}
                className="font-bold text-blue-700 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
              >
                Use Sample Register Photo (Demo Mode) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing Spinner */}
        {step === 'processing' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto border border-blue-100">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Analyzing Register with Gemini Vision AI</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Detecting handwriting, parsing drug names, matching catalog identifiers, and reading stock counts...
            </p>
          </div>
        )}

        {/* Step 3: Review & Edit Extracted Results */}
        {step === 'review' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 text-lg">OCR Extraction Results</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {extractedData.length} Items Detected
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Engine: <span className="font-semibold text-slate-700">{modelUsed}</span> • Review and correct any quantity before saving
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addRow}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="px-3.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  Re-upload
                </button>
              </div>
            </div>

            {/* Extracted Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Detected Ledger Name</th>
                    <th className="px-4 py-3 w-44">Matched Catalog Item</th>
                    <th className="px-4 py-3 w-28 text-right">In Stock Qty</th>
                    <th className="px-4 py-3 w-28">Unit</th>
                    <th className="px-4 py-3 w-28 text-center">Confidence</th>
                    <th className="px-3 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {extractedData.map((item, idx) => {
                    const confidencePct = Math.round(item.confidence * 100);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <input
                            type="text"
                            value={item.medicineName}
                            onChange={(e) => updateItem(idx, 'medicineName', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={item.matchedMedicineId || ''}
                            onChange={(e) => updateItem(idx, 'matchedMedicineId', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">-- Select Catalog Match --</option>
                            {medicines.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value, 10) || 0)}
                            className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold text-right border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                            className="w-20 px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                            confidencePct >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {confidencePct}%
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Confirmation Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Saving will instantly recalculate stock-out forecasting models across the district.
              </div>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Confirm & Update Inventory
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success State */}
        {step === 'saved' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Inventory Successfully Updated</h2>
              <p className="text-xs text-slate-500 mt-1">
                {phc?.name} inventory has been synchronized with district forecasting algorithms.
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="/phc"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
              >
                Return to PHC Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep('upload');
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Scan Another Register
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
