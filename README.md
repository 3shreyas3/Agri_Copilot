# AgriCopilot - AI Agricultural Advisory & Decision Intelligence Platform

A high-performance, responsive web application engineered strictly according to the product specifications in [`AgriCopilot_Design.md`](./AgriCopilot_Design.md).

AgriCopilot empowers farmers, agricultural extension officers, and agronomists with hyper-localized crop health assessments, harvest price forecasting, value-addition profit modeling, government policy recommendations, and land-size filtered bank credit guidance.

---

## 🌟 Key Features & Architectural Implementation

### 1. Data Requirements & Input Dossier
- **Farmer Profile**: Full Name, Land Size (Acres), Village/Town Location, and **Administrative District Dropdown** featuring 10 key Karnataka agricultural hubs (Kolar, Belagavi, Mandya, Dharwad, Shivamogga, Chikkamagaluru, Vijayapura, Ballari, Mysuru, Haveri) + custom district entry.
- **Crop & Environment**:
  - Crop Cultivation (Cotton, Tomato, Wheat, Paddy, Groundnut, Soybean, Onion, Sugarcane, and custom varieties).
  - Soil Type (Alluvial, Black / Regur, Red & Yellow, Laterite, Sandy Loam, Clayey).
  - Ambient Temperature (°C) and Annual/Seasonal Rainfall (mm) with **1-Click Auto-Fill Optimal Climate**.
  - **Regional Popularity (%) Slider**: Real-time visual feedback alerting farmers of harvest gluts or scarcity price surges.
- **Automated Spectral Soil Verification & Mismatch Warning**:
  - Dedicated drag-and-drop or file upload for the farmer's soil sample photo.
  - Built-in pedological spectral analyzer computing RGB, HSL (Hue, Saturation, Lightness), and texture roughness.
  - **Live Mismatch Warning**: If the physical photograph does not match the selected soil type (e.g., Red Ferruginous soil photo uploaded while Black Soil is selected), the application displays a prominent discrepancy alert banner with exact spectral metrics (Hex, Hue°, Lightness%) and offers a **1-click auto-update button** to synchronize the selection.
  - **Advisory Risk Adjustment**: The generated advisory automatically flags the soil discrepancy, factors in a precautionary safety penalty to the Health Score, and includes verified laboratory Soil Health Card recommendations.

### 2. The 5 Analytical Lenses (AgriCopilot Engine)
1. **Crop Health & Risk Assessment**:
   - Dynamic 1–10 Health Score with color-coded circular gauge.
   - Soil suitability comparison against crop requirements.
   - Localized pest vulnerabilities mapped to specific districts (e.g., Pink Bollworm in Vidarbha/Telangana, Tomato Leaf Curl Virus in Kolar/Chittoor, Yellow Rust in Ludhiana).
   - Soil image spectral and texture diagnosis.
2. **Harvest Price Forecasting**:
   - Supply & demand logic governed by Regional Popularity %:
     - **> 80% Popularity**: Over-supply glut alert with bearish sentiment and price depression modeling.
     - **< 35% Popularity**: Scarcity premium with bullish sentiment and seller leverage projections.
     - **Balanced (35%–80%)**: Stable seasonal auction predictions.
   - Predicted Harvest Price Range in ₹/Quintal against benchmark MSP.
3. **Market Opportunities & Value-Addition**:
   - Alternative channels: e-NAM electronic trading, district FPO aggregators, direct-to-consumer farmgate sales.
   - **Interactive Value-Addition Profit Calculator**: Simulates crop yield (in quintals) and calculates direct revenue comparison between distress spot sales vs value-added processing (e.g. Tomato Puree, Packaged Atta, Cold-Pressed Groundnut Oil, Jaggery Granules).
4. **Government Policies & Legal Support**:
   - Automatically maps national and state schemes (PM-KISAN, PMFBY Crop Insurance, MIDH Horticulture Mission, SMAM Mechanization Subsidies, Micro-Irrigation Fund).
5. **Financial Guidance (Bank Loans) Filter**:
   - **Smallholders (< 2 Acres)**: Prioritizes Kisan Credit Card (KCC) revolving credit at 4% effective interest (with 3% prompt repayment subvention), Joint Liability Groups (JLG), and PM MUDRA micro-finance.
   - **Medium / Commercial (≥ 2 Acres)**: Directs to NABARD Agri-Business Term Loans, Heavy Equipment Financing, and e-NWR Warehouse Receipt Pledge Financing.
   - Direct, clickable links to official banking portals.

