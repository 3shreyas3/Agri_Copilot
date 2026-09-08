import React from 'react';
import { BookOpen, X, Code, CheckCircle2, Cpu, Database, Compass, Layers } from 'lucide-react';

export default function DesignDocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">AgriCopilot Product Design & System Specs</h3>
              <p className="text-xs text-slate-400">Master Prompt Engineering & Agronomic Decision Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          
          {/* Architectural Pillars */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-600" />
              1. Five Analytical Lenses
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. Health & Risk Assessment</span>
                Compares crop requirements with soil type, temp, rainfall, and analyzes soil image for visible nutrient deficiencies. Generates 0-100% Health Score and risk alerts.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. Price Forecasting</span>
                Evaluates Regional Popularity %. Saturation &gt;80% triggers harvest glut warnings; &lt;35% signals scarcity surge. Outputs predicted price range & sentiment.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. Market Opportunities</span>
                Suggests alternative channels (Mandis, direct-to-consumer, export) and value-addition (pureeing, solar drying, cold-pressing).
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">4. Governance & Subsidies</span>
                Maps central and state policies (PM-KISAN, PMFBY, MIDH, SMAM) tailored to crop and district.
              </div>
            </div>
          </div>

          {/* Financial Filter Rule */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs">
            <h5 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-700" />
              Financial Logic Filter (Land Size Branching)
            </h5>
            <ul className="list-disc list-inside space-y-1 text-emerald-900 mt-2">
              <li><strong>Smallholders (&lt; 2 Acres):</strong> Directs to Kisan Credit Card (KCC) revolving credit (4% effective subvention), Joint Liability Groups (JLG), and PM MUDRA micro-finance.</li>
              <li><strong>Medium / Commercial (&ge; 2 Acres):</strong> Directs to NABARD Agri-Business Term Loans, Equipment & Harvester Financing, and e-NWR Warehouse Receipt Pledge financing.</li>
            </ul>
          </div>

          {/* Master System Prompt */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-600" />
              Master System Prompt Implementation
            </h4>
            <p className="text-xs text-slate-500 mb-2">
              The exact system instruction passed to multimodal models (Claude 3.5 Sonnet / GPT-4o / Gemini 2.0):
            </p>
            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-normal border border-slate-800">
{`# ROLE
You are AgriCopilot, an elite AI Agronomist, Market Analyst, and Government Policy Expert. Your mission is to provide hyper-localized, data-driven agricultural advisories to farmers to maximize yield and profitability while minimizing risk.

# INPUT DATA STRUCTURE
1. FARMER PROFILE: {Name, Land Size (Acres), Location, District}
2. CROP DETAILS: {Crop Name, Soil Type, Soil Image (if provided), Temp, Rainfall, Regional Popularity %}

# MANDATORY OUTPUT FORMAT:
## 🌾 AgriCopilot Advisory for [Farmer Name]
**Location:** [District], [Location] | **Land Size:** [Acres] Acres

### 🛠 Crop Analysis: [Crop Name]
- **Health Status:** [Score/10] - [Brief Summary]
- **Risk Profile:** [High/Medium/Low] ⚠️ [Specific Risk Description]
- **Soil Insight:** [Analysis of soil type and image]

### 💰 Economic Outlook
- **Predicted Harvest Price:** [Price Range]
- **Market Trend:** [Analysis based on Popularity %]
- **Opportunity:** [Value addition or market tip]

### 🏛 Governance & Finance
- **Applicable Policies:** [Policy Name] → [Benefit]
- **Recommended Loan:** [Loan Type based on Land Size]
- **Action Link:** [URL to Gov/Bank Portal]`}
            </pre>
          </div>

          {/* RAG & Live Data Engine */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Accuracy Enhancement (RAG Pipeline)
            </h4>
            <p className="text-xs text-slate-600">
              To prevent AI hallucinations, AgriCopilot grounds its reasoning in real-time commodity data from Agmarknet, official MSP minimum support prices, and the national Ministry of Agriculture scheme repositories.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
}
