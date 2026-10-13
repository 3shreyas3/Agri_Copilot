import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Truck, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Navigation, 
  RefreshCw, 
  PhoneCall, 
  FileText, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  DISTRICT_COORDINATES, 
  INTERSTATE_TERMINAL_MANDIS, 
  LIVE_COMMODITY_PRICING, 
  getInterstateRedirectionAnalysis 
} from '../data/marketRedirectionData';
import { KARNATAKA_DISTRICTS } from '../data/agriKnowledge';
import { TRANSLATIONS, getTranslatedDistrict, getTranslatedCropName } from '../translations';

const MAP_I18N = {
  en: {
    activated: 'Interstate Redirection Activated',
    regPop: 'Regional Popularity:',
    oversupplyAlert: 'Over-supply Alert',
    highSatTitle: (dist) => `High District Saturation in ${dist}: Transport Recommended!`,
    highSatDesc: (crop, price) => `Over 70% of farmers in your district are cultivating ${crop}. At harvest time, high local volume creates a market glut and drops local prices to ~₹${price}/qtl. Redirecting your harvest to deficit terminal mandis in Tamil Nadu, Maharashtra, or Telangana will protect your profit margins.`,
    topArbitrage: 'Top Arbitrage Net Profit',
    onTruckload: (gain, lot) => `+₹${gain.toLocaleString()} on ${lot} Qtl truckload`,
    balancedSupply: 'Balanced Regional Supply',
    normalSupply: 'Normal',
    steadyPriceTitle: 'Local District Mandis Offer Steady Prices',
    balancedDesc: (dist) => `Production in ${dist} is well balanced. Local mandis offer healthy absorption without steep price drops. You can still compare and transport to other states below if the net profit gain outweighs freight costs.`,
    localBenchmark: 'Local Mandi Benchmark',
    steadyAuctionRate: 'Steady Auction Rate',
    simSettings: 'Market Simulation & Real-time Settings',
    eNamFeed: 'e-NAM Feed:',
    updating: 'Updating...',
    refreshRates: 'Refresh Live Mandi Rates',
    originDistrict: 'Origin District (Farm)',
    cropCultivated: 'Crop Cultivated',
    regionalPopularityLabel: 'Regional Popularity (%)',
    highSaturation: '⚠️ High',
    normalSaturation: '✓ Normal',
    lowLabel: '20% Low',
    oversupplyLabel: '> 70% Over-supply',
    extremeLabel: '95% Extreme',
    shipmentSize: 'Shipment Size (Quintals)',
    localMandiPrice: (dist) => `Local Mandi Price (${dist})`,
    glutDepressed: '📉 Depressed by regional over-supply',
    standardAuction: '⚖️ Standard localized auction rate',
    topInterstateMandi: 'Top Interstate Mandi',
    recommended: 'Recommended',
    netArbitrageGain: 'Net Arbitrage Gain (After Freight)',
    deductingFreight: (f) => `Deducting ₹${f}/qtl diesel, toll & freight`,
    totalExtraProfit: (lot) => `Total Extra Profit (${lot} Qtl Lot)`,
    gainVsLocal: (roi, dist) => `+${roi}% gain vs selling locally in ${dist}`,
    mapTitle: 'Interstate Highway Navigation & Real-Time Mandi Map',
    mapDesc: (dist) => `Live National Highway routes from ${dist} to interstate agricultural terminal hubs. Click any route or marker to inspect details.`,
    liveGps: 'Live Agmarknet GPS',
    selectedRoute: 'Selected Highway Route',
    via: 'Via:',
    liveRate: 'Live Wholesale Rate',
    netEarnings: 'Net Extra Earnings',
    rankedTitle: (crop) => `Ranked Interstate Mandi Destinations for ${crop}`,
    sortedByProfit: 'Sorted by Highest Net Profit Gain',
    bestReturn: 'Best Net Return',
    today: 'today',
    distance: 'Highway Distance',
    transit: 'Est. Transit',
    hours: 'Hours',
    freightToll: 'Freight / Tolls',
    profitMargin: 'Net Profit Margin',
    viewOnMap: 'Viewing on Map',
    selectRoute: 'Select Route',
    guideTitle: 'Interstate Transport & Legal Compliance Guide for Farmers',
    gstTitle: 'GST e-Way Bill Exemption',
    gstDesc: 'Under GST Rule 138(14), raw agricultural produce transported by farmers is 100% exempt from GST e-Way bill. Carry your farmer ID / RTC / Pahani extract.',
    tollTitle: 'Interstate Toll & FASTag Lanes',
    tollDesc: 'Commercial transport trucks require standard commercial FASTag. Multi-axle trucks on NH 48 and NH 44 travel seamlessly without manual checkpost stops.',
    eNamLogisticsTitle: 'e-NAM Logistics Assistance',
    eNamLogisticsDesc: 'Call the official e-NAM toll-free farmer logistics helpline at 1800-270-0224 for pre-arranged return loads and truck aggregation rates.',
    officialPortals: 'Official Portals:',
    eNamPortal: 'e-NAM National Portal',
    fruitsPortal: 'Karnataka FRUITS',
    backToForm: '← Back to Farm Form',
    viewReport: 'View Full Advisory Report →'
  },
  kn: {
    activated: 'ಅಂತಾರಾಜ್ಯ ಮಾರುಕಟ್ಟೆ ಮರುನಿರ್ದೇಶನ ಸಕ್ರಿಯಗೊಂಡಿದೆ',
    regPop: 'ಪ್ರಾದೇಶಿಕ ಜನಪ್ರಿಯತೆ:',
    oversupplyAlert: 'ಅತಿಯಾದ ಪೂರೈಕೆ ಎಚ್ಚರಿಕೆ',
    highSatTitle: (dist) => `${dist} ನಲ್ಲಿ ಅತಿಯಾದ ಪೂರೈಕೆ: ಸಾಗಾಣಿಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ!`,
    highSatDesc: (crop, price) => `ನಿಮ್ಮ ಜಿಲ್ಲೆಯಲ್ಲಿ 70% ಕ್ಕೂ ಹೆಚ್ಚು ರೈತರು ${crop} ಬೆಳೆಯುತ್ತಿದ್ದಾರೆ. ಕೊಯ್ಲಿನ ಸಮಯದಲ್ಲಿ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಲೆ ಕುಸಿತ ಉಂಟಾಗಿ ~₹${price}/ಕ್ವಿಂಟಾಲ್ ಆಗಬಹುದು. ತಮಿಳುನಾಡು, ಮಹಾರಾಷ್ಟ್ರ ಅಥವಾ ತೆಲಂಗಾಣದ ಮಂಡಿಗಳಿಗೆ ಕಳುಹಿಸುವುದರಿಂದ ಉತ್ತಮ ಲಾಭ ಗಳಿಸಬಹುದು.`,
    topArbitrage: 'ಗರಿಷ್ಠ ನಿವ್ವಳ ಲಾಭ',
    onTruckload: (gain, lot) => `${lot} ಕ್ವಿಂಟಾಲ್ ಲೋಡ್‌ಗೆ +₹${gain.toLocaleString()} ಹೆಚ್ಚುವರಿ ಲಾಭ`,
    balancedSupply: 'ಸಮತೋಲಿತ ಪೂರೈಕೆ',
    normalSupply: 'ಸಾಮಾನ್ಯ',
    steadyPriceTitle: 'ಸ್ಥಳೀಯ ಮಂಡಿಗಳಲ್ಲಿ ಸ್ಥಿರ ಧಾರಣೆ ಇದೆ',
    balancedDesc: (dist) => `${dist} ನಲ್ಲಿ ಉತ್ಪಾದನೆ ಸಮತೋಲನದಲ್ಲಿದೆ. ಸ್ಥಳೀಯ ಮಂಡಿಗಳಲ್ಲಿ ಬೆಲೆ ಕುಸಿತವಿಲ್ಲ. ನಿವ್ವಳ ಲಾಭ ಸಾರಿಗೆ ವೆಚ್ಚಕ್ಕಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ಅಂತಾರಾಜ್ಯ ಮಾರಾಟ ಮಾಡಬಹುದು.`,
    localBenchmark: 'ಸ್ಥಳೀಯ ಮಂಡಿ ದರ',
    steadyAuctionRate: 'ಸ್ಥಿರ ಹರಾಜು ದರ',
    simSettings: 'ಮಾರುಕಟ್ಟೆ ಸಿಮ್ಯುಲೇಶನ್ ಮತ್ತು ನೈಜ ಸಮಯದ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    eNamFeed: 'ಇ-ನ್ಯಾಮ್ ಮಾಹಿತಿ:',
    updating: 'ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...',
    refreshRates: 'ಲೈವ್ ಮಂಡಿ ದರಗಳನ್ನು ನವೀಕರಿಸಿ',
    originDistrict: 'ಮೂಲ ಜಿಲ್ಲೆ (ಜಮೀನು)',
    cropCultivated: 'ಬೆಳೆದ ಬೆಳೆ',
    regionalPopularityLabel: 'ಪ್ರಾದೇಶಿಕ ಜನಪ್ರಿಯತೆ (%)',
    highSaturation: '⚠️ ಅಧಿಕ',
    normalSaturation: '✓ ಸಾಮಾನ್ಯ',
    lowLabel: '20% ಕಡಿಮೆ',
    oversupplyLabel: '> 70% ಅತಿಯಾದ ಪೂರೈಕೆ',
    extremeLabel: '95% ತೀವ್ರ',
    shipmentSize: 'ಸಾಗಣೆ ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್‌ಗಳು)',
    localMandiPrice: (dist) => `ಸ್ಥಳೀಯ ಮಂಡಿ ಬೆಲೆ (${dist})`,
    glutDepressed: '📉 ಅತಿಯಾದ ಪೂರೈಕೆಯಿಂದಾಗಿ ಬೆಲೆ ಇಳಿಕೆ',
    standardAuction: '⚖️ ಪ್ರಮಾಣಿತ ಸ್ಥಳೀಯ ಹರಾಜು ದರ',
    topInterstateMandi: 'ಪ್ರಮುಖ ಅಂತಾರಾಜ್ಯ ಮಂಡಿ',
    recommended: 'ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
    netArbitrageGain: 'ಸಾರಿಗೆ ನಂತರದ ನಿವ್ವಳ ಲಾಭ',
    deductingFreight: (f) => `ಡೀಸೆಲ್, ಟೋಲ್ ಮತ್ತು ಸಾರಿಗೆ ವೆಚ್ಚ ₹${f}/ಕ್ವಿಂಟಾಲ್ ಕಡಿತಗೊಳಿಸಿ`,
    totalExtraProfit: (lot) => `ಒಟ್ಟು ಹೆಚ್ಚುವರಿ ಲಾಭ (${lot} ಕ್ವಿಂಟಾಲ್)`,
    gainVsLocal: (roi, dist) => `${dist} ಸ್ಥಳೀಯ ಮಾರಾಟಕ್ಕಿಂತ +${roi}% ಅಧಿಕ ಲಾಭ`,
    mapTitle: 'ಅಂತಾರಾಜ್ಯ ಹೆದ್ದಾರಿ ಸಂಚಾರ ಮತ್ತು ಲೈವ್ ಮಂಡಿ ನಕ್ಷೆ',
    mapDesc: (dist) => `${dist} ನಿಂದ ನೆರೆಯ ರಾಜ್ಯಗಳ ಮಂಡಿಗಳಿಗೆ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಮಾರ್ಗಗಳು. ವಿವರಗಳಿಗಾಗಿ ಮಾರ್ಗವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.`,
    liveGps: 'ಲೈವ್ ಅಗ್ರೋ-ಮಾರ್ಕೆಟ್ ಜಿಪಿಎಸ್',
    selectedRoute: 'ಆಯ್ಕೆಮಾಡಿದ ಹೆದ್ದಾರಿ ಮಾರ್ಗ',
    via: 'ಮೂಲಕ:',
    liveRate: 'ಲೈವ್ ಸಗಟು ದರ',
    netEarnings: 'ನಿವ್ವಳ ಹೆಚ್ಚುವರಿ ಆದಾಯ',
    rankedTitle: (crop) => `${crop} ಗಾಗಿ ಪ್ರಮುಖ ಅಂತಾರಾಜ್ಯ ಮಂಡಿಗಳು`,
    sortedByProfit: 'ಹೆಚ್ಚಿನ ನಿವ್ವಳ ಲಾಭದ ಆಧಾರದ ಮೇಲೆ ಜೋಡಿಸಲಾಗಿದೆ',
    bestReturn: 'ಉತ್ತಮ ನಿವ್ವಳ ಆದಾಯ',
    today: 'ಇಂದು',
    distance: 'ಹೆದ್ದಾರಿ ದೂರ',
    transit: 'ಅಂದಾಜು ಸಮಯ',
    hours: 'ಗಂಟೆಗಳು',
    freightToll: 'ಸಾರಿಗೆ ಮತ್ತು ಟೋಲ್ ವೆಚ್ಚ',
    profitMargin: 'ನಿವ್ವಳ ಲಾಭದ ಪ್ರಮಾಣ',
    viewOnMap: 'ನಕ್ಷೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ',
    selectRoute: 'ಮಾರ್ಗ ಆಯ್ಕೆಮಾಡಿ',
    guideTitle: 'ಅಂತಾರಾಜ್ಯ ಸಾರಿಗೆ ಮತ್ತು ಕಾನೂನು ನಿಯಮಾವಳಿಗಳ ಮಾರ್ಗದರ್ಶಿ',
    gstTitle: 'ಜಿಎಸ್‌ಟಿ ಇ-ವೇ ಬಿಲ್ ವಿನಾಯಿತಿ',
    gstDesc: 'ಜಿಎಸ್‌ಟಿ ನಿಯಮ 138(14) ರ ಪ್ರಕಾರ ರೈತರು ಸಾಗಿಸುವ ಕಚ್ಚಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳಿಗೆ ಇ-ವೇ ಬಿಲ್‌ನಿಂದ 100% ವಿನಾಯಿತಿ ಇದೆ. ರೈತರ ಗುರುತಿನ ಚೀಟಿ / ಪಹಣಿ (RTC) ಜೊತೆಯಲ್ಲಿರಲಿ.',
    tollTitle: 'ಅಂತಾರಾಜ್ಯ ಟೋಲ್ ಮತ್ತು ಫಾಸ್ಟ್ಯಾಗ್ ಮಾರ್ಗಗಳು',
    tollDesc: 'ವಾಣಿಜ್ಯ ಸಾರಿಗೆ ಲಾರಿಗಳಿಗೆ ಸಾಮಾನ್ಯ ಫಾಸ್ಟ್ಯಾಗ್ ಕಡ್ಡಾಯವಾಗಿದೆ. ಎನ್‌ಎಚ್ 48 ಮತ್ತು ಎನ್‌ಎಚ್ 44 ಹೆದ್ದಾರಿಗಳಲ್ಲಿ ನೇರ ಸಂಚಾರ ಸಾಧ್ಯ.',
    eNamLogisticsTitle: 'ಇ-ನ್ಯಾಮ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಸಹಾಯವಾಣಿ',
    eNamLogisticsDesc: 'ವಾಪಸ್ ಬರುವ ವಾಹನಗಳ ಬಾಡಿಗೆ ಹಾಗೂ ಸಾರಿಗೆ ಸಹಾಯಕ್ಕಾಗಿ ಇ-ನ್ಯಾಮ್ ಉಚಿತ ಸಹಾಯವಾಣಿ 1800-270-0224 ಗೆ ಕರೆ ಮಾಡಿ.',
    officialPortals: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳು:',
    eNamPortal: 'ಇ-ನ್ಯಾಮ್ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್',
    fruitsPortal: 'ಕರ್ನಾಟಕ ಫ್ರೂಟ್ಸ್ ಪೋರ್ಟಲ್',
    backToForm: '← ಫಾರ್ಮ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    viewReport: 'ಸಂಪೂರ್ಣ ವರದಿ ವೀಕ್ಷಿಸಿ →'
  },
  te: {
    activated: 'అంతర్రాష్ట్ర మార్కెట్ దారిమార్పు సక్రియం చేయబడింది',
    regPop: 'ప్రాంతీయ ప్రాధాన్యత:',
    oversupplyAlert: 'అధిక సరఫరా హెచ్చరిక',
    highSatTitle: (dist) => `${dist} లో అధిక సరఫరా: రవాణా సిఫార్సు చేయబడింది!`,
    highSatDesc: (crop, price) => `మీ జిల్లాలో 70% కంటే ఎక్కువ మంది రైతులు ${crop} సాగు చేస్తున్నారు. కోత సమయంలో మార్కెట్లో అధిక సరుకు వచ్చి స్థానిక ధర ~₹${price}/క్వింటాల్‌కు పడిపోవచ్చు. తమిళనాడు, మహారాష్ట్ర లేదా తెలంగాణ మార్కెట్లకు తరలించడం ద్వారా అధిక లాభం పొందవచ్చు.`,
    topArbitrage: 'గరిష్ట నికర లాభం',
    onTruckload: (gain, lot) => `${lot} క్వింటాళ్ల లోడ్‌పై +₹${gain.toLocaleString()} అదనపు లాభం`,
    balancedSupply: 'సమతుల్య సరఫరా',
    normalSupply: 'సాధారణం',
    steadyPriceTitle: 'స్థానిక మార్కెట్లలో స్థిరమైన ధరలు ఉన్నాయి',
    balancedDesc: (dist) => `${dist} లో ఉత్పత్తి సమతుల్యంగా ఉంది. స్థానిక మార్కెట్లలో ధరల తగ్గుదల లేదు. రవాణా ఖర్చుల కంటే నికర లాభం ఎక్కువగా ఉంటే ఇతర రాష్ట్రాలకు తరలించవచ్చు.`,
    localBenchmark: 'స్థానిక మార్కెట్ ధర',
    steadyAuctionRate: 'స్థిరమైన వేలం ధర',
    simSettings: 'మార్కెట్ అనుకరణ & రియల్-టైమ్ సెట్టింగ్‌లు',
    eNamFeed: 'ఈ-నామ్ సమాచారం:',
    updating: 'నవీకరిస్తోంది...',
    refreshRates: 'లైవ్ మార్కెట్ ధరలను రీఫ్రెష్ చేయండి',
    originDistrict: 'మూల జిల్లా (పొలం)',
    cropCultivated: 'సాగు చేసిన పంట',
    regionalPopularityLabel: 'ప్రాంతీయ ప్రాధాన్యత (%)',
    highSaturation: '⚠️ అధికం',
    normalSaturation: '✓ సాధారణం',
    lowLabel: '20% తక్కువ',
    oversupplyLabel: '> 70% అధిక సరఫరా',
    extremeLabel: '95% గరిష్టం',
    shipmentSize: 'రవాణా పరిమాణం (క్వింటాళ్లు)',
    localMandiPrice: (dist) => `స్థానిక మార్కెట్ ధర (${dist})`,
    glutDepressed: '📉 అధిక సరఫరా వల్ల తగ్గిన ధర',
    standardAuction: '⚖️ ప్రామాణిక స్థానిక వేలం ధర',
    topInterstateMandi: 'ప్రధాన అంతర్రాష్ట్ర మార్కెట్',
    recommended: 'సిఫార్సు చేయబడింది',
    netArbitrageGain: 'రవాణా ఖర్చుల తర్వాత నికర లాభం',
    deductingFreight: (f) => `డీజిల్, టోల్ మరియు రవాణా ఖర్చు ₹${f}/క్వింటాల్ మినహాయించి`,
    totalExtraProfit: (lot) => `మొత్తం అదనపు లాభం (${lot} క్వింటాళ్లు)`,
    gainVsLocal: (roi, dist) => `${dist} స్థానిక విక్రయం కంటే +${roi}% అదనపు లాభం`,
    mapTitle: 'అంతర్రాష్ట్ర రహదారి నావిగేషన్ & లైవ్ మార్కెట్ మ్యాప్',
    mapDesc: (dist) => `${dist} నుండి ఇతర రాష్ట్రాల ప్రధాన మార్కెట్లకు జాతీయ రహదారి మార్గాలు. వివరాల కోసం మార్గాన్ని క్లిక్ చేయండి.`,
    liveGps: 'లైవ్ అగ్రి-మార్కెట్ జీపీఎస్',
    selectedRoute: 'ఎంచుకున్న రహదారి మార్గం',
    via: 'ద్వారా:',
    liveRate: 'లైవ్ హోల్‌సేల్ ధర',
    netEarnings: 'నికర అదనపు ఆదాయం',
    rankedTitle: (crop) => `${crop} కోసం ఉత్తమ అంతర్రాష్ట్ర మార్కెట్లు`,
    sortedByProfit: 'అత్యధిక నికర లాభం ఆధారంగా అమర్చబడింది',
    bestReturn: 'ఉత్తమ నికర రాబడి',
    today: 'ఈ రోజు',
    distance: 'రహదారి దూరం',
    transit: 'అంచనా సమయం',
    hours: 'గంటలు',
    freightToll: 'రవాణా & టోల్ ఖర్చు',
    profitMargin: 'నికర లాభ శాతం',
    viewOnMap: 'మ్యాప్‌లో చూస్తున్నారు',
    selectRoute: 'మార్గం ఎంచుకోండి',
    guideTitle: 'రైతుల కోసం అంతర్రాష్ట్ర రవాణా మరియు చట్టపరమైన మార్గదర్శకాలు',
    gstTitle: 'జీఎస్టీ ఈ-వే బిల్లు మినహాయింపు',
    gstDesc: 'జీఎస్టీ రూల్ 138(14) ప్రకారం రైతులు రవాణా చేసే ముడి వ్యవసాయ ఉత్పత్తులకు ఈ-వే బిల్లు నుండి 100% మినహాయింపు ఉంది. రైతు గుర్తింపు కార్డు / పట్టాదారు పాస్‌బుక్ వెంట ఉంచుకోండి.',
    tollTitle: 'అంతర్రాష్ట్ర టోల్ మరియు ఫాస్ట్‌ట్యాగ్',
    tollDesc: 'వాణిజ్య రవాణా ట్రక్కులకు సాధారణ ఫాస్ట్‌ట్యాగ్ తప్పనిసరి. ఎన్‌హెచ్ 48 మరియు ఎన్‌హెచ్ 44 మార్గాల్లో నిరంతర ప్రయాణం సాధ్యం.',
    eNamLogisticsTitle: 'ఈ-నామ్ లాజిస్టిక్స్ సహాయం',
    eNamLogisticsDesc: 'రిటర్న్ లోడ్లు మరియు సరుకు రవాణా సహాయం కోసం ఈ-నామ్ టోల్-ఫ్రీ నంబర్ 1800-270-0224 కు కాల్ చేయండి.',
    officialPortals: 'అధికారిక పోర్టల్స్:',
    eNamPortal: 'ఈ-నామ్ జాతీయ పోర్టల్',
    fruitsPortal: 'కర్ణాటక ఫ్రూట్స్ పోర్టల్',
    backToForm: '← ఫారమ్‌కు తిరిగి వెళ్లండి',
    viewReport: 'పూర్తి నివేదిక చూడండి →'
  },
  hi: {
    activated: 'अंतरराज्यीय बाजार पुनर्निर्देशन सक्रिय',
    regPop: 'क्षेत्रीय लोकप्रियता:',
    oversupplyAlert: 'अति-आपूर्ति चेतावनी',
    highSatTitle: (dist) => `${dist} में अत्यधिक आपूर्ति: अन्य राज्य में परिवहन की सिफारिश!`,
    highSatDesc: (crop, price) => `आपके जिले में 70% से अधिक किसान ${crop} की खेती कर रहे हैं। कटाई के समय भारी आवक से स्थानीय कीमतें गिरकर ~₹${price}/क्विंटल हो सकती हैं। तमिलनाडु, महाराष्ट्र या तेलंगाना की प्रमुख मंडियों में भेजने से आपको बेहतर मुनाफा मिलेगा।`,
    topArbitrage: 'शीर्ष शुद्ध मुनाफा',
    onTruckload: (gain, lot) => `${lot} क्विंटल पर +₹${gain.toLocaleString()} का अतिरिक्त लाभ`,
    balancedSupply: 'संतुलित क्षेत्रीय आपूर्ति',
    normalSupply: 'सामान्य',
    steadyPriceTitle: 'स्थानीय मंडियों में स्थिर मूल्य उपलब्ध',
    balancedDesc: (dist) => `${dist} में उत्पादन संतुलित है। स्थानीय मंडियों में कीमतों में भारी गिरावट नहीं है। यदि शुद्ध लाभ परिवहन लागत से अधिक हो तो आप अंतरराज्यीय मंडियों में माल भेज सकते हैं।`,
    localBenchmark: 'स्थानीय मंडी बेंचमार्क',
    steadyAuctionRate: 'स्थिर नीलामी दर',
    simSettings: 'बाजार सिमुलेशन और रीयल-टाइम सेटिंग्स',
    eNamFeed: 'ई-नाम अपडेट:',
    updating: 'अपडेट हो रहा है...',
    refreshRates: 'लाइव मंडी दरें रिफ्रेश करें',
    originDistrict: 'मूल जिला (खेत)',
    cropCultivated: 'बोई गई फसल',
    regionalPopularityLabel: 'क्षेत्रीय लोकप्रियता (%)',
    highSaturation: '⚠️ अत्यधिक',
    normalSaturation: '✓ सामान्य',
    lowLabel: '20% कम',
    oversupplyLabel: '> 70% अति-आपूर्ति',
    extremeLabel: '95% बहुत अधिक',
    shipmentSize: 'खेप का आकार (क्विंटल)',
    localMandiPrice: (dist) => `स्थानीय मंडी भाव (${dist})`,
    glutDepressed: '📉 अधिक आवक के कारण घटी दर',
    standardAuction: '⚖️ मानक स्थानीय नीलामी दर',
    topInterstateMandi: 'शीर्ष अंतरराज्यीय मंडी',
    recommended: 'अनुशंसित',
    netArbitrageGain: 'भाड़ा घटाने के बाद शुद्ध लाभ',
    deductingFreight: (f) => `डीजल, टोल व भाड़ा ₹${f}/क्विंटल घटाने के बाद`,
    totalExtraProfit: (lot) => `कुल अतिरिक्त लाभ (${lot} क्विंटल)`,
    gainVsLocal: (roi, dist) => `${dist} में स्थानीय बिक्री की तुलना में +${roi}% अधिक लाभ`,
    mapTitle: 'अंतरराज्यीय राजमार्ग नेविगेशन और लाइव मंडी मानचित्र',
    mapDesc: (dist) => `${dist} से प्रमुख अंतरराज्यीय कृषि मंडियों तक राष्ट्रीय राजमार्ग मार्ग। विवरण देखने के लिए किसी भी मार्ग पर क्लिक करें।`,
    liveGps: 'लाइव एगमार्कनेट जीपीएस',
    selectedRoute: 'चयनित राजमार्ग मार्ग',
    via: 'द्वारा:',
    liveRate: 'लाइव थोक दर',
    netEarnings: 'शुद्ध अतिरिक्त कमाई',
    rankedTitle: (crop) => `${crop} के लिए अनुशंसित अंतरराज्यीय मंडियां`,
    sortedByProfit: 'सर्वाधिक शुद्ध लाभ के अनुसार क्रमबद्ध',
    bestReturn: 'सर्वश्रेष्ठ शुद्ध रिटर्न',
    today: 'आज',
    distance: 'राजमार्ग दूरी',
    transit: 'अनुमानित समय',
    hours: 'घंटे',
    freightToll: 'भाड़ा और टोल खर्च',
    profitMargin: 'शुद्ध लाभ मार्जिन',
    viewOnMap: 'मानचित्र पर देखें',
    selectRoute: 'मार्ग चुनें',
    guideTitle: 'किसानों के लिए अंतरराज्यीय परिवहन और कानूनी अनुपालन निर्देश',
    gstTitle: 'जीएसटी ई-वे बिल छूट',
    gstDesc: 'जीएसटी नियम 138(14) के तहत, किसानों द्वारा ले जाए जाने वाले कच्चे कृषि उत्पादों को ई-वे बिल से 100% छूट प्राप्त है। अपना किसान पहचान पत्र / आरटीसी साथ रखें।',
    tollTitle: 'अंतरराज्यीय टोल और फास्टैग लेन',
    tollDesc: 'व्यावसायिक परिवहन ट्रकों के लिए मानक फास्टैग अनिवार्य है। एनएच 48 और एनएच 44 पर बिना किसी चेकपोस्ट रुकावट के सुगम आवागमन होता है।',
    eNamLogisticsTitle: 'ई-नाम लॉजिस्टिक्स सहायता',
    eNamLogisticsDesc: 'सस्ती परिवहन दरों और वापसी के लोड के लिए ई-नाम टोल-फ्री किसान हेल्पलाइन 1800-270-0224 पर संपर्क करें।',
    officialPortals: 'आधिकारिक पोर्टल:',
    eNamPortal: 'ई-नाम राष्ट्रीय पोर्टल',
    fruitsPortal: 'कर्नाटक फ्रूट्स पोर्टल',
    backToForm: '← फॉर्म पर वापस जाएं',
    viewReport: 'पूरी सलाह रिपोर्ट देखें →'
  }
};

