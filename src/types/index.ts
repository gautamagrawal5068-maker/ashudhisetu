export interface PHC {
  id: string;
  name: string;
  block: string;
  district: string;
  latitude: number;
  longitude: number;
  staffCount: number;
  avgDailyFootfall: number;
}

export interface Medicine {
  id: string;
  name: string;
  nameHi: string;
  unit: string;
  category: string;
  minSafetyBuffer: number;
  deliveryLeadTimeDays: number;
}

export interface InventoryItem {
  phcId: string;
  medicineId: string;
  currentStock: number;
  lastUpdated: string;
  batchNumber?: string;
  expiryDate?: string;
}

export interface ConsumptionRecord {
  phcId: string;
  medicineId: string;
  date: string;
  quantity: number;
}

export interface ForecastResult {
  phcId: string;
  medicineId: string;
  currentStock: number;
  avgDailyConsumption: number;
  predictedDailyConsumption: number;
  daysRemaining: number;
  predictedStockOutDate: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  safetyBuffer: number;
  deliveryLeadTimeDays: number;
  seasonalMultiplier: number;
  footfallMultiplier: number;
  explanation: string;
}

export interface TransferRecommendation {
  id: string;
  fromPhcId: string;
  toPhcId: string;
  medicineId: string;
  quantity: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reasoning: {
    whyRecipientAtRisk: string;
    whySourceSuitable: string;
    quantityJustification: string;
    sourceRemainsAboveBuffer: boolean;
    sourceRemainingStock: number;
    sourceBufferRequired: number;
    expectedRiskReduction: string;
  };
  createdAt: string;
}

export interface ExtractedItem {
  medicineName: string;
  quantity: number;
  confidence: number;
  unit: string;
  matchedMedicineId?: string;
}

export type UserRole = 'phc_worker' | 'district_officer';

export interface User {
  role: UserRole;
  name: string;
  phcId?: string;
}

export type Language = 'en' | 'hi';
