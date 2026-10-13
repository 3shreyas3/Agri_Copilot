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

import { TRANSLATIONS, getTranslatedDistrict, getTranslatedCropName } from '../translations';

const GOV_I18N = {
  en: {
    officialGovPortal: 'Official Governance & Financial Portal',
    govHeading: 'Governance Policies & Tailored Financial Guidance',
    govSubheading: (dist) => `Access official government subsidies, direct benefit transfers (DBT), crop insurance, and agricultural bank loans tailored to your land size in ${dist}.`,
    activeFilter: 'Active Landholding Filter',
    smallholderScale: 'Smallholder (< 2 Ac)',
    commercialScale: 'Commercial Scale (≥ 2 Ac)',
    acresUnit: 'Acres',
    tailoredLoanRec: 'Tailored Bank Loan Recommendation',
    subsidizedInterest: 'Subsidized Interest Rate',
    promptRepayment: 'With 3% prompt repayment benefit',
    maxCreditLimit: 'Maximum Credit Limit',
    collateralFree: 'Collateral-free up to ₹1.6 Lakh',
    scaleBasedFinance: 'Scale-based project finance',
    repaymentTenure: 'Repayment Tenure',
    flexibleHarvest: 'Flexible after seasonal harvest',
    officialPortal: 'Official Application Portal',
    applyOnline: 'Apply Online',
    keyEligibility: 'Key Eligibility Requirements',
    altLoans: 'Alternative & Complementary Loan Options',
    calcTitle: 'Interactive Agricultural Credit & Interest Calculator',
    calcSubtitle: 'Calculates interest subvention discount for farmers',
    loanAmount: 'Loan Amount',
    tenureLabel: 'Repayment Period (Tenure)',
    months: 'Months',
    years: 'Years',
    schemeInterestRate: 'Loan Scheme Interest Rate',
    kccRateLabel: '4.0% p.a. (KCC Prompt Repayment)',
    kccRateDesc: '7% base rate with 3% prompt subvention',
    commRateLabel: '8.5% p.a. (Commercial Term Loan)',
    commRateDesc: 'Standard NABARD & commercial bank rate',
    repaymentBreakdown: 'Repayment Breakdown',
    estEmi: 'Estimated Monthly Installment (EMI)',
    perMonth: ' /month',
    principalLoan: 'Principal Loan:',
    totalInterest: 'Total Interest Payable:',
    totalRepayment: 'Total Repayment Amount:',
    subventionSavings: 'Subvention Savings',
    saveApprox: (saved) => `You save approx. ₹${saved.toLocaleString()} in interest through the Government 3% prompt repayment incentive!`,
    schemesDirectory: 'Government Policies & Subsidies Directory',
    schemesFor: (crop, dist) => `Showing official welfare schemes for ${crop} in ${dist}.`,
    schemesAvailable: (count) => `${count} Schemes Available`,
    searchPlaceholder: 'Search scheme name, benefit, or keyword...',
    allCategories: 'All Scheme Categories',
    directDbt: 'Direct Income Support & DBT',
    cropInsurance: 'Crop Insurance & Risk Cover',
    machinery: 'Machinery & Solar Infrastructure',
    irrigation: 'Irrigation & Water Conservation',
    seedsFertilizer: 'Seeds & Fertilizers',
    allLandSizes: 'All Land Sizes',
    smallholderFilter: 'Smallholder (< 2 Acres)',
    commercialFilter: 'Commercial (≥ 2 Acres)',
    sponsorLabel: 'Sponsor:',
    eligibilityLabel: 'Eligibility:',
    checklistTitle: 'Farmer Document Checklist & Step-by-Step Application Guide',
    step1Title: 'Get FRUITS FID Number',
    step1Desc: 'Register on the Karnataka FRUITS portal or visit your local Raitha Samparka Kendra (RSK) with your Aadhaar and RTC to generate your unique FID.',
    step2Title: 'Seed Bank Account',
    step2Desc: 'Ensure your bank savings account is active and seeded with your Aadhaar for Direct Benefit Transfer (DBT) subsidies without delay.',
    step3Title: 'Submit Scheme Application',
    step3Desc: 'Click the direct "Apply Online" buttons above, enter your FID/Aadhaar, select your crop season, and submit the subsidy form.',
    step4Title: 'Field Verification & DBT',
    step4Desc: 'Village Agriculture Officer (VAO) verifies crop standing on e-Kshana/crop survey app. Funds are credited directly to your bank!',
    mandatoryDocs: 'Mandatory Documents Checklist:',
    aadhaarDoc: 'Aadhaar Card of Applicant',
    rtcDoc: 'Updated RTC / Pahani Extract',
    bankDoc: 'Bank Passbook / Cancelled Cheque',
    fruitsDoc: 'FRUITS FID or JanSamarth Login',
    fruitsPortal: 'Karnataka FRUITS Portal',
    pmKisanPortal: 'PM-KISAN National Portal',
    janSamarthPortal: 'JanSamarth Credit Portal',
    backToForm: '← Back to Farm Form',
    viewReport: 'View Full Advisory Report →'
  },
  kn: {
    officialGovPortal: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮತ್ತು ಹಣಕಾಸು ಪೋರ್ಟಲ್',
    govHeading: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸೂಕ್ತ ಆರ್ಥಿಕ ಮಾರ್ಗದರ್ಶನ',
    govSubheading: (dist) => `${dist} ನಲ್ಲಿ ನಿಮ್ಮ ಜಮೀನಿನ ಹಿಡುವಳಿಗೆ ಅನುಗುಣವಾದ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು, ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT), ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಾಲಗಳನ್ನು ಪಡೆಯಿರಿ.`,
    activeFilter: 'ಸಕ್ರಿಯ ಭೂ ಹಿಡುವಳಿ ಫಿಲ್ಟರ್',
    smallholderScale: 'ಸಣ್ಣ ಹಿಡುವಳಿದಾರ (< 2 ಎಕರೆ)',
    commercialScale: 'ವಾಣಿಜ್ಯ ಪ್ರಮಾಣ (≥ 2 ಎಕರೆ)',
    acresUnit: 'ಎಕರೆ',
    tailoredLoanRec: 'ಸೂಕ್ತ ಕೃಷಿ ಸಾಲ ಶಿಫಾರಸು',
    subsidizedInterest: 'ಸಬ್ಸಿಡಿ ಬಡ್ಡಿ ದರ',
    promptRepayment: 'ಶೇ. 3 ಸಕಾಲಿಕ ಮರುಪಾವತಿ ರಿಯಾಯಿತಿಯೊಂದಿಗೆ',
    maxCreditLimit: 'ಗರಿಷ್ಠ ಸಾಲದ ಮಿತಿ',
    collateralFree: '₹1.6 ಲಕ್ಷದವರೆಗೆ ಭದ್ರತೆ ರಹಿತ ಸಾಲ',
    scaleBasedFinance: 'ಹಿಡುವಳಿ ಆಧಾರಿತ ಯೋಜನಾ ಸಾಲ',
    repaymentTenure: 'ಮರುಪಾವತಿ ಅವಧಿ',
    flexibleHarvest: 'ಬೆಳೆ ಕಟಾವಿನ ನಂತರ ಅನುಕೂಲಕರ ಮರುಪಾವತಿ',
    officialPortal: 'ಅಧಿಕೃತ ಅರ್ಜಿ ಪೋರ್ಟಲ್',
    applyOnline: 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    keyEligibility: 'ಪ್ರಮುಖ ಅರ್ಹತಾ ಷರತ್ತುಗಳು',
    altLoans: 'ಪರ್ಯಾಯ ಹಾಗೂ ಪೂರಕ ಸಾಲ ಆಯ್ಕೆಗಳು',
    calcTitle: 'ಕೃಷಿ ಸಾಲ ಮತ್ತು ಬಡ್ಡಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    calcSubtitle: 'ರೈತರಿಗೆ ಸರ್ಕಾರದ ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ ಉಳಿತಾಯವನ್ನು ಲೆಕ್ಕಹಾಕುತ್ತದೆ',
    loanAmount: 'ಸಾಲದ ಮೊತ್ತ',
    tenureLabel: 'ಮರುಪಾವತಿ ಅವಧಿ (ತಿಂಗಳು)',
    months: 'ತಿಂಗಳುಗಳು',
    years: 'ವರ್ಷಗಳು',
    schemeInterestRate: 'ಸಾಲ ಯೋಜನೆಯ ಬಡ್ಡಿ ದರ',
    kccRateLabel: 'ಶೇ. 4.0 (ಕೆಸಿಸಿ ಸಕಾಲಿಕ ಮರುಪಾವತಿ)',
    kccRateDesc: 'ಶೇ. 7 ಮೂಲ ದರದಲ್ಲಿ ಶೇ. 3 ಸಬ್ಸಿಡಿ ರಿಯಾಯಿತಿ',
    commRateLabel: 'ಶೇ. 8.5 (ವಾಣಿಜ್ಯ ಕೃಷಿ ಸಾಲ)',
    commRateDesc: 'ನಬಾರ್ಡ್ ಮತ್ತು ವಾಣಿಜ್ಯ ಬ್ಯಾಂಕ್‌ಗಳ ಪ್ರಮಾಣಿತ ದರ',
    repaymentBreakdown: 'ಮರುಪಾವತಿ ವಿವರ',
    estEmi: 'ಅಂದಾಜು ಮಾಸಿಕ ಕಂತು (ಇಎಂಐ)',
    perMonth: ' /ತಿಂಗಳಿಗೆ',
    principalLoan: 'ಅಸಲು ಸಾಲ ಮೊತ್ತ:',
    totalInterest: 'ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಬಡ್ಡಿ:',
    totalRepayment: 'ಒಟ್ಟು ಮರುಪಾವತಿ ಮೊತ್ತ:',
    subventionSavings: 'ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ ಉಳಿತಾಯ',
    saveApprox: (saved) => `ಸರ್ಕಾರದ ಶೇ. 3 ಸಕಾಲಿಕ ಮರುಪಾವತಿ ರಿಯಾಯಿತಿಯಿಂದ ನೀವು ಅಂದಾಜು ₹${saved.toLocaleString()} ಬಡ್ಡಿ ಉಳಿಸುತ್ತೀರಿ!`,
    schemesDirectory: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳ ಕೈಪಿಡಿ',
    schemesFor: (crop, dist) => `${dist} ನಲ್ಲಿ ${crop} ಬೆಳೆಗಾಗಿ ಅಧಿಕೃತ ಕೃಷಿ ಯೋಜನೆಗಳು.`,
    schemesAvailable: (count) => `${count} ಯೋಜನೆಗಳು ಲಭ್ಯವಿದೆ`,
    searchPlaceholder: 'ಯೋಜನೆಯ ಹೆಸರು, ಸಬ್ಸಿಡಿ ಅಥವಾ ಕೀವರ್ಡ್ ಹುಡುಕಿ...',
    allCategories: 'ಎಲ್ಲಾ ಯೋಜನಾ ವಿಭಾಗಗಳು',
    directDbt: 'ನೇರ ನಗದು ವರ್ಗಾವಣೆ ಮತ್ತು ಡಿಬಿಟಿ',
    cropInsurance: 'ಬೆಳೆ ವಿಮೆ ಮತ್ತು ರಕ್ಷಣೆ',
    machinery: 'ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ ಮತ್ತು ಸೋಲಾರ್',
    irrigation: 'ನೀರಾವರಿ ಮತ್ತು ಜಲ ಸಂರಕ್ಷಣೆ',
    seedsFertilizer: 'ಬೀಜ ಮತ್ತು ರಸಗೊಬ್ಬರ',
    allLandSizes: 'ಎಲ್ಲಾ ಭೂ ಹಿಡುವಳಿಗಳು',
    smallholderFilter: 'ಸಣ್ಣ ಹಿಡುವಳಿದಾರರು (< 2 ಎಕರೆ)',
    commercialFilter: 'ವಾಣಿಜ್ಯ ಹಿಡುವಳಿದಾರರು (≥ 2 ಎಕರೆ)',
    sponsorLabel: 'ಪ್ರಾಯೋಜಕರು:',
    eligibilityLabel: 'ಅರ್ಹತೆ:',
    checklistTitle: 'ರೈತರ ದಾಖಲೆಗಳ ಪಟ್ಟಿ ಮತ್ತು ಹಂತ-ಹಂತದ ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶಿ',
    step1Title: 'ಫ್ರೂಟ್ಸ್ ಎಫ್‌ಐಡಿ ಸಂಖ್ಯೆ ಪಡೆಯಿರಿ',
    step1Desc: 'ಕರ್ನಾಟಕ ಫ್ರೂಟ್ಸ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಆಧಾರ್ ಮತ್ತು ಪಹಣಿ (RTC) ಯೊಂದಿಗೆ ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಎಫ್‌ಐಡಿ ಪಡೆಯಿರಿ.',
    step2Title: 'ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಜೋಡಿಸಿ',
    step2Desc: 'ನೇರ ನಗದು ಸಬ್ಸಿಡಿ (DBT) ತಕ್ಷಣ ಜಮೆಯಾಗಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಲಿಂಕ್ ಆಗಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    step3Title: 'ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    step3Desc: 'ಮೇಲಿನ "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ, ನಿಮ್ಮ ಎಫ್‌ಐಡಿ ನಮೂದಿಸಿ ಮತ್ತು ಸಬ್ಸಿಡಿ ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿ.',
    step4Title: 'ಜಮೀನು ಪರಿಶೀಲನೆ ಮತ್ತು ಡಿಬಿಟಿ',
    step4Desc: 'ಗ್ರಾಮ ಕೃಷಿ ಅಧಿಕಾರಿಗಳು ಬೆಳೆ ಸಮೀಕ್ಷೆ ನಡೆಸಿದ ನಂತರ ಸಬ್ಸಿಡಿ ಹಣ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ!',
    mandatoryDocs: 'ಕಡ್ಡಾಯ ದಾಖಲೆಗಳ ಪಟ್ಟಿ:',
    aadhaarDoc: 'ಅರ್ಜಿದಾರರ ಆಧಾರ್ ಕಾರ್ಡ್',
    rtcDoc: 'ಇತ್ತೀಚಿನ ಪಹಣಿ (RTC) ಪ್ರತಿ',
    bankDoc: 'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ / ರದ್ದಾದ ಚೆಕ್',
    fruitsDoc: 'ಫ್ರೂಟ್ಸ್ ಎಫ್‌ಐಡಿ ಅಥವಾ ಜನಸಮರ್ಥ್ ಲಾಗಿನ್',
    fruitsPortal: 'ಕರ್ನಾಟಕ ಫ್ರೂಟ್ಸ್ ಪೋರ್ಟಲ್',
    pmKisanPortal: 'ಪಿಎಂ-ಕಿಸಾನ್ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್',
    janSamarthPortal: 'ಜನಸಮರ್ಥ್ ಸಾಲ ಪೋರ್ಟಲ್',
    backToForm: '← ಫಾರ್ಮ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    viewReport: 'ಸಲಹಾ ವರದಿ ವೀಕ್ಷಿಸಿ →'
  },
  te: {
    officialGovPortal: 'అధికారిక ప్రభుత్వ & ఆర్థిక పోర్టల్',
    govHeading: 'ప్రభుత్వ విధానాలు & అనుకూల ఆర్థిక మార్గదర్శకత్వం',
    govSubheading: (dist) => `${dist} లో మీ భూమి పరిమాణానికి తగిన ప్రభుత్వ రాయితీలు, ప్రత్యక్ష నగదు బదిలీ (DBT), పంట బీమా మరియు బ్యాంకు రుణాలను పొందండి.`,
    activeFilter: 'ప్రస్తుత భూమి ఫిల్టర్',
    smallholderScale: 'చిన్న రైతు (< 2 ఎకరాలు)',
    commercialScale: 'వాణిజ్య స్థాయి (≥ 2 ఎకరాలు)',
    acresUnit: 'ఎకరాలు',
    tailoredLoanRec: 'అనుకూలమైన బ్యాంకు రుణ సిఫార్సు',
    subsidizedInterest: 'రాయితీ వడ్డీ రేటు',
    promptRepayment: '3% సకాలంలో చెల్లింపు రాయితీతో',
    maxCreditLimit: 'గరిష్ట రుణ పరిమితి',
    collateralFree: '₹1.6 లక్షల వరకు పూచీకత్తు లేని రుణం',
    scaleBasedFinance: 'ప్రాజెక్ట్ ఆధారిత రుణ సదుపాయం',
    repaymentTenure: 'చెల్లింపు కాలపరిమితి',
    flexibleHarvest: 'పంట కోత తర్వాత సులభమైన చెల్లింపు',
    officialPortal: 'అధికారిక దరఖాస్తు పోర్టల్',
    applyOnline: 'ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి',
    keyEligibility: 'ముఖ్యమైన అర్హత నిబంధనలు',
    altLoans: 'ప్రత్యామ్నాయ & అనుబంధ రుణ ఎంపికలు',
    calcTitle: 'వ్యవసాయ రుణం & వడ్డీ కాలిక్యులేటర్',
    calcSubtitle: 'రైతులకు వడ్డీ రాయితీ తగ్గింపును లెక్కిస్తుంది',
    loanAmount: 'రుణ మొత్తం',
    tenureLabel: 'చెల్లింపు కాలపరిమితి (నెలలు)',
    months: 'నెలలు',
    years: 'సంవత్సరాలు',
    schemeInterestRate: 'రుణ పథకం వడ్డీ రేటు',
    kccRateLabel: '4.0% వార్షికం (కేసీసీ సకాలంలో చెల్లింపు)',
    kccRateDesc: '7% ప్రాథమిక రేటు మరియు 3% సబ్సిడీ తగ్గింపు',
    commRateLabel: '8.5% వార్షికం (వాణిజ్య కాలపరిమితి రుణం)',
    commRateDesc: 'నాబార్డ్ మరియు వాణిజ్య బ్యాంకుల ప్రామాణిక రేటు',
    repaymentBreakdown: 'చెల్లింపు వివరాలు',
    estEmi: 'అంచనా వేసిన నెలవారీ వాయిదా (EMI)',
    perMonth: ' /నెలకు',
    principalLoan: 'అసలు రుణ మొత్తం:',
    totalInterest: 'మొత్తం చెల్లించాల్సిన వడ్డీ:',
    totalRepayment: 'మొత్తం చెల్లింపు మొత్తం:',
    subventionSavings: 'వడ్డీ రాయితీ ఆదా',
    saveApprox: (saved) => `ప్రభుత్వ 3% సకాల చెల్లింపు ప్రోత్సాహకంతో మీరు సుమారు ₹${saved.toLocaleString()} వడ్డీని ఆదా చేస్తారు!`,
    schemesDirectory: 'ప్రభుత్వ పథకాలు & రాయితీల డైరెక్టరీ',
    schemesFor: (crop, dist) => `${dist} లో ${crop} కోసం అధికారిక సంక్షేమ పథకాలు.`,
    schemesAvailable: (count) => `${count} పథకాలు అందుబాటులో ఉన్నాయి`,
    searchPlaceholder: 'పథకం పేరు, ప్రయోజనం లేదా కీవర్డ్ వెతకండి...',
    allCategories: 'అన్ని పథకాల వర్గాలు',
    directDbt: 'ప్రత్యక్ష ఆదాయ మద్దతు & DBT',
    cropInsurance: 'పంట బీమా & రక్షణ',
    machinery: 'యంత్రాలు & సౌర మౌలిక సదుపాయాలు',
    irrigation: 'సాగునీరు & నీటి సంరక్షణ',
    seedsFertilizer: 'విత్తనాలు & ఎరువులు',
    allLandSizes: 'అన్ని భూమి పరిమాణాలు',
    smallholderFilter: 'చిన్న రైతులు (< 2 ఎకరాలు)',
    commercialFilter: 'వాణిజ్య రైతులు (≥ 2 ఎకరాలు)',
    sponsorLabel: 'స్పాన్సర్:',
    eligibilityLabel: 'అర్హత:',
    checklistTitle: 'రైతు పత్రాల జాబితా & దశలవారీ దరఖాస్తు గైడ్',
    step1Title: 'ఫ్రూట్స్ ఎఫ్ఐడీ నంబర్ పొందండి',
    step1Desc: 'కర్ణాటక ఫ్రూట్స్ పోర్టల్‌లో నమోదు చేసుకోండి లేదా మీ ఆధార్ మరియు ఆర్టీసీతో స్థానిక రైతు సంపర్క కేంద్రాన్ని సందర్శించి ఎఫ్ఐడీ పొందండి.',
    step2Title: 'బ్యాంకు ఖాతాకు ఆధార్ లింక్ చేయండి',
    step2Desc: 'సబ్సిడీ నిధులు నేరుగా జమ కావడానికి మీ బ్యాంకు ఖాతా ఆధార్‌తో అనుసంధానించబడి ఉందని నిర్ధారించుకోండి.',
    step3Title: 'పథకానికి దరఖాస్తు చేసుకోండి',
    step3Desc: 'పైనున్న "ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి" బటన్‌ను క్లిక్ చేసి, మీ ఎఫ్ఐడీని నమోదు చేసి దరఖాస్తు సమర్పించండి.',
    step4Title: 'క్షేత్ర స్థాయి ధృవీకరణ & డీబీటీ',
    step4Desc: 'గ్రామ వ్యవసాయ అధికారి పంట సర్వేను ధృవీకరించిన తర్వాత సబ్సిడీ నిధులు నేరుగా మీ బ్యాంకు ఖాతాకు బదిలీ చేయబడతాయి!',
    mandatoryDocs: 'తప్పనిసరి పత్రాల జాబితా:',
    aadhaarDoc: 'దరఖాస్తుదారు ఆధార్ కార్డు',
    rtcDoc: 'తాజా పట్టాదారు పాస్‌బుక్ / అడంగల్',
    bankDoc: 'బ్యాంకు పాస్‌బుక్ / రద్దయిన చెక్కు',
    fruitsDoc: 'ఫ్రూట్స్ ఎఫ్ఐడీ లేదా జన్ సమర్థ్ లాగిన్',
    fruitsPortal: 'కర్ణాటక ఫ్రూట్స్ పోర్టల్',
    pmKisanPortal: 'పీఎం-కిసాన్ జాతీయ పోర్టల్',
    janSamarthPortal: 'జన్ సమర్థ్ రుణ పోర్టల్',
    backToForm: '← ఫారమ్‌కు తిరిగి వెళ్లండి',
    viewReport: 'పూర్తి నివేదిక చూడండి →'
  },
  hi: {
    officialGovPortal: 'आधिकारिक सरकारी एवं वित्तीय पोर्टल',
    govHeading: 'सरकारी नीतियां एवं अनुकूलित वित्तीय मार्गदर्शन',
    govSubheading: (dist) => `${dist} में अपनी भूमि जोत के अनुसार आधिकारिक सरकारी सब्सिडी, प्रत्यक्ष लाभ अंतरण (DBT), फसल बीमा और कृषि बैंक ऋण प्राप्त करें।`,
    activeFilter: 'सक्रिय भूमि जोत फ़िल्टर',
    smallholderScale: 'लघु किसान (< 2 एकड़)',
    commercialScale: 'व्यावसायिक स्तर (≥ 2 एकड़)',
    acresUnit: 'एकड़',
    tailoredLoanRec: 'अनुकूलित बैंक ऋण सिफारिश',
    subsidizedInterest: 'रियायती ब्याज दर',
    promptRepayment: '3% समय पर भुगतान छूट के साथ',
    maxCreditLimit: 'अधिकतम ऋण सीमा',
    collateralFree: '₹1.6 लाख तक बिना बंधक ऋण',
    scaleBasedFinance: 'परियोजना आधारित वित्तपोषण',
    repaymentTenure: 'पुनर्भुगतान अवधि',
    flexibleHarvest: 'फसल कटाई के बाद सुविधाजनक भुगतान',
    officialPortal: 'आधिकारिक आवेदन पोर्टल',
    applyOnline: 'ऑनलाइन आवेदन करें',
    keyEligibility: 'प्रमुख पात्रता शर्तें',
    altLoans: 'अन्य कृषि ऋण विकल्प',
    calcTitle: 'इंटरएक्टिव कृषि ऋण एवं ब्याज कैलकुलेटर',
    calcSubtitle: 'किसानों के लिए ब्याज अनुदान छूट की गणना करता है',
    loanAmount: 'ऋण राशि',
    tenureLabel: 'पुनर्भुगतान अवधि (माह)',
    months: 'महीने',
    years: 'वर्ष',
    schemeInterestRate: 'ऋण योजना ब्याज दर',
    kccRateLabel: '4.0% वार्षिक (केसीसी समय पर भुगतान)',
    kccRateDesc: '7% आधार दर में 3% समय पर भुगतान छूट',
    commRateLabel: '8.5% वार्षिक (व्यावसायिक सावधि ऋण)',
    commRateDesc: 'नाबार्ड एवं वाणिज्यिक बैंकों की मानक दर',
    repaymentBreakdown: 'पुनर्भुगतान विवरण',
    estEmi: 'अनुमानित मासिक किस्त (ईएमआई)',
    perMonth: ' /माह',
    principalLoan: 'मूल ऋण राशि:',
    totalInterest: 'कुल देय ब्याज:',
    totalRepayment: 'कुल पुनर्भुगतान राशि:',
    subventionSavings: 'ब्याज अनुदान बचत',
    saveApprox: (saved) => `सरकार के 3% त्वरित पुनर्भुगतान प्रोत्साहन से आप लगभग ₹${saved.toLocaleString()} का ब्याज बचाते हैं!`,
    schemesDirectory: 'सरकारी नीतियां एवं सब्सिडी निर्देशिका',
    schemesFor: (crop, dist) => `${dist} में ${crop} के लिए आधिकारिक कल्याणकारी योजनाएं।`,
    schemesAvailable: (count) => `${count} योजनाएं उपलब्ध`,
    searchPlaceholder: 'योजना का नाम, लाभ या कीवर्ड खोजें...',
    allCategories: 'सभी योजना श्रेणियां',
    directDbt: 'प्रत्यक्ष आय सहायता एवं डीबीटी',
    cropInsurance: 'फसल बीमा एवं जोखिम सुरक्षा',
    machinery: 'कृषि मशीनरी एवं सौर ऊर्जा',
    irrigation: 'सिंचाई एवं जल संरक्षण',
    seedsFertilizer: 'बीज एवं उर्वरक',
    allLandSizes: 'सभी भूमि आकार',
    smallholderFilter: 'लघु किसान (< 2 एकड़)',
    commercialFilter: 'व्यावसायिक किसान (≥ 2 एकड़)',
    sponsorLabel: 'प्रायोजक:',
    eligibilityLabel: 'पात्रता:',
    checklistTitle: 'किसान आवश्यक दस्तावेज एवं चरणबद्ध आवेदन निर्देश',
    step1Title: 'फ्रूट्स एफआईडी नंबर प्राप्त करें',
    step1Desc: 'कर्नाटक फ्रूट्स पोर्टल पर पंजीकरण करें या अपने आधार और आरटीसी के साथ स्थानीय रायथा संपर्क केंद्र (RSK) जाकर एफआईडी प्राप्त करें।',
    step2Title: 'बैंक खाते को आधार से लिंक करें',
    step2Desc: 'सब्सिडी सीधे खाते में पाने के लिए सुनिश्चित करें कि आपका बैंक बचत खाता आधार से जुड़ा हुआ है।',
    step3Title: 'योजना के लिए आवेदन करें',
    step3Desc: 'ऊपर दिए गए "ऑनलाइन आवेदन करें" बटन पर क्लिक करें, अपना एफआईडी दर्ज करें और सब्सिडी फॉर्म जमा करें।',
    step4Title: 'सत्यापन एवं खाते में भुगतान',
    step4Desc: 'ग्राम कृषि अधिकारी द्वारा फसल सर्वेक्षण सत्यापन के बाद राशि सीधे आपके खाते में जमा कर दी जाएगी!',
    mandatoryDocs: 'अनिवार्य दस्तावेजों की सूची:',
    aadhaarDoc: 'आवेदक का आधार कार्ड',
    rtcDoc: 'अद्यतन आरटीसी / खतौनी प्रति',
    bankDoc: 'बैंक पासबुक / रद्द चेक',
    fruitsDoc: 'फ्रूट्स एफआईडी अथवा जनसमर्थ लॉगिन',
    fruitsPortal: 'कर्नाटक फ्रूट्स पोर्टल',
    pmKisanPortal: 'पीएम-किसान राष्ट्रीय पोर्टल',
    janSamarthPortal: 'जनसमर्थ ऋण पोर्टल',
    backToForm: '← फॉर्म पर वापस जाएं',
    viewReport: 'सलाह रिपोर्ट देखें →'
  }
};