export default function MarketRedirectionMap({
  defaultDistrict = 'Davanagere',
  defaultCrop = 'Maize / Corn',
  defaultPopularity = 75,
  defaultLotSize = 80,
  onNavigateToForm,
  onNavigateToReport,
  language = 'en'
}) {
  const t = MAP_I18N[language] || MAP_I18N.en;
  const translatedDistrict = getTranslatedDistrict(defaultDistrict, language);
  const translatedCrop = getTranslatedCropName(defaultCrop, language);
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
  const [regionalPopularity, setRegionalPopularity] = useState(defaultPopularity);
  const [lotSizeQuintals, setLotSizeQuintals] = useState(defaultLotSize);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [priceNoise, setPriceNoise] = useState(0);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  // Compute live analysis
  const analysis = getInterstateRedirectionAnalysis({
    originDistrict: selectedDistrict,
    cropName: selectedCrop,
    regionalPopularity,
    lotSizeQuintals
  });

  // Apply subtle simulated live price fluctuation when refreshed
  const routesWithLiveNoise = analysis.routes.map(route => {
    const livePrice = route.destinationLivePrice + priceNoise;
    const grossSpread = livePrice - analysis.effectiveLocalPrice;
    const netArbitrage = grossSpread - route.freightCostPerQtl;
    const totalGain = Math.round(netArbitrage * lotSizeQuintals);
    return {
      ...route,
      destinationLivePrice: livePrice,
      grossSpreadPerQtl: grossSpread,
      netArbitragePerQtl: netArbitrage,
      totalNetGainForLot: totalGain
    };
  });

  // Set default selected route to the highest arbitrage route
  useEffect(() => {
    if (routesWithLiveNoise.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routesWithLiveNoise[0].mandiId);
    }
  }, [routesWithLiveNoise, selectedRouteId]);

  // Handle live price refresh
  const handleRefreshPrices = () => {
    setIsLiveRefreshing(true);
    setTimeout(() => {
      // Small simulated tick +/- Rs 15
      const tick = Math.floor(Math.random() * 31) - 15;
      setPriceNoise(tick);
      setIsLiveRefreshing(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRefreshed(timeStr);
    }, 600);
  };

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [analysis.originCoords[0], analysis.originCoords[1]],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and lines
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    polylinesRef.current.forEach(l => map.removeLayer(l));
    polylinesRef.current = [];

    const originLat = analysis.originCoords[0];
    const originLng = analysis.originCoords[1];

    // 1. Add Origin Farm Marker with custom pulsating CSS DivIcon
    const originIcon = L.divIcon({
      className: 'custom-origin-pin',
      html: `
        <div style="
          background: #10b981;
          color: white;
          border-radius: 9999px;
          padding: 6px 10px;
          font-weight: 800;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6);
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        ">
          <span style="font-size: 14px;">🌾</span>
          <span>${selectedDistrict} (Farm Origin)</span>
        </div>
      `,
      iconSize: [160, 32],
      iconAnchor: [80, 16]
    });

    const originMarker = L.marker([originLat, originLng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #065f46; font-size: 13px;">📍 Origin: ${selectedDistrict}, Karnataka</strong>
          <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">
            Crop: <strong>${selectedCrop}</strong><br/>
            Regional Popularity: <strong>${regionalPopularity}%</strong> (${analysis.isGlutOver70 ? 'Over-supply Glut' : 'Normal Supply'})<br/>
            Local Mandi Price: <strong>₹${analysis.effectiveLocalPrice}/qtl</strong>
          </div>
        </div>
      `);

    markersRef.current.push(originMarker);

    // 2. Add Destination Interstate Mandis and Connect Routes
    const allBoundsCoords = [[originLat, originLng]];

    routesWithLiveNoise.forEach((route, idx) => {
      const isSelected = selectedRouteId === route.mandiId;
      const isTopRoute = idx === 0;

      allBoundsCoords.push(route.coords);

      // Destination Custom HTML Marker
      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
          <div style="
            background: ${isTopRoute ? '#047857' : isSelected ? '#1d4ed8' : '#334155'};
            color: white;
            border-radius: 12px;
            padding: 5px 9px;
            font-weight: 700;
            font-size: 11px;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 2px solid ${isTopRoute ? '#34d399' : '#ffffff'};
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="display: flex; align-items: center; gap: 3px;">
              <span>${isTopRoute ? '🏆' : '🏛'}</span>
              <span>${route.shortName}</span>
            </div>
            <div style="color: #fef08a; font-size: 10px; font-weight: 800;">
              ₹${route.destinationLivePrice}/qtl (${route.netArbitragePerQtl >= 0 ? '+' : ''}₹${route.netArbitragePerQtl} net)
            </div>
          </div>
        `,
        iconSize: [140, 42],
        iconAnchor: [70, 21]
      });

      const destMarker = L.marker(route.coords, { icon: destIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedRouteId(route.mandiId);
        })
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #1e293b; font-size: 13px;">${route.mandiName}</strong>
            <div style="font-size: 11px; color: #475569; margin-top: 5px; line-height: 1.4;">
              Highway: <strong>${route.highway}</strong><br/>
              Distance: <strong>${route.distanceKm} km (~ ${route.transitHours} hrs)</strong><br/>
              Live Mandi Rate: <strong style="color: #047857;">₹${route.destinationLivePrice}/qtl</strong> (${route.priceTrend})<br/>
              Freight Cost: <strong>₹${route.freightCostPerQtl}/qtl</strong><br/>
              <span style="color: #059669; font-weight: 800; font-size: 12px;">
                Net Profit Gain: +₹${route.netArbitragePerQtl}/qtl (+₹${route.totalNetGainForLot.toLocaleString()} total)
              </span>
            </div>
          </div>
        `);

      markersRef.current.push(destMarker);

      // Polyline route from origin to destination
      const polyline = L.polyline([[originLat, originLng], route.coords], {
        color: isTopRoute ? '#059669' : isSelected ? '#2563eb' : '#94a3b8',
        weight: isTopRoute || isSelected ? 4 : 2.5,
        opacity: isTopRoute || isSelected ? 0.9 : 0.5,
        dashArray: isTopRoute ? null : '6, 8'
      }).addTo(map);

      polyline.bindTooltip(
        `🚚 ${route.highway}: ${route.distanceKm} km • Net +₹${route.netArbitragePerQtl}/qtl`,
        { sticky: true, className: 'route-tooltip' }
      );

      polyline.on('click', () => {
        setSelectedRouteId(route.mandiId);
      });

      polylinesRef.current.push(polyline);
    });

    // Fit map bounds smoothly
    if (allBoundsCoords.length > 1) {
      map.fitBounds(allBoundsCoords, { padding: [40, 40], maxZoom: 8 });
    }

  }, [selectedDistrict, selectedCrop, regionalPopularity, priceNoise, selectedRouteId]);

  const activeRoute = routesWithLiveNoise.find(r => r.mandiId === selectedRouteId) || routesWithLiveNoise[0];

  return (
    <div className="space-y-6">

      {/* ========================================================= */}
      {/* 1. OVER-SUPPLY GLUT NOTIFICATION & TRIGGER STATUS BANNER  */}
      {/* ========================================================= */}
      {analysis.isGlutOver70 ? (
        <div className="bg-gradient-to-r from-rose-900 via-amber-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-rose-500/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/30 border border-rose-400 text-rose-300 shrink-0">
                <AlertTriangle className="w-7 h-7 animate-pulse text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                    🚨 {t.activated}
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/30">
                    {t.regPop} {regionalPopularity}% (&gt; 70% {t.oversupplyAlert})
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {t.highSatTitle(translatedDistrict)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {t.highSatDesc(translatedCrop, analysis.glutDepressedPrice)}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-rose-500/30 shrink-0 text-center md:text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.topArbitrage}</div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                +₹{routesWithLiveNoise[0]?.netArbitragePerQtl}/qtl
              </div>
              <div className="text-[11px] text-emerald-300 font-semibold">
                {t.onTruckload(routesWithLiveNoise[0]?.totalNetGainForLot || 0, lotSizeQuintals)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-500/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    {t.balancedSupply}
                  </span>
                  <span className="text-xs text-slate-300">
                    {t.regPop} {regionalPopularity}% (&le; 70% {t.normalSupply})
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {t.steadyPriceTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {t.balancedDesc(translatedDistrict)}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-emerald-500/30 text-center md:text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.localBenchmark}</div>
              <div className="text-xl font-extrabold text-white mt-0.5">₹{analysis.effectiveLocalPrice}/qtl</div>
              <div className="text-[10px] text-emerald-400">{t.steadyAuctionRate}</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. LIVE INTERACTIVE FILTER & POPULARITY SIMULATION SLIDER  */}
      {/* ========================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>{t.simSettings}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.eNamFeed} <strong className="text-slate-700">{lastRefreshed}</strong></span>
            </div>

            <button
              onClick={handleRefreshPrices}
              disabled={isLiveRefreshing}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLiveRefreshing ? 'animate-spin' : ''}`} />
              <span>{isLiveRefreshing ? t.updating : t.refreshRates}</span>
            </button>
          </div>

        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Origin District */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.originDistrict}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {KARNATAKA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{getTranslatedDistrict(d.name, language)}</option>
              ))}
            </select>
          </div>

          {/* Crop Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.cropCultivated}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {Object.keys(LIVE_COMMODITY_PRICING).map(c => (
                <option key={c} value={c}>{getTranslatedCropName(c, language)}</option>
              ))}
            </select>
          </div>

          {/* Regional Popularity % Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600">{t.regionalPopularityLabel}</label>
              <span className={`text-xs font-extrabold px-2 py-0.2 rounded ${
                regionalPopularity > 70 
                  ? 'bg-rose-100 text-rose-700 font-mono' 
                  : 'bg-emerald-100 text-emerald-800 font-mono'
              }`}>
                {regionalPopularity}% {regionalPopularity > 70 ? t.highSaturation : t.normalSaturation}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="1"
              value={regionalPopularity}
              onChange={(e) => setRegionalPopularity(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>{t.lowLabel}</span>
              <span className="font-bold text-rose-600">{t.oversupplyLabel}</span>
              <span>{t.extremeLabel}</span>
            </div>
          </div>

          {/* Shipment Lot Size */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.shipmentSize}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="500"
                step="5"
                value={lotSizeQuintals}
                onChange={(e) => setLotSizeQuintals(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                (~{(lotSizeQuintals * 0.1).toFixed(1)} MT)
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ARBITRAGE FINANCIAL METRICS SUMMARY CARDS              */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Local Mandi Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t.localMandiPrice(translatedDistrict)}
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            ₹{analysis.effectiveLocalPrice}
            <span className="text-xs font-normal text-slate-500"> /qtl</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {analysis.isGlutOver70 ? t.glutDepressed : t.standardAuction}
          </p>
        </div>

        {/* Top Destination Mandi */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 p-4 rounded-2xl border border-emerald-300">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
            <span>{t.topInterstateMandi}</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">{t.recommended}</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            ₹{activeRoute.destinationLivePrice}
            <span className="text-xs font-normal text-emerald-700"> /qtl</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold mt-1">
            {activeRoute.mandiName} ({activeRoute.priceTrend} {t.today})
          </p>
        </div>

        {/* Net Gain After Freight */}
        <div className="bg-emerald-900 text-white p-4 rounded-2xl border border-emerald-700 shadow-sm">
          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
            {t.netArbitrageGain}
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">
            +₹{activeRoute.netArbitragePerQtl}
            <span className="text-xs font-normal text-emerald-200"> /qtl</span>
          </div>
          <p className="text-[11px] text-emerald-100/80 mt-1">
            {t.deductingFreight(activeRoute.freightCostPerQtl)}
          </p>
        </div>

        {/* Total Lot Profit */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 p-4 rounded-2xl border border-amber-300">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
            {t.totalExtraProfit(lotSizeQuintals)}
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">
            +₹{activeRoute.totalNetGainForLot.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-800 font-semibold mt-1">
            {t.gainVsLocal(activeRoute.roiPercentage, translatedDistrict)}
          </p>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE LEAFLET ROUTE MAP                          */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                {t.mapTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.mapDesc(translatedDistrict)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              {t.liveGps}
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[460px] sm:h-[520px] bg-slate-100 z-10"
          />

          {/* Floating Selected Route Card on top of Map */}
          {activeRoute && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 bg-slate-900/90 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  {t.selectedRoute}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeRoute.distanceKm} km • ~{activeRoute.transitHours}h
                </span>
              </div>
              <h4 className="text-sm font-black text-white">{activeRoute.mandiName}</h4>
              <div className="text-xs text-slate-300 mt-1">
                {t.via} <strong>{activeRoute.highway}</strong>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">{t.liveRate}</div>
                  <div className="font-extrabold text-emerald-300">₹{activeRoute.destinationLivePrice}/qtl</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">{t.netEarnings}</div>
                  <div className="font-extrabold text-amber-300">+₹{activeRoute.totalNetGainForLot.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 5. INTERSTATE MANDI ROUTE COMPARISON CARDS               */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-lg text-slate-900">
              {t.rankedTitle(translatedCrop)}
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {t.sortedByProfit}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routesWithLiveNoise.map((route, idx) => {
            const isSelected = selectedRouteId === route.mandiId;
            const isBest = idx === 0;

            return (
              <div
                key={route.mandiId}
                onClick={() => setSelectedRouteId(route.mandiId)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/50 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                            🏆 {t.bestReturn}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {route.state}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">
                        {route.mandiName}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-emerald-700">
                        ₹{route.destinationLivePrice}
                        <span className="text-xs font-normal text-slate-500"> /qtl</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {route.priceTrend} {t.today}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {route.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{t.distance}</div>
                      <div className="font-bold text-slate-800">{route.distanceKm} km</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{t.transit}</div>
                      <div className="font-bold text-slate-800">~{route.transitHours} {t.hours}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{t.freightToll}</div>
                      <div className="font-bold text-slate-800">₹{route.freightCostPerQtl}/qtl</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{t.profitMargin}</div>
                    <div className="text-sm font-black text-emerald-700">
                      +₹{route.netArbitragePerQtl}/qtl (+₹{route.totalNetGainForLot.toLocaleString()})
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRouteId(route.mandiId);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900'
                    }`}
                  >
                    <span>{isSelected ? t.viewOnMap : t.selectRoute}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. LOGISTICS, E-WAY BILL & HIGHWAY COMPLIANCE CHECKLIST   */}
      {/* ========================================================= */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h4 className="font-extrabold text-base text-white uppercase tracking-wider">
            {t.guideTitle}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>{t.gstTitle}</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              {t.gstDesc}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>{t.tollTitle}</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              {t.tollDesc}
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-teal-300 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>{t.eNamLogisticsTitle}</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              {t.eNamLogisticsDesc}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800">
          <span className="text-slate-400">
            {t.officialPortals} <a href="https://www.enam.gov.in/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold">{t.eNamPortal}</a> • <a href="https://fruits.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold">{t.fruitsPortal}</a>
          </span>
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
