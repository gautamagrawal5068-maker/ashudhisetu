import { InventoryItem } from '../types';
import { phcs } from './phcs';
import { medicines } from './medicines';

const seedInventory = (): InventoryItem[] => {
  const items: InventoryItem[] = [];
  const lastUpdated = '2026-09-29';

  for (const phc of phcs) {
    for (const medicine of medicines) {
      let currentStock = 0;

      // Special Scenarios
      if (phc.id === 'phc-a' && medicine.id === 'ors') {
        currentStock = 40; // Critical low
      } else if (phc.id === 'phc-c' && medicine.id === 'ors') {
        currentStock = 350; // Large surplus
      } else if (phc.id === 'phc-g' && medicine.id === 'paracetamol') {
        currentStock = 60; // Low
      } else if (phc.id === 'phc-g' && medicine.id === 'insulin') {
        currentStock = 5; // Critical
      } else if (phc.id === 'phc-i' && medicine.id === 'amoxicillin') {
        currentStock = 15; // Critical
      } else {
        // Normal stock ranges
        if (medicine.unit === 'vials') {
          currentStock = 15 + (phc.id.charCodeAt(0) + medicine.id.charCodeAt(0)) % 16; // 15-30
        } else {
          currentStock = 150 + (phc.id.charCodeAt(0) * 13 + medicine.id.charCodeAt(0) * 7) % 351; // 150-500
        }
      }

      items.push({
        phcId: phc.id,
        medicineId: medicine.id,
        currentStock,
        lastUpdated
      });
    }
  }

  return items;
};

export const initialInventory: InventoryItem[] = seedInventory();
