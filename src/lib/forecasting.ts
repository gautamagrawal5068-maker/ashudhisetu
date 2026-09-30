import { InventoryItem, ConsumptionRecord, PHC, Medicine, ForecastResult } from '../types';

export function generateForecasts(
  inventory: InventoryItem[],
  consumptionHistory: ConsumptionRecord[],
  phcs: PHC[],
  medicines: Medicine[]
): ForecastResult[] {
  const forecasts: ForecastResult[] = [];
  
  // Today's date mock: 2026-09-30
  const today = new Date('2026-09-30');
  const currentMonth = today.getMonth() + 1; // 1-12
  
  inventory.forEach(item => {
    const phc = phcs.find(p => p.id === item.phcId);
    const medicine = medicines.find(m => m.id === item.medicineId);
    
    if (!phc || !medicine) return;
    
    // 1. Calculate 7-day moving average of daily consumption
    // Get last 7 days from consumption history for this phc-medicine
    const history = consumptionHistory
      .filter(c => c.phcId === item.phcId && c.medicineId === item.medicineId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
      
    let totalConsumption = 0;
    history.forEach(h => totalConsumption += h.quantity);
    const movingAvg = history.length > 0 ? totalConsumption / history.length : 1; // fallback to 1 if no data
    
    // 2. Apply seasonal multiplier
    // Monsoon months: June(6) to October(10)
    const isMonsoon = currentMonth >= 6 && currentMonth <= 10;
    const isSeasonalMed = medicine.id === 'ors' || medicine.id === 'antimalarial';
    const seasonalMultiplier = (isMonsoon && isSeasonalMed) ? 1.3 : 1.0;
    
    // 3. Apply footfall multiplier
    // Default to 1.0 as we don't track daily footfall variations in this simplified model
    const footfallMultiplier = 1.0;
    
    // 4. predictedDailyConsumption
    const predictedDailyConsumption = movingAvg * seasonalMultiplier * footfallMultiplier;
    
    // 5. daysRemaining
    const daysRemaining = predictedDailyConsumption > 0 ? Math.floor(item.currentStock / predictedDailyConsumption) : 999;
    
    // 6. predictedStockOutDate
    const stockOutDate = new Date(today);
    stockOutDate.setDate(today.getDate() + daysRemaining);
    const predictedStockOutDate = stockOutDate.toISOString().split('T')[0];
    
    // 7. Risk levels
    let riskLevel: ForecastResult['riskLevel'] = 'Low';
    if (daysRemaining <= 3) riskLevel = 'Critical';
    else if (daysRemaining <= 7) riskLevel = 'High';
    else if (daysRemaining <= 14) riskLevel = 'Medium';
    
    // Generate explanation
    let explanation = `Based on a 7-day moving average, consumption is ${movingAvg.toFixed(1)} ${medicine.unit}/day.`;
    if (seasonalMultiplier > 1.0) {
      explanation += ` A seasonal multiplier of ${seasonalMultiplier}x is applied due to monsoon season demand.`;
    }
    explanation += ` Expected daily consumption is ${predictedDailyConsumption.toFixed(1)} ${medicine.unit}. At current stock of ${item.currentStock}, supplies will last approximately ${daysRemaining} days.`;

    forecasts.push({
      phcId: item.phcId,
      medicineId: item.medicineId,
      currentStock: item.currentStock,
      avgDailyConsumption: movingAvg,
      predictedDailyConsumption,
      daysRemaining,
      predictedStockOutDate,
      riskLevel,
      safetyBuffer: medicine.minSafetyBuffer,
      deliveryLeadTimeDays: medicine.deliveryLeadTimeDays,
      seasonalMultiplier,
      footfallMultiplier,
      explanation
    });
  });
  
  return forecasts;
}
