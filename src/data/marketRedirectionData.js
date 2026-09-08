// Interstate Market Redirection & Logistics Intelligence Data
// Hyper-localized GPS coordinates, highway routing corridors, and live APMC mandi wholesale benchmarks.

export const DISTRICT_COORDINATES = {
  // Karnataka Districts
  'Davanagere': { lat: 14.4644, lng: 75.9218, state: 'Karnataka', majorHighway: 'NH 48 (Pune-Bengaluru Corridor)' },
  'Chitradurga': { lat: 14.2251, lng: 76.3980, state: 'Karnataka', majorHighway: 'NH 48 / NH 50' },
  'Kolar': { lat: 13.1367, lng: 78.1291, state: 'Karnataka', majorHighway: 'NH 75 (Bengaluru-Chennai Corridor)' },
  'Belagavi': { lat: 15.8497, lng: 74.4977, state: 'Karnataka', majorHighway: 'NH 48 (Maharashtra Border)' },
  'Mandya': { lat: 12.5218, lng: 76.8951, state: 'Karnataka', majorHighway: 'Bengaluru-Mysuru Expressway / NH 275' },
  'Dharwad': { lat: 15.4589, lng: 75.0078, state: 'Karnataka', majorHighway: 'NH 48 / NH 67' },
  'Shivamogga': { lat: 13.9299, lng: 75.5681, state: 'Karnataka', majorHighway: 'NH 69 / NH 206' },
  'Chikkamagaluru': { lat: 13.3161, lng: 75.7720, state: 'Karnataka', majorHighway: 'NH 173 / NH 73' },
  'Vijayapura': { lat: 16.8302, lng: 75.7100, state: 'Karnataka', majorHighway: 'NH 50 / NH 52' },
  'Ballari': { lat: 15.1394, lng: 76.9214, state: 'Karnataka', majorHighway: 'NH 67 / Andhra Border' },
  'Mysuru': { lat: 12.2958, lng: 76.6394, state: 'Karnataka', majorHighway: 'NH 766 (Kerala / TN border link)' },
  'Haveri': { lat: 14.7954, lng: 75.3991, state: 'Karnataka', majorHighway: 'NH 48' },
  // Fallbacks
  'Yavatmal': { lat: 20.3888, lng: 78.1204, state: 'Maharashtra', majorHighway: 'NH 361' },
  'Ludhiana': { lat: 30.9010, lng: 75.8573, state: 'Punjab', majorHighway: 'NH 44' },
  'Junagadh': { lat: 21.5222, lng: 70.4579, state: 'Gujarat', majorHighway: 'NH 151' },
  'Wardha': { lat: 20.7453, lng: 78.6022, state: 'Maharashtra', majorHighway: 'NH 361 / Nagpur Corridor' },
  'default': { lat: 14.4644, lng: 75.9218, state: 'Karnataka', majorHighway: 'NH 48' }
};