### 3. Output Format Compliance
- **Mandatory Markdown Report**: Easily view and copy the exact markdown output conforming to the Master System Prompt specification.
- **Interactive Visual Dashboard**: Polished cards, health gauge, price cards, and profit calculators.

### 4. Farmer Accessibility & Modern Tools
- **🔊 Voice Narration (Text-to-Speech)**: Speaks the advisory aloud in regional accents so farmers can listen directly in the field.
- **🌐 Multilingual Support**: English, Hindi (हिन्दी), Marathi (मराठी), Punjabi (ਪੰਜਾਬੀ), Telugu (తెలుగు).
- **📋 WhatsApp Share & PDF Print**: 1-click formatted summary to share with local farmer groups or print cleanly.
- **💾 Saved Advisory History**: Local history storage to track multiple crop cycles and acreage parcels.
- **🌾 Live Mandi Price Ticker**: Real-time indicative spot prices across major agricultural commodities.
- **⚙️ Google Gemini Multimodal Live API Support**: Configure your Gemini API key (Gemini 1.5 Flash / 2.0 Flash / 1.5 Pro) in the Settings modal for real-time generative multimodal processing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Running Locally

1. **Clone or open the directory**:
   ```bash
   cd C:/Users/shrey/Desktop/agriAi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
agriAi/
├── AgriCopilot_Design.md       # Original Product Design & Master Prompt documentation
├── package.json               # Dependencies and scripts (React 18, Vite 6, Tailwind CSS, Lucide)
├── vite.config.js             # Vite configuration with React plugin
├── tailwind.config.js         # Agronomic color palette and layout tokens
├── postcss.config.js          # PostCSS configuration
├── index.html                 # Main HTML template with Google Fonts (Inter, Plus Jakarta Sans)
├── src/
│   ├── main.jsx               # Application entry point
│   ├── App.jsx                # Root app state, tabs, modals and preset management
│   ├── index.css              # Tailwind directives and print stylesheet
│   ├── translations.js        # Multi-language dictionary (EN, HI, MR, PA, TE)
│   ├── data/
│   │   └── agriKnowledge.js   # Crops, soils, pests, MSP prices, loan matrices, sample presets
│   ├── services/
│   │   ├── advisoryEngine.js  # 5-lens agronomic engine & Gemini multimodal caller
│   │   └── speechService.js   # Web Speech API narration controller
│   └── components/
│       ├── Navbar.jsx         # App bar with language switcher, presets & audio toggle
│       ├── MandiTicker.jsx    # Real-time scrolling Agmarknet commodity prices
│       ├── FarmerInputForm.jsx# Input dossier (Farmer Profile, Crop Details, Popularity Slider, Soil Upload)
│       ├── AdvisoryReport.jsx # Master advisory report with visual gauge & markdown export
│       ├── ValueAddCalculator.jsx # Interactive profit simulator for processing
│       ├── SettingsModal.jsx  # Optional Gemini API key & model configuration
│       ├── AdvisoryHistoryModal.jsx # Saved past advisory cycles
│       ├── DesignDocsModal.jsx # In-app viewer of AgriCopilot prompt specs
│       └── Footer.jsx         # Official links and agricultural portal directory
```

---

## 🧪 Testing Case Study Presets

You can immediately test the system using the preset buttons at the top of the form or in the navbar:
1. **Ramesh Patil (Cotton • High Risk Over-supply)**: 5.5 Acres in Yavatmal, Maharashtra. Demonstrates the >80% regional popularity over-supply crash alert and commercial loan filtering.
2. **Anita Devi (Tomato • Smallholder High Value-Add)**: 1.5 Acres in Kolar, Karnataka. Demonstrates smallholder KCC loan filtering (<2 Acres) and the value-addition puree profit multiplier.
3. **Harpreet Singh (Basmati Paddy • Export Grade)**: 12.0 Acres in Ludhiana, Punjab. Demonstrates large-scale mechanization subsidies (SMAM) and parboiled rice export arbitrage.
4. **Suresh Patel (Groundnut • Bullish Surge Potential)**: 3.2 Acres in Junagadh, Gujarat. Demonstrates low regional popularity (<35%) price surge forecasting and cold-pressed oil value addition.
