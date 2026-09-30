import { ConsumptionRecord } from '../types';
import { phcs } from './phcs';
import { medicines } from './medicines';

const generateConsumptionData = (): ConsumptionRecord[] => {
  const records: ConsumptionRecord[] = [];
  
  for (const phc of phcs) {
    for (const medicine of medicines) {
      for (let day = 1; day <= 30; day++) {
        const dateStr = `2026-09-${day.toString().padStart(2, '0')}`;
        
        let baseConsumption = 0;
        
        // Base consumption logic
        switch (medicine.id) {
          case 'ors':
            if (phc.id === 'phc-a') baseConsumption = 10;
            else if (phc.id === 'phc-c') baseConsumption = 5;
            else baseConsumption = 6;
            break;
          case 'paracetamol': baseConsumption = 12; break;
          case 'amoxicillin': baseConsumption = 6; break;
          case 'zinc': baseConsumption = 4; break;
          case 'ifa': baseConsumption = 8; break;
          case 'azithromycin': baseConsumption = 3; break;
          case 'insulin': baseConsumption = 1; break;
          case 'antimalarial': baseConsumption = 4; break;
        }

        // Scale by footfall (baseline 30)
        let scaledConsumption = baseConsumption * (phc.avgDailyFootfall / 30);

        // Seasonal multiplier for ORS and Antimalarial in Sept
        if (medicine.id === 'ors' || medicine.id === 'antimalarial') {
          scaledConsumption *= 1.3;
        }

        // Add deterministic pseudo-random variation (+- 30%)
        const seed = phc.id.charCodeAt(0) + medicine.id.charCodeAt(0) + day;
        const variation = 0.7 + ((seed % 61) / 100); // 0.7 to 1.3
        
        let finalQuantity = Math.round(scaledConsumption * variation);
        
        // Ensure minimum 1 for insulin if base was calculated > 0
        if (medicine.id === 'insulin') {
           finalQuantity = Math.max(1, Math.round(scaledConsumption * variation));
        }

        records.push({
          phcId: phc.id,
          medicineId: medicine.id,
          date: dateStr,
          quantity: finalQuantity
        });
      }
    }
  }
  
  return records;
};

export const consumptionHistory: ConsumptionRecord[] = generateConsumptionData();
