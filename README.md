# AushadhiSetu (औषधिसेतु)
### AI-Powered Medicine Stock-Out Prevention & Redistribution Platform for India's Primary Health Centres (PHCs)

> **"Predict shortages. Move supplies sooner. Protect every rural clinic."**  
> *कमी की भविष्यवाणी करें • आपातकालीन स्टॉक-आउट रोकें • हर पीएचसी को सुरक्षित रखें*

---

## 🌟 Overview

**AushadhiSetu** is an enterprise-grade public healthcare platform built to eliminate seasonal and structural medicine stock-outs across rural India. It bridges the critical 14-day paper ledger lag by combining **Google Gemini Multimodal Vision OCR** with **Explainable Demand Forecasting** and **Automated Inter-PHC Surplus Redistribution**.

---

## 🔑 Google Gemini API Key Configuration

AushadhiSetu supports **both real-time live Google Gemini multimodal vision extraction** and **offline demo simulation**.

### Option A: Direct In-App Configuration (Recommended)
1. Open the application at `http://localhost:3000`.
2. Click the **"Configure API Key"** button in the top navigation bar or on the Stock Register Upload page.
3. Paste your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
4. Click **"Test Key"** to verify connection, then **"Save Configuration"**. Your key is securely stored in your browser's `localStorage`.

### Option B: Environment Variable
Create or edit `.env.local` in the project root:
```bash
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
```

*Note: If no API key is provided, the platform automatically runs in deterministic Demo Simulation Mode with labeled sample data, so all end-to-end user journeys function seamlessly without external dependencies.*

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build & Verification
```bash
npm run build
npm run start
```

---

## 🎯 Demo Walkthrough Scenarios

### Scenario 1: Frontline PHC Staff (Priya Sharma @ PHC Aarogya)
1. Navigate to `/login` and choose **PHC Health Worker**.
2. Notice **ORS (Oral Rehydration Salts)** is marked as **🔴 Critical Deficit (40 sachets remaining, ~4 days of supply left)** due to the Monsoon demand surge.
3. Click **"Scan Register (OCR)"** (`/phc/upload`).
4. Upload a physical stock ledger photo or click **"Use Sample Register Photo (Demo Mode)"**.
5. Inspect the Gemini Vision extraction table with detected item names, quantities, and confidence scores ($80\%\text{--}96\%$).
6. Click **"Confirm & Update Inventory"** to update live telemetry.

### Scenario 2: District Health Command (Dr. Rajesh Kumar @ Madhavpur HQ)
1. Navigate to `/login` and select **District Health Officer**.
2. View the **Geospatial District Map** showing 10 PHCs across 5 blocks, with **PHC Aarogya** highlighted in pulsing red and a supply route connected from **PHC Chandra**.
3. Open **"Forecasting Engine"** (`/district/forecast`) to review the explainable mathematical model:
   $$P = \mu_7 \times S_m \times F_p$$
   $$\text{Days Remaining} = \frac{\text{Current Stock}}{P}$$
4. Navigate to **"Redistribution Plan"** (`/district/transfers`) to inspect the recommended **80 ORS sachets** transfer from **PHC Chandra $\rightarrow$ PHC Aarogya**.
5. Review the decision matrix verifying that PHC Chandra remains safely above its $50$-sachet buffer ($270$ units remaining).
6. Click **"Approve Transfer"** — witness instant dual-language SMS/WhatsApp dispatches generated in **English** and **Hindi**:
   - **English:** `TRANSFER AUTHORIZED: 80 sachets of ORS dispatched from PHC Chandra to PHC Aarogya...`
   - **Hindi:** `स्थानांतरण स्वीकृत: PHC Chandra से PHC Aarogya को ORS की 80 sachets...`

---

## 🏛️ Monitored Facilities (District Madhavpur)

| PHC Facility | Block | Baseline Footfall | Critical Incident |
|:---|:---|:---|:---|
| **PHC Aarogya** | Sadar | 45 patients/day | 🔴 **ORS Deficit (4 days left)** |
| **PHC Bodhi** | Sadar | 30 patients/day | 🟢 Normal Buffer |
| **PHC Chandra** | Mofussil | 25 patients/day | 🟢 **ORS Surplus (350 sachets)** |
| **PHC Dhanvantari**| Mofussil | 35 patients/day | 🟢 Normal Buffer |
| **PHC Ekta** | Tribal | 20 patients/day | 🟢 Normal Buffer |
| **PHC Firdaus** | Tribal | 22 patients/day | 🟢 Normal Buffer |
| **PHC Gaurav** | Riverside | 40 patients/day | 🟠 Monitored |
| **PHC Hariti** | Riverside | 28 patients/day | 🟢 Normal Buffer |
| **PHC Ishaan** | Hilltop | 15 patients/day | 🟢 Normal Buffer |
| **PHC Jyoti** | Hilltop | 18 patients/day | 🟢 Normal Buffer |

---

## 📦 Essential Drug Formulary

1. **ORS (Oral Rehydration Salts)**
2. **Paracetamol 500mg IP**
3. **Amoxicillin Trihydrate 250mg**
4. **Zinc Sulfate 20mg**
5. **Iron & Folic Acid (IFA) Tablets**
6. **Azithromycin 500mg**
7. **Regular Human Insulin 40IU**
8. **Chloroquine Phosphate 250mg (Antimalarial)**

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, Server Actions, Client Components)
- **Language**: TypeScript 5 (100% Strict Type-Safety)
- **Styling**: Tailwind CSS, Plus Jakarta Sans, JetBrains Mono
- **AI / Vision**: Google Gemini 1.5 Flash (`@google/generative-ai`) with structured JSON schema responses
- **State Management**: React Context with Browser `localStorage` persistence
- **Icons**: Lucide React
