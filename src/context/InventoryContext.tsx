'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, ForecastResult, TransferRecommendation, ConsumptionRecord } from '../types';
import { initialInventory } from '../data/inventory';
import { consumptionHistory as initialConsumption } from '../data/consumption';
import { phcs } from '../data/phcs';
import { medicines } from '../data/medicines';
import { generateForecasts } from '../lib/forecasting';
import { generateTransferRecommendations } from '../lib/transfers';

interface InventoryContextType {
  inventory: InventoryItem[];
  consumptionHistory: ConsumptionRecord[];
  forecasts: ForecastResult[];
  transfers: TransferRecommendation[];
  updateInventory: (phcId: string, medicineId: string, newStock: number) => void;
  approveTransfer: (id: string) => void;
  rejectTransfer: (id: string) => void;
  refreshForecasts: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [consumptionHistory] = useState<ConsumptionRecord[]>(initialConsumption);
  const [forecasts, setForecasts] = useState<ForecastResult[]>([]);
  const [transfers, setTransfers] = useState<TransferRecommendation[]>([]);

  const refreshForecasts = () => {
    const newForecasts = generateForecasts(inventory, consumptionHistory, phcs, medicines);
    setForecasts(newForecasts);
    
    const newTransfers = generateTransferRecommendations(newForecasts, inventory, phcs, medicines);
    // Keep status of already existing transfers
    setTransfers(prev => {
      const merged = newTransfers.map(nt => {
        const existing = prev.find(p => p.id === nt.id);
        if (existing) {
          return { ...nt, status: existing.status };
        }
        return nt;
      });
      return merged;
    });
  };

  useEffect(() => {
    refreshForecasts();
  }, [inventory, consumptionHistory]);

  const updateInventory = (phcId: string, medicineId: string, newStock: number) => {
    setInventory(prev => {
      const copy = [...prev];
      const index = copy.findIndex(i => i.phcId === phcId && i.medicineId === medicineId);
      if (index >= 0) {
        copy[index] = { ...copy[index], currentStock: newStock, lastUpdated: new Date().toISOString() };
      } else {
        copy.push({ phcId, medicineId, currentStock: newStock, lastUpdated: new Date().toISOString() });
      }
      return copy;
    });
  };

  const approveTransfer = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    
    // Also perform the underlying inventory swap
    const transfer = transfers.find(t => t.id === id);
    if (transfer) {
      setInventory(prev => {
        const copy = [...prev];
        const srcIdx = copy.findIndex(i => i.phcId === transfer.fromPhcId && i.medicineId === transfer.medicineId);
        const dstIdx = copy.findIndex(i => i.phcId === transfer.toPhcId && i.medicineId === transfer.medicineId);
        
        if (srcIdx >= 0 && dstIdx >= 0) {
          copy[srcIdx].currentStock -= transfer.quantity;
          copy[dstIdx].currentStock += transfer.quantity;
        }
        return copy;
      });
    }
  };

  const rejectTransfer = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
  };

  return (
    <InventoryContext.Provider value={{
      inventory, consumptionHistory, forecasts, transfers, 
      updateInventory, approveTransfer, rejectTransfer, refreshForecasts
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
