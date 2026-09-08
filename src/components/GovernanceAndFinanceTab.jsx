import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Calculator, 
  Search, 
  Filter, 
  FileText, 
  ShieldCheck, 
  CircleDollarSign, 
  HelpCircle, 
  ChevronRight, 
  ArrowRight, 
  Layers, 
  Sparkles,
  PhoneCall,
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { LOAN_PROGRAMS, CROP_DATABASE } from '../data/agriKnowledge';

// Comprehensive directory of Central and Karnataka Government Schemes
export const COMPREHENSIVE_SCHEMES_DIRECTORY = [
  {
    id: 'pm_kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    shortName: 'PM-KISAN DBT',
    category: 'Direct Income Support & DBT',
    sponsoringBody: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    crops: ['All Crops'],
    minLand: 0.1,
    maxLand: 100,
    benefit: '₹6,000 per year directly transferred to bank accounts in three equal installments of ₹2,000.',
    eligibility: 'All landholding farmer families with cultivable land in their names.',
    applyUrl: 'https://pmkisan.gov.in/',
    portalName: 'PM-KISAN Portal',
    badge: 'Central DBT',
    isCentral: true
  },
  {
    id: 'karnataka_fruits',
    name: 'Karnataka FRUITS Portal (Farmer Registration & Unified Beneficiary System)',
    shortName: 'FRUITS Karnataka',
    category: 'Direct Income Support & DBT',
    sponsoringBody: 'Department of Agriculture, Govt of Karnataka',
    crops: ['All Crops'],
    minLand: 0.1,
    maxLand: 100,
    benefit: 'Single unified Farmer Identification (FID) unlocking all Karnataka agricultural and horticulture department subsidies.',
    eligibility: 'All farmers possessing RTC / Pahani land records in Karnataka.',
    applyUrl: 'https://fruits.karnataka.gov.in/',
    portalName: 'FRUITS Portal',
    badge: 'Karnataka State Hub',
    isState: true
  },
  {
    id: 'raitha_siri',
    name: 'Karnataka Raitha Siri Scheme',
    shortName: 'Raitha Siri',
    category: 'Direct Income Support & DBT',
    sponsoringBody: 'Govt of Karnataka',
    crops: ['Maize / Corn', 'Millets', 'Paddy / Rice'],
    minLand: 0.5,
    maxLand: 10,
    benefit: 'Direct input assistance of ₹10,000 per hectare (up to 2 ha) for farmers growing coarse cereals, maize, and millets.',
    eligibility: 'Karnataka farmers registered on FRUITS portal cultivating designated cereals.',
    applyUrl: 'https://fruits.karnataka.gov.in/',
    portalName: 'FRUITS Karnataka',
    badge: 'State Subsidy',
    isState: true
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    shortName: 'PMFBY Crop Insurance',
    category: 'Crop Insurance & Risk Cover',
    sponsoringBody: 'Ministry of Agriculture & Farmers Welfare',
    crops: ['All Crops'],
    minLand: 0.1,
    maxLand: 100,
    benefit: 'Comprehensive risk insurance against drought, floods, pests, and unseasonal rains with low farmer premium (1.5% - 2% for food crops, 5% for commercial/horticulture).',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
    applyUrl: 'https://pmfby.gov.in/',
    portalName: 'PMFBY Insurance Portal',
    badge: 'Risk Cover',
    isCentral: true
  },
  {
    id: 'pm_kusum',
    name: 'PM-KUSUM (Solar Irrigation Pump Scheme)',
    shortName: 'PM-KUSUM Solar',
    category: 'Machinery & Solar Infrastructure',
    sponsoringBody: 'Ministry of New and Renewable Energy (MNRE)',
    crops: ['All Crops'],
    minLand: 1.0,
    maxLand: 50,
    benefit: 'Up to 60% capital subsidy (30% Central + 30% State) for standalone off-grid solar agriculture pumps and solarization of grid pumps.',
    eligibility: 'Individual farmers, groups of farmers, Water User Associations, and FPOs.',
    applyUrl: 'https://pmkusum.mnre.gov.in/',
    portalName: 'PM-KUSUM National Portal',
    badge: '60% Solar Subsidy',
    isCentral: true
  },
  {
    id: 'smam_mechanization',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    shortName: 'SMAM Farm Machinery',
    category: 'Machinery & Solar Infrastructure',
    sponsoringBody: 'Ministry of Agriculture & Farmers Welfare',
    crops: ['All Crops'],
    minLand: 0.5,
    maxLand: 50,
    benefit: '40% to 50% subsidy for purchasing tractors, power tillers, rotavators, drone sprayers, and laser land levelers.',
    eligibility: 'Small and marginal farmers, women farmers, and SC/ST farmers receive highest 50% priority subsidy.',
    applyUrl: 'https://agrimachinery.nic.in/',
    portalName: 'Agri Machinery Portal',
    badge: 'Machinery Subsidy',
    isCentral: true
  },
  {
    id: 'pmksy_micro_irrigation',
    name: 'PM Krishi Sinchayee Yojana (Per Drop More Crop - PMKSY)',
    shortName: 'PMKSY Micro-Irrigation',
    category: 'Irrigation & Water Conservation',
    sponsoringBody: 'Ministry of Agriculture & Farmers Welfare & Karnataka DULT',
    crops: ['Tomato', 'Sugarcane', 'Cotton', 'Chilli (Red / Green)', 'Groundnut'],
    minLand: 0.2,
    maxLand: 12.5,
    benefit: '55% subsidy for small and marginal farmers (45% for other farmers) on drip and sprinkler irrigation systems, reducing water use by 40%.',
    eligibility: 'Farmers with assured irrigation source and valid land ownership title.',
    applyUrl: 'https://pmksy.gov.in/',
    portalName: 'PMKSY Portal',
    badge: 'Drip Subsidy',
    isCentral: true
  },
  {
    id: 'midh_horticulture',
    name: 'Mission for Integrated Development of Horticulture (MIDH)',
    shortName: 'MIDH Horticulture Mission',
    category: 'Machinery & Solar Infrastructure',
    sponsoringBody: 'Ministry of Agriculture & Farmers Welfare',
    crops: ['Tomato', 'Chilli (Red / Green)', 'Specialty Crop'],
    minLand: 0.5,
    maxLand: 25,
    benefit: '40% to 50% financial assistance for poly-houses, shade net structures, pack-houses, cold rooms, and solar dryers.',
    eligibility: 'Farmers cultivating vegetables, spices, fruits, flowers, and plantation crops.',
    applyUrl: 'https://midh.gov.in/',
    portalName: 'MIDH Portal',
    badge: 'Horticulture Mission',
    isCentral: true
  },
  {
    id: 'soil_health_card',
    name: 'Soil Health Card Scheme',
    shortName: 'Soil Health Card',
    category: 'Seeds & Fertilizers',
    sponsoringBody: 'Department of Agriculture & Cooperation',
    crops: ['All Crops'],
    minLand: 0.1,
    maxLand: 100,
    benefit: 'Free soil chemical testing (NPK, micronutrients, pH, EC) with customized fertilizer dosage recommendations every 2 years.',
    eligibility: 'All farmers across India.',
    applyUrl: 'https://soilhealth.dac.gov.in/',
    portalName: 'Soil Health Portal',
    badge: 'Free Soil Testing',
    isCentral: true
  },
  {
    id: 'enam_portal',
    name: 'e-NAM (National Agriculture Market)',
    shortName: 'e-NAM Trading Hub',
    category: 'Direct Income Support & DBT',
    sponsoringBody: "Small Farmers' Agri-Business Consortium (SFAC)",
    crops: ['All Crops'],
    minLand: 0.1,
    maxLand: 100,
    benefit: 'Pan-India electronic trading portal connecting over 1,300 APMC mandis for transparent price discovery and direct online bank payments.',
    eligibility: 'All farmers selling produce at participating APMC mandis.',
    applyUrl: 'https://www.enam.gov.in/',
    portalName: 'e-NAM Portal',
    badge: 'Online Mandi',
    isCentral: true
  },
  {
    id: 'technology_mission_cotton',
    name: 'Technology Mission on Cotton (TMC)',
    shortName: 'Cotton Tech Mission',
    category: 'Seeds & Fertilizers',
    sponsoringBody: 'Ministry of Textiles & Agriculture',
    crops: ['Cotton'],
    minLand: 0.5,
    maxLand: 50,
    benefit: 'Subsidies on certified quality seeds, pheromone traps for pink bollworm management, and micro-ginning grading equipment.',
    eligibility: 'Cotton growers in notified cotton districts.',
    applyUrl: 'https://txcindia.gov.in/',
    portalName: 'Cotton Mission Portal',
    badge: 'Cotton Subsidy',
    isCentral: true
  },
  {
    id: 'operation_greens',
    name: 'Operation Greens (TOP to TOTAL)',
    shortName: 'Operation Greens',
    category: 'Machinery & Solar Infrastructure',
    sponsoringBody: 'Ministry of Food Processing Industries (MoFPI)',
    crops: ['Tomato', 'Specialty Crop'],
    minLand: 1.0,
    maxLand: 100,
    benefit: '50% subsidy on transportation freight and cold storage rental during bumper harvest gluts to prevent distress spot sales.',
    eligibility: 'Individual growers, Farmer Producer Organizations (FPOs), and agricultural cooperatives.',
    applyUrl: 'https://www.mofpi.gov.in/',
    portalName: 'MoFPI Portal',
    badge: 'Freight Subsidy',
    isCentral: true
  }
];

