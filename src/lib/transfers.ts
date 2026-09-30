import { ForecastResult, InventoryItem, PHC, Medicine, TransferRecommendation } from '../types';

// Helper to calculate Euclidean distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
}

export function generateTransferRecommendations(
  forecasts: ForecastResult[],
  inventory: InventoryItem[],
  phcs: PHC[],
  medicines: Medicine[]
): TransferRecommendation[] {
  const recommendations: TransferRecommendation[] = [];
  
  // 1. Find all Critical and High risk forecasts (recipients)
  const atRisk = forecasts.filter(f => f.riskLevel === 'Critical' || f.riskLevel === 'High');
  
  atRisk.forEach(recipient => {
    const medicine = medicines.find(m => m.id === recipient.medicineId);
    if (!medicine) return;
    
    // 2. For each, find PHCs with Low risk for same medicine (potential sources)
    const potentialSources = forecasts.filter(f => 
      f.medicineId === recipient.medicineId && 
      f.riskLevel === 'Low' &&
      f.phcId !== recipient.phcId
    );
    
    if (potentialSources.length === 0) return;
    
    // Find the recipient PHC details for distance calculation
    const recipientPhc = phcs.find(p => p.id === recipient.phcId);
    if (!recipientPhc) return;
    
    // 3. Source must have stock > safetyBuffer + transferQuantity
    // 4. Calculate transfer quantity: enough to bring recipient above safety buffer + 7 days of consumption
    const requiredStock = medicine.minSafetyBuffer + (recipient.predictedDailyConsumption * 7);
    const transferQuantity = Math.ceil(requiredStock - recipient.currentStock);
    
    if (transferQuantity <= 0) return;
    
    let bestSource: ForecastResult | null = null;
    let minDistance = Infinity;
    
    // 5. Prefer nearest source PHC
    potentialSources.forEach(source => {
      // Check if source has enough stock to transfer while keeping its own buffer
      if (source.currentStock >= medicine.minSafetyBuffer + transferQuantity) {
        const sourcePhc = phcs.find(p => p.id === source.phcId);
        if (sourcePhc) {
          const distance = calculateDistance(
            recipientPhc.latitude, recipientPhc.longitude,
            sourcePhc.latitude, sourcePhc.longitude
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            bestSource = source;
          }
        }
      }
    });
    
    if (bestSource) {
      // 6. Generate detailed reasoning object with all fields filled
      // 7. Create unique IDs (use tr-{fromId}-{toId}-{medicineId})
      const sourceData = bestSource as ForecastResult;
      const sourcePhc = phcs.find(p => p.id === sourceData.phcId);
      
      const newRecStock = recipient.currentStock + transferQuantity;
      const expectedDays = Math.floor(newRecStock / (recipient.predictedDailyConsumption || 1));
      
      recommendations.push({
        id: `tr-${sourceData.phcId}-${recipient.phcId}-${recipient.medicineId}`,
        fromPhcId: sourceData.phcId,
        toPhcId: recipient.phcId,
        medicineId: recipient.medicineId,
        quantity: transferQuantity,
        urgency: recipient.riskLevel,
        status: 'pending',
        reasoning: {
          whyRecipientAtRisk: `${recipientPhc.name} has only ${recipient.currentStock} ${medicine.unit} left (${recipient.daysRemaining} days).`,
          whySourceSuitable: `${sourcePhc?.name} has a surplus of ${sourceData.currentStock} ${medicine.unit}.`,
          quantityJustification: `${transferQuantity} ${medicine.unit} needed to reach safety buffer + 7 days stock.`,
          sourceRemainsAboveBuffer: true,
          sourceRemainingStock: sourceData.currentStock - transferQuantity,
          sourceBufferRequired: medicine.minSafetyBuffer,
          expectedRiskReduction: `Will increase supplies to last approx ${expectedDays} days.`
        },
        createdAt: new Date().toISOString()
      });
    }
  });
  
  return recommendations;
}
