import { Medicine } from '../types';

export const medicines: Medicine[] = [
  { id: 'ors', name: 'ORS (Oral Rehydration Salts)', nameHi: 'ओआरएस', unit: 'sachets', category: 'Essential', minSafetyBuffer: 50, deliveryLeadTimeDays: 7 },
  { id: 'paracetamol', name: 'Paracetamol 500mg', nameHi: 'पैरासिटामोल', unit: 'tablets', category: 'Essential', minSafetyBuffer: 100, deliveryLeadTimeDays: 5 },
  { id: 'amoxicillin', name: 'Amoxicillin 250mg', nameHi: 'एमोक्सिसिलिन', unit: 'capsules', category: 'Antibiotic', minSafetyBuffer: 60, deliveryLeadTimeDays: 7 },
  { id: 'zinc', name: 'Zinc Tablets 20mg', nameHi: 'जिंक गोलियां', unit: 'tablets', category: 'Essential', minSafetyBuffer: 40, deliveryLeadTimeDays: 7 },
  { id: 'ifa', name: 'Iron & Folic Acid Tablets', nameHi: 'आयरन फोलिक एसिड', unit: 'tablets', category: 'Supplement', minSafetyBuffer: 80, deliveryLeadTimeDays: 5 },
  { id: 'azithromycin', name: 'Azithromycin 500mg', nameHi: 'एज़िथ्रोमाइसिन', unit: 'tablets', category: 'Antibiotic', minSafetyBuffer: 30, deliveryLeadTimeDays: 10 },
  { id: 'insulin', name: 'Insulin', nameHi: 'इंसुलिन', unit: 'vials', category: 'Critical', minSafetyBuffer: 10, deliveryLeadTimeDays: 14 },
  { id: 'antimalarial', name: 'Antimalarial (Chloroquine)', nameHi: 'मलेरिया रोधी', unit: 'tablets', category: 'Essential', minSafetyBuffer: 40, deliveryLeadTimeDays: 7 }
];

export function getMedicineById(id: string): Medicine | undefined {
  return medicines.find(m => m.id === id);
}