export default function GovernanceAndFinanceTab({
  defaultLandSize = 3.5,
  defaultDistrict = 'Davanagere',
  defaultCrop = 'Maize / Corn',
  farmerName = '',
  onNavigateToForm,
  onNavigateToReport
}) {
  const [landSize, setLandSize] = useState(defaultLandSize || 3.5);
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop || 'Maize / Corn');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [scaleFilter, setScaleFilter] = useState('All'); // 'All' | 'Smallholder' | 'Commercial'
  const [searchQuery, setSearchQuery] = useState('');

  // Loan Calculator State
  const isSmallholder = Number(landSize) < 2.0;
  const initialLoanAmount = isSmallholder ? 120000 : 500000;
  const [calcLoanAmount, setCalcLoanAmount] = useState(initialLoanAmount);
  const [calcTenureMonths, setCalcTenureMonths] = useState(isSmallholder ? 12 : 36);
  const [calcInterestRate, setCalcInterestRate] = useState(isSmallholder ? 4.0 : 8.5);

  // Active Loan Package based on current land size
  const activeLoanPackage = isSmallholder ? LOAN_PROGRAMS.smallholder : LOAN_PROGRAMS.commercial;

  // Filter schemes based on category, scale, crop, and search query
  const filteredSchemes = useMemo(() => {
    return COMPREHENSIVE_SCHEMES_DIRECTORY.filter(scheme => {
      // Category match
      if (categoryFilter !== 'All' && scheme.category !== categoryFilter) {
        return false;
      }

      // Scale match
      if (scaleFilter === 'Smallholder' && scheme.minLand > 2.0) {
        return false;
      }
      if (scaleFilter === 'Commercial' && scheme.maxLand < 2.0) {
        return false;
      }

      // Crop match (either 'All Crops' or includes selected crop)
      const matchesCrop = scheme.crops.includes('All Crops') || scheme.crops.some(c => c.toLowerCase().includes(selectedCrop.toLowerCase()));
      if (!matchesCrop) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inName = scheme.name.toLowerCase().includes(query);
        const inBenefit = scheme.benefit.toLowerCase().includes(query);
        const inBody = scheme.sponsoringBody.toLowerCase().includes(query);
        const inCategory = scheme.category.toLowerCase().includes(query);
        return inName || inBenefit || inBody || inCategory;
      }

      return true;
    });
  }, [categoryFilter, scaleFilter, selectedCrop, searchQuery]);

  // Loan EMI & Interest Calculation
  const loanCalculations = useMemo(() => {
    const P = Number(calcLoanAmount);
    const r = (Number(calcInterestRate) / 100) / 12; // Monthly interest rate
    const n = Number(calcTenureMonths);

    // Standard EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    let monthlyEmi = 0;
    let totalRepayable = 0;
    let totalInterest = 0;

    if (r > 0 && n > 0) {
      monthlyEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      totalRepayable = monthlyEmi * n;
      totalInterest = totalRepayable - P;
    } else {
      monthlyEmi = P / (n || 1);
      totalRepayable = P;
      totalInterest = 0;
    }

    // Subvention savings comparison (KCC 4% vs standard 7% base or commercial 9%)
    const commercialRate = 0.085;
    const unsubventedInterest = (P * commercialRate * (n / 12));
    const interestSaved = Math.max(0, unsubventedInterest - totalInterest);

    return {
      monthlyEmi: Math.round(monthlyEmi),
      totalRepayable: Math.round(totalRepayable),
      totalInterest: Math.round(totalInterest),
      interestSaved: Math.round(interestSaved)
    };
  }, [calcLoanAmount, calcTenureMonths, calcInterestRate]);

  return (
    <div className="space-y-8">

      {/* ========================================================= */}
      {/* 1. HERO HEADER BANNER                                    */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛</span>
              <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Official Governance & Financial Portal
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Governance Policies & Tailored Financial Guidance
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Access official government subsidies, direct benefit transfers (DBT), crop insurance, and agricultural bank loans tailored to your land size in <strong>{defaultDistrict}</strong>.
            </p>
          </div>

          {/* Active Profile Pill Card */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-emerald-500/30 shrink-0 text-left sm:text-right space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Landholding Filter</div>
            <div className="text-lg font-black text-white flex sm:justify-end items-center gap-2">
              <span>{landSize} Acres</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isSmallholder 
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                  : 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
              }`}>
                {isSmallholder ? 'Smallholder (< 2 Ac)' : 'Commercial Scale (≥ 2 Ac)'}
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-medium">
              📍 {defaultDistrict} • {selectedCrop}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TAILORED BANK LOAN RECOMMENDATION CARD                */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Tailored Bank Loan Recommendation
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {activeLoanPackage.primaryLoan}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              {activeLoanPackage.tier}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Subsidized Interest Rate</div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {activeLoanPackage.interestRate}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">With 3% prompt repayment benefit</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Maximum Credit Limit</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {activeLoanPackage.maxLimit}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isSmallholder ? 'Collateral-free up to ₹1.6 Lakh' : 'Scale-based project finance'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Repayment Tenure</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {activeLoanPackage.repaymentTenure}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Flexible after seasonal harvest</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase">Official Application Portal</div>
                <div className="text-sm font-black text-emerald-950 mt-1">
                  {activeLoanPackage.portalName}
                </div>
              </div>
              <a
                href={activeLoanPackage.actionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Apply Online</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Eligibility & Secondary Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Key Eligibility */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Eligibility Requirements</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                {activeLoanPackage.eligibilityCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary Options */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Alternative & Complementary Loan Options</span>
              </div>
              <div className="space-y-2">
                {activeLoanPackage.secondaryOptions.map((opt, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800">{opt.name}</div>
                    <div className="text-slate-600 mt-0.5">{opt.limit}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE LOAN REPAYMENT & EMI CALCULATOR           */}
      {/* ========================================================= */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-lg text-slate-900">
              Interactive Agricultural Credit & Interest Calculator
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Calculates interest subvention discount for farmers
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Loan Amount Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">Loan Amount</label>
                <span className="text-sm font-black text-emerald-700 font-mono">
                  ₹{calcLoanAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max={isSmallholder ? 300000 : 2500000}
                step="10000"
                value={calcLoanAmount}
                onChange={(e) => setCalcLoanAmount(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹20,000</span>
                <span>Max: ₹{isSmallholder ? '3,00,000' : '25,00,000'}</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">Repayment Period (Tenure)</label>
                <span className="text-sm font-black text-slate-900 font-mono">
                  {calcTenureMonths} Months ({Math.round(calcTenureMonths / 12 * 10) / 10} Years)
                </span>
              </div>
              <input
                type="range"
                min="6"
                max={isSmallholder ? 24 : 60}
                step="6"
                value={calcTenureMonths}
                onChange={(e) => setCalcTenureMonths(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>6 Months</span>
                <span>{isSmallholder ? '24 Months' : '60 Months'}</span>
              </div>
            </div>

            {/* Interest Rate Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Loan Scheme Interest Rate</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCalcInterestRate(4.0)}
                  className={`p-3 rounded-xl border text-left transition ${
                    calcInterestRate === 4.0
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-extrabold text-xs">4.0% p.a. (KCC Prompt Repayment)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">7% base rate with 3% prompt subvention</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCalcInterestRate(8.5)}
                  className={`p-3 rounded-xl border text-left transition ${
                    calcInterestRate === 8.5
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-extrabold text-xs">8.5% p.a. (Commercial Term Loan)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Standard NABARD & commercial bank rate</div>
                </button>
              </div>
            </div>

          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800/60 space-y-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Repayment Breakdown
            </div>

            <div>
              <div className="text-xs text-slate-400">Estimated Monthly Installment (EMI)</div>
              <div className="text-3xl font-black text-white mt-0.5">
                ₹{loanCalculations.monthlyEmi.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> /month</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Principal Loan:</span>
                <span className="font-bold text-white">₹{calcLoanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Interest Payable:</span>
                <span className="font-bold text-emerald-300">₹{loanCalculations.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Repayment Amount:</span>
                <span className="font-bold text-white">₹{loanCalculations.totalRepayable.toLocaleString()}</span>
              </div>
            </div>

            {loanCalculations.interestSaved > 0 && (
              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/40 text-xs space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subvention Savings</span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-snug">
                  You save approx. <strong>₹{loanCalculations.interestSaved.toLocaleString()}</strong> in interest through the Government 3% prompt repayment incentive!
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. GOVERNMENT POLICIES & SUBSIDIES DIRECTORY             */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              Government Policies & Subsidies Directory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing official welfare schemes for <strong>{selectedCrop}</strong> in <strong>{defaultDistrict}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {filteredSchemes.length} Schemes Available
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search scheme name, benefit, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Scheme Categories</option>
                <option value="Direct Income Support & DBT">Direct Income Support & DBT</option>
                <option value="Crop Insurance & Risk Cover">Crop Insurance & Risk Cover</option>
                <option value="Machinery & Solar Infrastructure">Machinery & Solar Infrastructure</option>
                <option value="Irrigation & Water Conservation">Irrigation & Water Conservation</option>
                <option value="Seeds & Fertilizers">Seeds & Fertilizers</option>
              </select>
            </div>

            {/* Landholding Scale Filter */}
            <div>
              <select
                value={scaleFilter}
                onChange={(e) => setScaleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Land Sizes</option>
                <option value="Smallholder">Smallholder (&lt; 2 Acres)</option>
                <option value="Commercial">Commercial (≥ 2 Acres)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Schemes List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {scheme.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {scheme.category}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">
                      {scheme.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {scheme.benefit}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div><strong>Sponsor:</strong> {scheme.sponsoringBody}</div>
                  <div><strong>Eligibility:</strong> {scheme.eligibility}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-700">
                  {scheme.portalName}
                </span>

                <a
                  href={scheme.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Apply Online</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. STEP-BY-STEP APPLICATION & REQUIRED DOCUMENTS CHECKLIST */}
      {/* ========================================================= */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
          <h4 className="font-extrabold text-lg text-white">
            Farmer Document Checklist & Step-by-Step Application Guide
          </h4>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              1
            </div>
            <h5 className="font-bold text-sm text-white">Get FRUITS FID Number</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Register on the Karnataka FRUITS portal or visit your local Raitha Samparka Kendra (RSK) with your Aadhaar and RTC to generate your unique FID.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              2
            </div>
            <h5 className="font-bold text-sm text-white">Seed Bank Account</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure your bank savings account is active and seeded with your Aadhaar for Direct Benefit Transfer (DBT) subsidies without delay.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              3
            </div>
            <h5 className="font-bold text-sm text-white">Submit Scheme Application</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the direct "Apply Online" buttons above, enter your FID/Aadhaar, select your crop season, and submit the subsidy form.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              4
            </div>
            <h5 className="font-bold text-sm text-white">Field Verification & DBT</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Village Agriculture Officer (VAO) verifies crop standing on e-Kshana/crop survey app. Funds are credited directly to your bank!
            </p>
          </div>

        </div>

        {/* Required Documents List */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Mandatory Documents Checklist:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aadhaar Card of Applicant</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Updated RTC / Pahani Extract</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bank Passbook / Cancelled Cheque</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>FRUITS FID or JanSamarth Login</span>
            </div>
          </div>
        </div>

        {/* Quick Hub Portals */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://fruits.karnataka.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
            >
              <span>Karnataka FRUITS Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://pmkisan.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
            >
              <span>PM-KISAN National Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://www.jansamarth.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
            >
              <span>JanSamarth Credit Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToForm && (
              <button
                onClick={onNavigateToForm}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition"
              >
                ← Back to Farm Form
              </button>
            )}
            {onNavigateToReport && (
              <button
                onClick={onNavigateToReport}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition"
              >
                View Advisory Report →
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