// Interstate Terminal APMC Mandis across India
export const INTERSTATE_TERMINAL_MANDIS = [
  {
    id: 'mumbai_vashi',
    mandiName: 'Mumbai Vashi APMC (Navi Mumbai)',
    shortName: 'Vashi APMC',
    city: 'Mumbai',
    state: 'Maharashtra',
    coords: [19.0760, 72.9977],
    highway: 'NH 48 (Golden Quadrilateral)',
    targetCrops: ['Tomato', 'Maize / Corn', 'Cotton', 'Sugarcane', 'Specialty Crop'],
    tradeCapacity: 'Mega Wholesale (Over 3,500 trucks daily)',
    avgTradingHours: '4:00 AM - 11:30 AM',
    contactDesk: 'MSAMB e-NAM Facilitation Cell: 022-27888123',
    tollCheckposts: 4,
    description: 'India largest financial terminal market with huge institutional demand from hotels, supermarkets, and processors.'
  },
  {
    id: 'pune_gultekdi',
    mandiName: 'Pune APMC (Gultekdi Market Yard)',
    shortName: 'Pune APMC',
    city: 'Pune',
    state: 'Maharashtra',
    coords: [18.4975, 73.8647],
    highway: 'NH 48 / NH 65',
    targetCrops: ['Maize / Corn', 'Tomato', 'Sugarcane', 'Groundnut', 'Specialty Crop'],
    tradeCapacity: 'Regional Hub (1,800 trucks daily)',
    avgTradingHours: '5:00 AM - 12:00 PM',
    contactDesk: 'Pune Market Committee: 020-24262100',
    tollCheckposts: 3,
    description: 'Major processing and cattle feed manufacturing hub with strong cash settlement and prompt auction clearance.'
  },
  {
    id: 'chennai_koyambedu',
    mandiName: 'Chennai Koyambedu Wholesale Market Complex',
    shortName: 'Koyambedu APMC',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coords: [13.0694, 80.1948],
    highway: 'NH 75 / NH 48',
    targetCrops: ['Tomato', 'Chilli (Red / Green)', 'Paddy / Rice', 'Groundnut', 'Specialty Crop'],
    tradeCapacity: 'Mega Perishables Hub (2,400 trucks daily)',
    avgTradingHours: '3:00 AM - 10:00 AM',
    contactDesk: 'TN Agri Marketing Cell: 044-24792345',
    tollCheckposts: 3,
    description: 'Premier consumer destination market in South India; offers immediate liquidity and top retail aggregation prices.'
  },
  {
    id: 'coimbatore_apmc',
    mandiName: 'Coimbatore APMC & Feed Aggregation Yard',
    shortName: 'Coimbatore APMC',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    coords: [11.0168, 76.9558],
    highway: 'NH 544 / NH 948',
    targetCrops: ['Maize / Corn', 'Cotton', 'Groundnut', 'Sugarcane'],
    tradeCapacity: 'Industrial & Feed Mill Belt',
    avgTradingHours: '6:00 AM - 1:00 PM',
    contactDesk: 'Coimbatore Market Committee: 0422-2301890',
    tollCheckposts: 3,
    description: 'Poultry capital and textile hub of South India; massive constant demand for livestock feed maize and cotton lint.'
  },
  {
    id: 'hyderabad_bowenpally',
    mandiName: 'Hyderabad Bowenpally & Malakpet APMC',
    shortName: 'Bowenpally APMC',
    city: 'Hyderabad',
    state: 'Telangana',
    coords: [17.4728, 78.4739],
    highway: 'NH 44 / NH 167',
    targetCrops: ['Tomato', 'Maize / Corn', 'Cotton', 'Paddy / Rice', 'Chilli (Red / Green)'],
    tradeCapacity: 'Metro Consumption Center (2,000 trucks daily)',
    avgTradingHours: '4:30 AM - 12:00 PM',
    contactDesk: 'Telangana Marketing Dept: 040-23456789',
    tollCheckposts: 3,
    description: 'Huge urban consumption base and processing units with high demand for coarse grains and horticulture.'
  },
  {
    id: 'guntur_mirchi_yard',
    mandiName: 'Guntur Mirchi Yard APMC (Asia Largest)',
    shortName: 'Guntur Yard',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    coords: [16.3067, 80.4365],
    highway: 'NH 16 / NH 67',
    targetCrops: ['Chilli (Red / Green)', 'Cotton', 'Paddy / Rice'],
    tradeCapacity: 'Asia Benchmark Spices Yard',
    avgTradingHours: '6:00 AM - 2:00 PM',
    contactDesk: 'Guntur Agricultural Market Committee: 0863-2234500',
    tollCheckposts: 4,
    description: 'World-renowned spice auction center where international exporters pay premium rates for high-grade dry chillies.'
  },
  {
    id: 'kochi_ernakulam',
    mandiName: 'Kochi Ernakulam Wholesale Grain & Vegetable Market',
    shortName: 'Kochi APMC',
    city: 'Kochi',
    state: 'Kerala',
    coords: [9.9816, 76.2999],
    highway: 'NH 544 / NH 66',
    targetCrops: ['Tomato', 'Paddy / Rice', 'Sugarcane', 'Specialty Crop'],
    tradeCapacity: 'High Deficit Inward Market',
    avgTradingHours: '4:00 AM - 11:00 AM',
    contactDesk: 'Kerala VFPCK Trading Desk: 0484-2391000',
    tollCheckposts: 2,
    description: 'Kerala produces under 20% of its food grains and vegetables, offering consistently elevated market clearing prices.'
  },
  {
    id: 'surat_apmc',
    mandiName: 'Surat APMC Market Yard (Gujarat)',
    shortName: 'Surat APMC',
    city: 'Surat',
    state: 'Gujarat',
    coords: [21.1702, 72.8311],
    highway: 'NH 48',
    targetCrops: ['Cotton', 'Sugarcane', 'Groundnut'],
    tradeCapacity: 'Textile & Ginning Hub',
    avgTradingHours: '7:00 AM - 1:30 PM',
    contactDesk: 'Surat APMC Board: 0261-2489001',
    tollCheckposts: 5,
    description: 'World capital for synthetic and cotton yarn; spinning mills bid aggressively for medium and long staple cotton.'
  },
  {
    id: 'delhi_azadpur',
    mandiName: 'Delhi Azadpur APMC (National Capital Region)',
    shortName: 'Azadpur Mandi',
    city: 'New Delhi',
    state: 'Delhi NCR',
    coords: [28.7161, 77.1722],
    highway: 'NH 44 (North-South Corridor)',
    targetCrops: ['Tomato', 'Paddy / Rice', 'Chilli (Red / Green)', 'Specialty Crop'],
    tradeCapacity: 'National Benchmark Terminal (Over 6,000 trucks daily)',
    avgTradingHours: '3:00 AM - 12:00 PM',
    contactDesk: 'Delhi Agricultural Marketing Board: 011-27691234',
    tollCheckposts: 7,
    description: 'Asia biggest fruit and vegetable market; absorbs colossal volume shipments for Northern India distribution.'
  }
];