export default function GovernanceAndFinanceTab({
  defaultLandSize = 3.5,
  defaultDistrict = 'Davanagere',
  defaultCrop = 'Maize / Corn',
  farmerName = '',
  onNavigateToForm,
  onNavigateToReport,
  language = 'en'
}) {
  const t = GOV_I18N[language] || GOV_I18N.en;
  const translatedDistrict = getTranslatedDistrict(defaultDistrict, language);
  const translatedCrop = getTranslatedCropName(defaultCrop, language);
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
                {t.officialGovPortal}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.govHeading}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.govSubheading(translatedDistrict)}
            </p>
          </div>

          {/* Active Profile Pill Card */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-emerald-500/30 shrink-0 text-left sm:text-right space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">{t.activeFilter}</div>
            <div className="text-lg font-black text-white flex sm:justify-end items-center gap-2">
              <span>{landSize} {t.acresUnit}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isSmallholder 
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                  : 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
              }`}>
                {isSmallholder ? t.smallholderScale : t.commercialScale}
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-medium">
              📍 {translatedDistrict} • {translatedCrop}
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
                {t.tailoredLoanRec}
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
              <div className="text-[11px] font-bold text-slate-500 uppercase">{t.subsidizedInterest}</div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {activeLoanPackage.interestRate}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.promptRepayment}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">{t.maxCreditLimit}</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {activeLoanPackage.maxLimit}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isSmallholder ? t.collateralFree : t.scaleBasedFinance}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">{t.repaymentTenure}</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {activeLoanPackage.repaymentTenure}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.flexibleHarvest}</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase">{t.officialPortal}</div>
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
                <span>{t.applyOnline}</span>
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
                <span>{t.keyEligibility}</span>
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
                <span>{t.altLoans}</span>
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
              {t.calcTitle}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {t.calcSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Loan Amount Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">{t.loanAmount}</label>
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
                <label className="text-xs font-bold text-slate-700">{t.tenureLabel}</label>
                <span className="text-sm font-black text-slate-900 font-mono">
                  {calcTenureMonths} {t.months} ({Math.round(calcTenureMonths / 12 * 10) / 10} {t.years})
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
                <span>6 {t.months}</span>
                <span>{isSmallholder ? `24 ${t.months}` : `60 ${t.months}`}</span>
              </div>
            </div>

            {/* Interest Rate Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">{t.schemeInterestRate}</label>
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
                  <div className="font-extrabold text-xs">{t.kccRateLabel}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.kccRateDesc}</div>
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
                  <div className="font-extrabold text-xs">{t.commRateLabel}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.commRateDesc}</div>
                </button>
              </div>
            </div>

          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800/60 space-y-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {t.repaymentBreakdown}
            </div>

            <div>
              <div className="text-xs text-slate-400">{t.estEmi}</div>
              <div className="text-3xl font-black text-white mt-0.5">
                ₹{loanCalculations.monthlyEmi.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal">{t.perMonth}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{t.principalLoan}</span>
                <span className="font-bold text-white">₹{calcLoanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.totalInterest}</span>
                <span className="font-bold text-emerald-300">₹{loanCalculations.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.totalRepayment}</span>
                <span className="font-bold text-white">₹{loanCalculations.totalRepayable.toLocaleString()}</span>
              </div>
            </div>

            {loanCalculations.interestSaved > 0 && (
              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/40 text-xs space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.subventionSavings}</span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-snug">
                  {t.saveApprox(loanCalculations.interestSaved)}
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
              {t.schemesDirectory}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.schemesFor(translatedCrop, translatedDistrict)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {t.schemesAvailable(filteredSchemes.length)}
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
                placeholder={t.searchPlaceholder}
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
                <option value="All">{t.allCategories}</option>
                <option value="Direct Income Support & DBT">{t.directDbt}</option>
                <option value="Crop Insurance & Risk Cover">{t.cropInsurance}</option>
                <option value="Machinery & Solar Infrastructure">{t.machinery}</option>
                <option value="Irrigation & Water Conservation">{t.irrigation}</option>
                <option value="Seeds & Fertilizers">{t.seedsFertilizer}</option>
              </select>
            </div>

            {/* Landholding Scale Filter */}
            <div>
              <select
                value={scaleFilter}
                onChange={(e) => setScaleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">{t.allLandSizes}</option>
                <option value="Smallholder">{t.smallholderFilter}</option>
                <option value="Commercial">{t.commercialFilter}</option>
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
                  <div><strong>{t.sponsorLabel}</strong> {scheme.sponsoringBody}</div>
                  <div><strong>{t.eligibilityLabel}</strong> {scheme.eligibility}</div>
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
                  <span>{t.applyOnline}</span>
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
            {t.checklistTitle}
          </h4>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              1
            </div>
            <h5 className="font-bold text-sm text-white">{t.step1Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              2
            </div>
            <h5 className="font-bold text-sm text-white">{t.step2Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              3
            </div>
            <h5 className="font-bold text-sm text-white">{t.step3Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
              4
            </div>
            <h5 className="font-bold text-sm text-white">{t.step4Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step4Desc}
            </p>
          </div>

        </div>

        {/* Required Documents List */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            {t.mandatoryDocs}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.aadhaarDoc}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.rtcDoc}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.bankDoc}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.fruitsDoc}</span>
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
              <span>{t.fruitsPortal}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://pmkisan.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
            >
              <span>{t.pmKisanPortal}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://www.jansamarth.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
            >
              <span>{t.janSamarthPortal}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToForm && (
              <button
                onClick={onNavigateToForm}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition"
              >
                {t.backToForm}
              </button>
            )}
            {onNavigateToReport && (
              <button
                onClick={onNavigateToReport}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition"
              >
                {t.viewReport}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
