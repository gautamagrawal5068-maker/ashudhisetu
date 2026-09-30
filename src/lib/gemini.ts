import { ExtractedItem } from '../types/index';

export async function extractFromImage(
  imageBase64: string, 
  mimeType: string, 
  customApiKey?: string
): Promise<{ items: ExtractedItem[], isMock: boolean, modelUsed?: string }> {
  // Use custom key from client, or server environment variables
  const apiKey = (customApiKey && customApiKey.trim().length > 5)
    ? customApiKey.trim() 
    : (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  
  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-3.7-flash',
        'gemini-3.5-flash',
        'gemini-flash-latest',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash',
      ];
      
      const prompt = `You are an expert medical inventory OCR assistant for Primary Health Centres (PHCs) in India.
Analyze this image of a stock register or medicine receipt and extract all listed medicines and their current in-stock quantities.

Return ONLY a JSON array of objects with exactly these fields:
- medicineName: (string) The name of the medicine as detected in the image
- quantity: (number) Numerical in-stock quantity (integer >= 0)
- confidence: (number between 0.0 and 1.0) Detection confidence score
- unit: (string) Unit of measurement (e.g., 'sachets', 'tablets', 'capsules', 'vials')
- matchedMedicineId: (string or null) Map to one of the following exact IDs if it matches:
  * 'ors' for ORS / Oral Rehydration Salts
  * 'paracetamol' for Paracetamol / PCM 500mg
  * 'amoxicillin' for Amoxicillin 250mg / 500mg
  * 'zinc' for Zinc Tablets 20mg
  * 'ifa' for Iron & Folic Acid Tablets (IFA)
  * 'azithromycin' for Azithromycin
  * 'insulin' for Regular Human Insulin vials
  * 'antimalarial' for Chloroquine / Antimalarial medicine

Return strictly a valid JSON array without backticks or markdown fences.`;

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              temperature: 0.1,
            }
          });
          
          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || 'image/jpeg'
              }
            }
          ]);
          
          const text = result.response.text();
          let parsed: ExtractedItem[] = [];
          try {
            parsed = JSON.parse(text);
          } catch (e) {
            const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleaned);
          }

          if (Array.isArray(parsed) && parsed.length > 0) {
            return { 
              items: parsed.map(item => ({
                medicineName: item.medicineName || 'Unknown Medicine',
                quantity: Number(item.quantity) || 0,
                confidence: Math.min(1, Math.max(0.5, Number(item.confidence) || 0.95)),
                unit: item.unit || 'units',
                matchedMedicineId: item.matchedMedicineId || undefined,
              })), 
              isMock: false,
              modelUsed: `Google Gemini (${modelName})`
            };
          }
        } catch (modelErr: any) {
          // Log concise error and try next model
          console.warn(`Model ${modelName} fallback attempt.`);
        }
      }
    } catch (error: any) {
      console.error("Gemini API error, falling back to demo simulation:", error?.message || error);
    }
  }

  // High-fidelity fallback for offline demo testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isMock: true,
        modelUsed: 'Demo Simulation (Sample Ledger Data)',
        items: [
          { medicineName: 'ORS (Oral Rehydration Salts)', quantity: 40, confidence: 0.96, unit: 'sachets', matchedMedicineId: 'ors' },
          { medicineName: 'Paracetamol 500mg IP', quantity: 250, confidence: 0.94, unit: 'tablets', matchedMedicineId: 'paracetamol' },
          { medicineName: 'Amoxicillin Trihydrate 250mg', quantity: 180, confidence: 0.89, unit: 'capsules', matchedMedicineId: 'amoxicillin' },
          { medicineName: 'Zinc Sulfate 20mg', quantity: 120, confidence: 0.91, unit: 'tablets', matchedMedicineId: 'zinc' },
          { medicineName: 'Iron & Folic Acid (IFA) Large', quantity: 300, confidence: 0.86, unit: 'tablets', matchedMedicineId: 'ifa' },
          { medicineName: 'Azithromycin 500mg', quantity: 75, confidence: 0.88, unit: 'tablets', matchedMedicineId: 'azithromycin' },
          { medicineName: 'Regular Human Insulin 40IU', quantity: 12, confidence: 0.95, unit: 'vials', matchedMedicineId: 'insulin' },
          { medicineName: 'Chloroquine Phosphate 250mg', quantity: 90, confidence: 0.82, unit: 'tablets', matchedMedicineId: 'antimalarial' },
        ]
      });
    }, 1200);
  });
}