// Baseline and Live interstate pricing by crop (Rs per quintal)
export const LIVE_COMMODITY_PRICING = {
  'Maize / Corn': {
    localMandiBenchmark: 2280,
    glutDepressedPrice: 1980,
    msp: 2225,
    interstateDestinations: [
      { mandiId: 'coimbatore_apmc', currentLivePrice: 2840, priceTrend: '+₹80', demandLevel: 'Very High (Feed Mills Deficit)' },
      { mandiId: 'pune_gultekdi', currentLivePrice: 2680, priceTrend: '+₹50', demandLevel: 'High (Starch Units)' },
      { mandiId: 'hyderabad_bowenpally', currentLivePrice: 2620, priceTrend: '+₹40', demandLevel: 'High' },
      { mandiId: 'mumbai_vashi', currentLivePrice: 2710, priceTrend: '+₹65', demandLevel: 'High' }
    ]
  },
  'Tomato': {
    localMandiBenchmark: 1800,
    glutDepressedPrice: 1250,
    msp: null,
    interstateDestinations: [
      { mandiId: 'chennai_koyambedu', currentLivePrice: 3200, priceTrend: '+₹250', demandLevel: 'Severe Shortage' },
      { mandiId: 'kochi_ernakulam', currentLivePrice: 3550, priceTrend: '+₹300', demandLevel: 'Very High Deficit' },
      { mandiId: 'mumbai_vashi', currentLivePrice: 3100, priceTrend: '+₹180', demandLevel: 'High Metro Demand' },
      { mandiId: 'hyderabad_bowenpally', currentLivePrice: 2950, priceTrend: '+₹140', demandLevel: 'High' }
    ]
  },
  'Cotton': {
    localMandiBenchmark: 7350,
    glutDepressedPrice: 6850,
    msp: 7121,
    interstateDestinations: [
      { mandiId: 'coimbatore_apmc', currentLivePrice: 8750, priceTrend: '+₹180', demandLevel: 'Heavy Spinning Mill Demand' },
      { mandiId: 'surat_apmc', currentLivePrice: 8520, priceTrend: '+₹120', demandLevel: 'High Export Orders' },
      { mandiId: 'mumbai_vashi', currentLivePrice: 8400, priceTrend: '+₹90', demandLevel: 'Moderate High' },
      { mandiId: 'guntur_mirchi_yard', currentLivePrice: 8300, priceTrend: '+₹70', demandLevel: 'Steady' }
    ]
  },
  'Chilli (Red / Green)': {
    localMandiBenchmark: 35200,
    glutDepressedPrice: 31800,
    msp: null,
    interstateDestinations: [
      { mandiId: 'guntur_mirchi_yard', currentLivePrice: 42800, priceTrend: '+₹600', demandLevel: 'Export Grade Premium' },
      { mandiId: 'mumbai_vashi', currentLivePrice: 44200, priceTrend: '+₹750', demandLevel: 'High Retail Demand' },
      { mandiId: 'chennai_koyambedu', currentLivePrice: 41900, priceTrend: '+₹400', demandLevel: 'High' },
      { mandiId: 'delhi_azadpur', currentLivePrice: 45000, priceTrend: '+₹900', demandLevel: 'High Northern Inflow' }
    ]
  },
  'Paddy / Rice': {
    localMandiBenchmark: 2420,
    glutDepressedPrice: 2180,
    msp: 2300,
    interstateDestinations: [
      { mandiId: 'kochi_ernakulam', currentLivePrice: 3350, priceTrend: '+₹90', demandLevel: 'High Consumer Preference' },
      { mandiId: 'chennai_koyambedu', currentLivePrice: 3050, priceTrend: '+₹60', demandLevel: 'Steady Metro Demand' },
      { mandiId: 'mumbai_vashi', currentLivePrice: 3120, priceTrend: '+₹75', demandLevel: 'High' },
      { mandiId: 'hyderabad_bowenpally', currentLivePrice: 2850, priceTrend: '+₹40', demandLevel: 'Moderate' }
    ]
  },
  'Groundnut': {
    localMandiBenchmark: 6550,
    glutDepressedPrice: 6050,
    msp: 6783,
    interstateDestinations: [
      { mandiId: 'chennai_koyambedu', currentLivePrice: 7750, priceTrend: '+₹110', demandLevel: 'Oil Mill Inward Procurement' },
      { mandiId: 'surat_apmc', currentLivePrice: 7950, priceTrend: '+₹140', demandLevel: 'Crushing Mill High Demand' },
      { mandiId: 'coimbatore_apmc', currentLivePrice: 7600, priceTrend: '+₹80', demandLevel: 'High' },
      { mandiId: 'pune_gultekdi', currentLivePrice: 7500, priceTrend: '+₹60', demandLevel: 'Steady' }
    ]
  },
  'Sugarcane': {
    localMandiBenchmark: 335,
    glutDepressedPrice: 295,
    msp: 340,
    interstateDestinations: [
      { mandiId: 'pune_gultekdi', currentLivePrice: 485, priceTrend: '+₹15', demandLevel: 'Jaggery & Export Units' },
      { mandiId: 'mumbai_vashi', currentLivePrice: 510, priceTrend: '+₹20', demandLevel: 'Raw Juice Aggregation' },
      { mandiId: 'coimbatore_apmc', currentLivePrice: 460, priceTrend: '+₹12', demandLevel: 'Cane Processing Demand' }
    ]
  },
  'Specialty Crop': {
    localMandiBenchmark: 2800,
    glutDepressedPrice: 2350,
    msp: null,
    interstateDestinations: [
      { mandiId: 'mumbai_vashi', currentLivePrice: 3750, priceTrend: '+₹90', demandLevel: 'High Metro Demand' },
      { mandiId: 'chennai_koyambedu', currentLivePrice: 3600, priceTrend: '+₹80', demandLevel: 'High Deficit Inward' },
      { mandiId: 'hyderabad_bowenpally', currentLivePrice: 3450, priceTrend: '+₹50', demandLevel: 'Moderate High' },
      { mandiId: 'delhi_azadpur', currentLivePrice: 3950, priceTrend: '+₹120', demandLevel: 'Heavy Inflow Auction' }
    ]
  }
};

