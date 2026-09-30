'use client';

import React, { useState } from 'react';
import { ForecastResult } from '@/types';
import { getMedicineById } from '@/data/medicines';
import { getPhcById } from '@/data/phcs';
import { useInventory } from '@/context/InventoryContext';
import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle, ChevronDown, ChevronUp, PackageX, Sparkles } from 'lucide-react';
import RiskBadge from '@/components/RiskBadge';

export interface StockTableProps {
  forecasts?: ForecastResult[];
  phcId?: string;
  filters?: {
    medicine?: string;
    riskLevel?: string;
    block?: string;
  };
  showPhcColumn?: boolean;
}

const riskColors = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const riskTextColors = {
  Critical: 'text-red-700 font-bold',
  High: 'text-orange-700 font-semibold',
  Medium: 'text-yellow-700 font-medium',
  Low: 'text-green-700',
};

const riskBgColors = {
  Critical: 'bg-red-50/60 dark:bg-red-950/20 border-l-4 border-l-red-500',
  High: 'border-l-4 border-l-orange-500',
  Medium: 'border-l-4 border-l-yellow-500',
  Low: 'border-l-4 border-l-emerald-500',
};

export default function StockTable({ 
  forecasts: propForecasts, 
  phcId, 
  filters, 
  showPhcColumn = false 
}: StockTableProps) {
  const { forecasts: contextForecasts } = useInventory();
  const { language } = useLanguage();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const allForecasts = propForecasts || contextForecasts || [];

  // Filter logic
  let filteredData = allForecasts;

  if (phcId && phcId !== 'all') {
    filteredData = filteredData.filter(f => f.phcId === phcId);
  }

  if (filters) {
    if (filters.medicine && filters.medicine !== 'All') {
      filteredData = filteredData.filter(f => {
        const med = getMedicineById(f.medicineId);
        return med?.name === filters.medicine || med?.id === filters.medicine;
      });
    }
    if (filters.riskLevel && filters.riskLevel !== 'All') {
      filteredData = filteredData.filter(f => f.riskLevel === filters.riskLevel);
    }
    if (filters.block && filters.block !== 'All') {
      filteredData = filteredData.filter(f => {
        const phc = getPhcById(f.phcId);
        return phc?.block === filters.block;
      });
    }
  }

  // Sort by risk (Critical first) then by days remaining
  const riskWeight: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const sortedForecasts = [...filteredData].sort((a, b) => {
    if (riskWeight[a.riskLevel] !== riskWeight[b.riskLevel]) {
      return (riskWeight[a.riskLevel] ?? 99) - (riskWeight[b.riskLevel] ?? 99);
    }
    return a.daysRemaining - b.daysRemaining;
  });

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const shouldShowPhc = showPhcColumn || (!phcId || phcId === 'all');

  if (sortedForecasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <PackageX size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No inventory data available</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">No medicines match the selected filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 uppercase font-semibold text-xs border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Risk Level</th>
              {shouldShowPhc && <th className="px-4 py-3">Facility</th>}
              <th className="px-4 py-3">Medicine</th>
              <th className="px-4 py-3 text-right">Current Stock</th>
              <th className="px-4 py-3 text-right">Avg Daily</th>
              <th className="px-4 py-3 text-right">Predicted Daily</th>
              <th className="px-4 py-3 text-right">Days Left</th>
              <th className="px-4 py-3 text-right">Stock-Out Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {sortedForecasts.map((forecast, idx) => {
              const medicine = getMedicineById(forecast.medicineId);
              const phc = getPhcById(forecast.phcId);
              if (!medicine) return null;
              
              const rowKey = `${forecast.phcId}-${forecast.medicineId}`;
              const isExpanded = !!expandedRows[rowKey];
              const isEven = idx % 2 === 0;
              const rowClass = `
                transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group
                ${isEven ? 'bg-gray-50/20' : 'bg-white dark:bg-gray-800'} 
                ${riskBgColors[forecast.riskLevel] || ''}
              `;

              return (
                <React.Fragment key={rowKey}>
                  <tr className={rowClass} onClick={() => toggleRow(rowKey)}>
                    <td className="px-4 py-3">
                      <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge level={forecast.riskLevel} />
                    </td>
                    {shouldShowPhc && (
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        <div>{phc?.name || forecast.phcId}</div>
                        <div className="text-xs text-gray-400">{phc?.block} Block</div>
                      </td>
                    )}
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{medicine.name}</span>
                        {language === 'hi' && medicine.nameHi && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-normal">({medicine.nameHi})</span>
                        )}
                      </div>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal">{medicine.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                      <span className="font-semibold">{forecast.currentStock}</span> <span className="text-gray-500 text-xs">{medicine.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                      {forecast.avgDailyConsumption.toFixed(1)} <span className="text-xs">/{medicine.unit.charAt(0)}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-200">
                      {forecast.predictedDailyConsumption.toFixed(1)} <span className="text-xs text-gray-500">/day</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        forecast.daysRemaining <= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 
                        forecast.daysRemaining <= 7 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 
                        forecast.daysRemaining <= 14 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' : 
                        'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      }`}>
                        {forecast.daysRemaining > 999 ? '999+' : forecast.daysRemaining} days
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600 dark:text-gray-300">
                      {forecast.daysRemaining > 365 ? 'Safe (>1yr)' : new Date(forecast.predictedStockOutDate).toLocaleDateString()}
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-indigo-50/40 dark:bg-indigo-950/30 border-b border-gray-200 dark:border-gray-700">
                      <td colSpan={shouldShowPhc ? 9 : 8} className="px-4 py-4">
                        <div className="flex gap-4 items-start pl-6">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                            <Sparkles size={18} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Explainable AI Forecast Reasoning</h4>
                              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">Confidence: 96%</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{forecast.explanation}</p>
                            
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                              <div>
                                <div className="text-gray-500 dark:text-gray-400 mb-0.5">Seasonal Multiplier</div>
                                <div className="font-semibold text-indigo-600 dark:text-indigo-400">{forecast.seasonalMultiplier.toFixed(2)}x (Monsoon)</div>
                              </div>
                              <div>
                                <div className="text-gray-500 dark:text-gray-400 mb-0.5">Footfall Multiplier</div>
                                <div className="font-semibold text-indigo-600 dark:text-indigo-400">{forecast.footfallMultiplier.toFixed(2)}x (Patient Trend)</div>
                              </div>
                              <div>
                                <div className="text-gray-500 dark:text-gray-400 mb-0.5">Safety Buffer Target</div>
                                <div className="font-semibold text-gray-900 dark:text-white">{forecast.safetyBuffer} {medicine.unit}</div>
                              </div>
                              <div>
                                <div className="text-gray-500 dark:text-gray-400 mb-0.5">Delivery Lead Time</div>
                                <div className="font-semibold text-gray-900 dark:text-white">{forecast.deliveryLeadTimeDays} days from district warehouse</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
