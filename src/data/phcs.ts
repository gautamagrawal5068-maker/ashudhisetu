import { PHC } from '../types';

export const phcs: PHC[] = [
  { id: 'phc-a', name: 'PHC Aarogya', block: 'Sadar', district: 'Madhavpur', latitude: 23.25, longitude: 77.40, staffCount: 5, avgDailyFootfall: 45 },
  { id: 'phc-b', name: 'PHC Bodhi', block: 'Sadar', district: 'Madhavpur', latitude: 23.28, longitude: 77.43, staffCount: 4, avgDailyFootfall: 35 },
  { id: 'phc-c', name: 'PHC Chandra', block: 'Mofussil', district: 'Madhavpur', latitude: 23.20, longitude: 77.50, staffCount: 3, avgDailyFootfall: 25 },
  { id: 'phc-d', name: 'PHC Dhanvantari', block: 'Mofussil', district: 'Madhavpur', latitude: 23.22, longitude: 77.47, staffCount: 4, avgDailyFootfall: 40 },
  { id: 'phc-e', name: 'PHC Ekta', block: 'Tribal', district: 'Madhavpur', latitude: 23.15, longitude: 77.35, staffCount: 3, avgDailyFootfall: 30 },
  { id: 'phc-f', name: 'PHC Firdaus', block: 'Tribal', district: 'Madhavpur', latitude: 23.18, longitude: 77.32, staffCount: 2, avgDailyFootfall: 20 },
  { id: 'phc-g', name: 'PHC Gaurav', block: 'Riverside', district: 'Madhavpur', latitude: 23.30, longitude: 77.55, staffCount: 5, avgDailyFootfall: 50 },
  { id: 'phc-h', name: 'PHC Hariti', block: 'Riverside', district: 'Madhavpur', latitude: 23.33, longitude: 77.52, staffCount: 3, avgDailyFootfall: 28 },
  { id: 'phc-i', name: 'PHC Ishaan', block: 'Hilltop', district: 'Madhavpur', latitude: 23.12, longitude: 77.45, staffCount: 2, avgDailyFootfall: 15 },
  { id: 'phc-j', name: 'PHC Jyoti', block: 'Hilltop', district: 'Madhavpur', latitude: 23.10, longitude: 77.42, staffCount: 3, avgDailyFootfall: 22 }
];

export function getPhcById(id: string): PHC | undefined {
  return phcs.find(p => p.id === id);
}