export function calculateRoadDistance(originCoords, destCoords) {
  if (!originCoords || !destCoords) return 400;
  const R = 6371;
  const dLat = ((destCoords[0] - originCoords[0]) * Math.PI) / 180;
  const dLon = ((destCoords[1] - originCoords[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((originCoords[0] * Math.PI) / 180) *
      Math.cos((destCoords[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  return Math.round(straightKm * 1.28);
}

export function calculateFreightPerQuintal(distanceKm) {
  const distanceRate = (distanceKm / 100) * 36;
  const baseTollHandling = 22;
  return Math.round(distanceRate + baseTollHandling);
}

export function getInterstateRedirectionAnalysis({
  originDistrict = 'Davanagere',
  cropName = 'Maize / Corn',
  regionalPopularity = 75,
  lotSizeQuintals = 80
}) {
  const originInfo = DISTRICT_COORDINATES[originDistrict] || DISTRICT_COORDINATES['default'];
  const cropPricing = LIVE_COMMODITY_PRICING[cropName] || LIVE_COMMODITY_PRICING['Specialty Crop'];

  const isGlutOver70 = Number(regionalPopularity) > 70;
  const effectiveLocalPrice = isGlutOver70 ? cropPricing.glutDepressedPrice : cropPricing.localMandiBenchmark;

  const routes = cropPricing.interstateDestinations.map(destInfo => {
    const mandi = INTERSTATE_TERMINAL_MANDIS.find(m => m.id === destInfo.mandiId) || INTERSTATE_TERMINAL_MANDIS[0];
    const distanceKm = calculateRoadDistance([originInfo.lat, originInfo.lng], mandi.coords);
    const freightCostPerQtl = calculateFreightPerQuintal(distanceKm);
    const grossSpreadPerQtl = destInfo.currentLivePrice - effectiveLocalPrice;
    const netArbitragePerQtl = grossSpreadPerQtl - freightCostPerQtl;
    const transitHours = Math.round(distanceKm / 42);

    const totalNetGainForLot = Math.round(netArbitragePerQtl * lotSizeQuintals);
    const roiPercentage = Math.round((netArbitragePerQtl / effectiveLocalPrice) * 100);

    return {
      mandiId: mandi.id,
      mandiName: mandi.mandiName,
      shortName: mandi.shortName,
      city: mandi.city,
      state: mandi.state,
      coords: mandi.coords,
      highway: mandi.highway,
      distanceKm,
      transitHours,
      freightCostPerQtl,
      destinationLivePrice: destInfo.currentLivePrice,
      priceTrend: destInfo.priceTrend,
      demandLevel: destInfo.demandLevel,
      effectiveLocalPrice,
      grossSpreadPerQtl,
      netArbitragePerQtl,
      totalNetGainForLot,
      roiPercentage,
      tradeCapacity: mandi.tradeCapacity,
      avgTradingHours: mandi.avgTradingHours,
      contactDesk: mandi.contactDesk,
      description: mandi.description,
      isRecommended: isGlutOver70 && netArbitragePerQtl > 150
    };
  });

  routes.sort((a, b) => b.netArbitragePerQtl - a.netArbitragePerQtl);

  return {
    isGlutOver70,
    regionalPopularity: Number(regionalPopularity),
    originDistrict,
    originCoords: [originInfo.lat, originInfo.lng],
    originState: originInfo.state,
    originHighway: originInfo.majorHighway,
    cropName,
    lotSizeQuintals,
    effectiveLocalPrice,
    localBenchmark: cropPricing.localMandiBenchmark,
    glutDepressedPrice: cropPricing.glutDepressedPrice,
    routes,
    bestRoute: routes[0],
    timestamp: new Date().toISOString()
  };
}
