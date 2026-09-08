// AgriCopilot Agricultural Knowledge Base & District Rules Engine
// Tailored for precision agronomic advisories, price forecasting, policy mapping, and financial filtering.

export const SOIL_TYPES = [
  { id: 'alluvial', name: 'Alluvial Soil', description: 'Rich in potash & lime, highly fertile, ideal for cereals and sugarcane' },
  { id: 'black', name: 'Black Soil (Regur)', description: 'High clay content, moisture retentive, rich in iron/magnesium, optimal for cotton' },
  { id: 'red', name: 'Red & Yellow Soil', description: 'Formed from crystalline rocks, rich in iron, low nitrogen, requires organic manuring' },
  { id: 'laterite', name: 'Laterite Soil', description: 'Leached soil rich in iron and aluminium, acidic, good for plantation and pulses with lime' },
  { id: 'sandy_loam', name: 'Sandy Loam Soil', description: 'Light, quick-draining, easy aeration, excellent for tubers, groundnut and vegetables' },
  { id: 'clayey', name: 'Clayey Soil', description: 'High water-holding capacity, dense texture, prime for paddy and water-loving crops' },
];

export const CROP_DATABASE = {
  'Cotton': {
    name: 'Cotton (Kapas)',
    category: 'Commercial / Fibre',
    idealSoils: ['black', 'alluvial'],
    idealTemp: { min: 21, max: 35, optimal: 28 },
    idealRainfall: { min: 600, max: 1100, optimal: 850 },
    msp: 7121, // ₹ per quintal (Medium/Long staple)
    basePriceRange: { min: 6800, max: 8200 },
    pests: [
      { name: 'Pink Bollworm (Pectinophora gossypiella)', severity: 'High', regions: ['Yavatmal', 'Nagpur', 'Adilabad', 'Kurnool', 'Bathinda', 'Davanagere', 'Chitradurga', 'Dharwad'] },
      { name: 'Whitefly (Bemisia tabaci)', severity: 'Medium', regions: ['Sirsa', 'Fazilka', 'Mansukhnagar'] },
      { name: 'Cotton Leaf Curl Virus (CLCuD)', severity: 'High', regions: ['Punjab', 'Haryana', 'Rajasthan'] }
    ],
    valueAddition: {
      action: 'Micro-Ginning & Certified Organic/Long-Staple Grading',
      details: 'Instead of selling raw seed cotton (Kapas) directly to aggregators, grade into Lint & Cottonseed. Partner with local FPO ginning units.',
      estimatedMarginBoost: '22% to 28% higher net returns',
      byProducts: ['Cottonseed oil cake for cattle feed', 'Clean lint for direct spinning mill contracts']
    },
    schemes: [
      { name: 'Technology Mission on Cotton (TMC)', benefit: 'Subsidy on pheromone traps, quality seeds & drip irrigation', applyUrl: 'https://txcindia.gov.in/', portalName: 'Cotton Mission Portal' },
      { name: 'PM Fasal Bima Yojana (PMFBY)', benefit: 'Risk insurance cover with only 5% commercial crop farmer premium', applyUrl: 'https://pmfby.gov.in/', portalName: 'PMFBY Portal' }
    ]
  },

  'Tomato': {
    name: 'Tomato (Tamatar)',
    category: 'Horticulture / Vegetable',
    idealSoils: ['red', 'sandy_loam', 'alluvial'],
    idealTemp: { min: 18, max: 30, optimal: 24 },
    idealRainfall: { min: 500, max: 900, optimal: 700 },
    msp: null, // Horticultural open mandi
    basePriceRange: { min: 1400, max: 3600 },
    pests: [
      { name: 'Tomato Leaf Curl Virus (ToLCV)', severity: 'High', regions: ['Kolar', 'Chittoor', 'Pune', 'Nashik'] },
      { name: 'Fruit Borer (Helicoverpa armigera)', severity: 'Medium', regions: ['All Districts'] },
      { name: 'Early / Late Blight (Alternaria / Phytophthora)', severity: 'High', regions: ['High humidity / post-rain'] }
    ],
    valueAddition: {
      action: 'Solar Sun-Drying, Pureeing & Ketchup Aggregation via FPO',
      details: 'Fresh tomato glut causes steep price drops at harvest. Processing 30% of bumper harvest into aseptic puree or sun-dried halves preserves capital.',
      estimatedMarginBoost: '35% to 45% profit expansion vs distress spot selling',
      byProducts: ['Tomato skin and seed powder for livestock feed & lycopene extracts']
    },
    schemes: [
      { name: 'Mission for Integrated Development of Horticulture (MIDH)', benefit: 'Up to 40-50% capital subsidy for solar poly-tunnel dryers & pack-houses', applyUrl: 'https://midh.gov.in/', portalName: 'Horticulture Mission Portal' },
      { name: 'Operation Greens (TOP to TOTAL)', benefit: '50% subsidy on transportation & cold storage rent during bumper harvests', applyUrl: 'https://www.mofpi.gov.in/', portalName: 'MOFPI Portal' }
    ]
  },

  'Wheat': {
    name: 'Wheat (Gehun)',
    category: 'Cereal / Rabi',
    idealSoils: ['alluvial', 'black', 'sandy_loam'],
    idealTemp: { min: 14, max: 25, optimal: 20 },
    idealRainfall: { min: 350, max: 750, optimal: 550 },
    msp: 2275, // ₹ per quintal
    basePriceRange: { min: 2275, max: 2850 },
    pests: [
      { name: 'Yellow Rust (Puccinia striiformis)', severity: 'High', regions: ['Ludhiana', 'Amritsar', 'Karnal', 'Hoshiarpur'] },
      { name: 'Aphids / Termites', severity: 'Low', regions: ['Dry zone belts'] }
    ],
    valueAddition: {
      action: 'Stoneground Whole Chakki Atta Packaging & Sharbati/Bansi Premium Sort',
      details: 'Packaged unadulterated whole-wheat flour sold to peri-urban consumer collectives fetches ₹38-₹45/kg vs ₹23/kg wholesale grain.',
      estimatedMarginBoost: '25% to 32% net revenue increase',
      byProducts: ['Wheat bran (Chokar) for dairy cattle concentrate feed']
    },
    schemes: [
      { name: 'National Food Security Mission (NFSM-Wheat)', benefit: 'Free certified high-yielding seed distribution & rotavator subsidies', applyUrl: 'https://nfsm.gov.in/', portalName: 'NFSM Portal' },
      { name: 'PM-KISAN Direct Benefit Transfer', benefit: 'Direct income support of ₹6,000 per annum in 3 equal installments', applyUrl: 'https://pmkisan.gov.in/', portalName: 'PM-KISAN Portal' }
    ]
  },

  'Paddy / Rice': {
    name: 'Paddy / Basmati Rice (Dhan)',
    category: 'Cereal / Kharif',
    idealSoils: ['clayey', 'alluvial'],
    idealTemp: { min: 22, max: 36, optimal: 29 },
    idealRainfall: { min: 1000, max: 1800, optimal: 1300 },
    msp: 2300,
    basePriceRange: { min: 2300, max: 4600 },
    pests: [
      { name: 'Brown Plant Hopper (Nilaparvata lugens)', severity: 'High', regions: ['Godavari', 'Thanjavur', 'Karnal', 'Burdwan'] },
      { name: 'Bacterial Leaf Blight (Xanthomonas oryzae)', severity: 'Medium', regions: ['Waterlogged flood plains'] },
      { name: 'Stem Borer (Scirpophaga incertulas)', severity: 'High', regions: ['All major paddy basins'] }
    ],
    valueAddition: {
      action: 'Aged Parboiled Rice Packaging & Export Grade Milling',
      details: 'Custom milling of raw paddy into parboiled long grain or 1121 basmati packets for regional retail.',
      estimatedMarginBoost: '30% margin enhancement',
      byProducts: ['Rice bran oil extraction', 'Rice husk for biomass briquettes']
    },
    schemes: [
      { name: 'Sub-Mission on Agricultural Mechanization (SMAM)', benefit: 'Up to 50% subsidy on Paddy Transplanters & Laser Land Levelers', applyUrl: 'https://agrimachinery.nic.in/', portalName: 'Agri Machinery Portal' },
      { name: 'PM Krishi Sinchayee Yojana (PMKSY)', benefit: 'Assured irrigation infrastructure and water budgeting kits', applyUrl: 'https://pmksy.gov.in/', portalName: 'PMKSY Portal' }
    ]
  },

  'Groundnut': {
    name: 'Groundnut (Mungfali)',
    category: 'Oilseed / Legume',
    idealSoils: ['sandy_loam', 'red', 'alluvial'],
    idealTemp: { min: 22, max: 32, optimal: 27 },
    idealRainfall: { min: 500, max: 800, optimal: 650 },
    msp: 6783,
    basePriceRange: { min: 6500, max: 7600 },
    pests: [
      { name: 'Tikka Leaf Spot (Cercospora)', severity: 'Medium', regions: ['Junagadh', 'Anantapur', 'Bikaner'] },
      { name: 'White Grub (Holotrichia consanguinea)', severity: 'High', regions: ['Sandy soils during monsoon'] }
    ],
    valueAddition: {
      action: 'Cold-Pressed (Kachi Ghani) Pure Peanut Oil & Roasted Kernels',
      details: 'Cold-pressed peanut oil commands a retail price of ₹260-₹320/litre, more than doubling realization over selling raw unshelled pods.',
      estimatedMarginBoost: '38% to 50% value addition',
      byProducts: ['De-oiled protein-rich peanut cake for dairy feed']
    },
    schemes: [
      { name: 'National Mission on Edible Oils - Oilseeds (NMEO)', benefit: 'Financial assistance for mini-oil expellers, seed hubs & bio-fertilizers', applyUrl: 'https://nmeo.gov.in/', portalName: 'NMEO Oilseeds Portal' },
      { name: 'PMFBY Kharif Cover', benefit: 'Drought protection with 2% premium', applyUrl: 'https://pmfby.gov.in/', portalName: 'PMFBY Portal' }
    ]
  },

  'Soybean': {
    name: 'Soybean',
    category: 'Oilseed / Kharif',
    idealSoils: ['black', 'alluvial'],
    idealTemp: { min: 20, max: 32, optimal: 26 },
    idealRainfall: { min: 650, max: 1000, optimal: 800 },
    msp: 4892,
    basePriceRange: { min: 4600, max: 5400 },
    pests: [
      { name: 'Girdle Beetle (Obereopsis brevis)', severity: 'High', regions: ['Indore', 'Ujjain', 'Amravati', 'Latur'] },
      { name: 'Spodoptera litura (Tobacco Caterpillar)', severity: 'Medium', regions: ['Central India'] }
    ],
    valueAddition: {
      action: 'Soymilk, Soya Tofu (Paneer) & Seed Grading for certified seed growers',
      details: 'Producing high-grade seed or processing into artisanal soymilk/paneer bypasses raw commodity price depression.',
      estimatedMarginBoost: '28% profit lift',
      byProducts: ['High-protein de-oiled cake (DOC) for poultry feed']
    },
    schemes: [
      { name: 'National Mission on Oilseeds', benefit: 'Seed village program 75% subsidy on foundation seeds', applyUrl: 'https://nmeo.gov.in/', portalName: 'Oilseeds Portal' },
      { name: 'Soil Health Card Scheme', benefit: 'Soil testing kits and micro-nutrient sulphur supplementation subsidies', applyUrl: 'https://soilhealth.dac.gov.in/', portalName: 'Soil Health Portal' }
    ]
  },

  'Onion': {
    name: 'Onion (Pyaz)',
    category: 'Horticulture / Commercial Bulb',
    idealSoils: ['alluvial', 'red', 'sandy_loam'],
    idealTemp: { min: 15, max: 30, optimal: 22 },
    idealRainfall: { min: 450, max: 750, optimal: 600 },
    msp: null,
    basePriceRange: { min: 1100, max: 2900 },
    pests: [
      { name: 'Thrips (Thrips tabaci)', severity: 'High', regions: ['Nashik', 'Ahmednagar', 'Alwar', 'Belgaum'] },
      { name: 'Purple Blotch (Alternaria porri)', severity: 'High', regions: ['High humidity conditions'] }
    ],
    valueAddition: {
      action: 'Dehydrated Onion Flakes, Powder & Low-Cost Ventilated Chawl Storage',
      details: 'Storing produce in ventilated Kanda Chawl for 3-4 months avoids harvest glut and captures festive price peaks.',
      estimatedMarginBoost: '40% to 60% price arbitrage',
      byProducts: ['Dehydrated flakes for food seasoning industries']
    },
    schemes: [
      { name: 'MIDH Onion Storage Structure Subsidy', benefit: '50% subsidy up to ₹87,500 for constructing 25-metric-ton ventilated storage', applyUrl: 'https://midh.gov.in/', portalName: 'MIDH Portal' },
      { name: 'e-NAM National Agriculture Market', benefit: 'Inter-state online electronic bidding with direct bank transfer', applyUrl: 'https://www.enam.gov.in/', portalName: 'e-NAM Portal' }
    ]
  },

  'Sugarcane': {
    name: 'Sugarcane (Ganna)',
    category: 'Cash Crop / Perennial',
    idealSoils: ['alluvial', 'black', 'clayey'],
    idealTemp: { min: 20, max: 38, optimal: 30 },
    idealRainfall: { min: 1100, max: 2000, optimal: 1500 },
    msp: 340, // Fair & Remunerative Price (FRP) ₹ per quintal
    basePriceRange: { min: 320, max: 390 },
    pests: [
      { name: 'Early Shoot Borer (Chilo infuscatellus)', severity: 'High', regions: ['Muzaffarnagar', 'Kolhapur', 'Mandya'] },
      { name: 'Red Rot (Colletotrichum falcatum)', severity: 'Critical', regions: ['Eastern UP', 'Bihar'] }
    ],
    valueAddition: {
      action: 'Organic Jaggery (Gur) Granules, Liquid Jaggery & Cane Juice Bottling',
      details: 'Direct processing into chemical-free organic jaggery powder fetches ₹70-₹90/kg vs mill gate cane price of ₹3.40/kg.',
      estimatedMarginBoost: '35% net margin premium',
      byProducts: ['Bagasse for bio-compost or mushroom cultivation', 'Molasses for cattle supplements']
    },
    schemes: [
      { name: 'Sugar Development Fund (SDF)', benefit: 'Concessional loans for modern jaggery processing units', applyUrl: 'https://dfpd.gov.in/', portalName: 'DFPD Sugar Portal' },
      { name: 'Micro-Irrigation Fund under NABARD', benefit: 'Subsidized subsurface drip irrigation systems saving 40% water', applyUrl: 'https://pmksy.gov.in/', portalName: 'Micro-Irrigation Portal' }
    ]
  },

  'Maize / Corn': {
    name: 'Maize (Makka / Corn)',
    category: 'Cereal / Kharif & Rabi',
    idealSoils: ['red', 'alluvial', 'black', 'sandy_loam'],
    idealTemp: { min: 20, max: 35, optimal: 28 },
    idealRainfall: { min: 500, max: 900, optimal: 650 },
    msp: 2225,
    basePriceRange: { min: 2150, max: 2750 },
    pests: [
      { name: 'Fall Armyworm (Spodoptera frugiperda)', severity: 'Critical', regions: ['Davanagere', 'Chitradurga', 'Haveri', 'Ballari'] },
      { name: 'Stem Borer (Chilo partellus)', severity: 'High', regions: ['Central Dry Zone'] }
    ],
    valueAddition: {
      action: 'Silage Fermentation Bales & Cattle Feed Grade Milling',
      details: 'Chopping green fodder maize into airtight fermented silage bales commands ₹4,500-₹5,500/tonne for dairy cooperatives during summer fodder deficits.',
      estimatedMarginBoost: '32% to 42% value addition',
      byProducts: ['Corn cob residue for bio-fuel briquetting & organic mulch']
    },
    schemes: [
      { name: 'Karnataka Raitha Siri Scheme', benefit: 'Direct input assistance of ₹10,000 per hectare for coarse cereals & millets', applyUrl: 'https://fruits.karnataka.gov.in/', portalName: 'Karnataka FRUITS Portal' },
      { name: 'National Food Security Mission (NFSM-Coarse Cereals)', benefit: 'Subsidy on hybrid seeds, bio-pesticides & zero-till seed drills', applyUrl: 'https://nfsm.gov.in/', portalName: 'NFSM Portal' }
    ]
  },

  'Ragi / Finger Millet': {
    name: 'Ragi / Finger Millet (Eleusine coracana)',
    category: 'Millet / Climate-Resilient Nutri-Cereal',
    idealSoils: ['red', 'laterite', 'sandy_loam', 'alluvial'],
    idealTemp: { min: 18, max: 35, optimal: 27 },
    idealRainfall: { min: 350, max: 800, optimal: 550 },
    msp: 4290,
    basePriceRange: { min: 3800, max: 4800 },
    pests: [
      { name: 'Ragi Blast (Pyricularia grisea)', severity: 'Medium', regions: ['Mandya', 'Tumakuru', 'Hassan', 'Chitradurga'] },
      { name: 'Stem Borer', severity: 'Low', regions: ['All Districts'] }
    ],
    valueAddition: {
      action: 'Sprouted Ragi Flour (Malt), Ragi Biscuits & Breakfast Porridge Packets',
      details: 'Value addition into certified sprouted ragi malt yields ₹140-₹180/kg compared to raw grain wholesale price of ₹38-₹43/kg.',
      estimatedMarginBoost: '45% to 60% profit enhancement',
      byProducts: ['Ragi straw for premier nutritious dairy cattle fodder']
    },
    schemes: [
      { name: 'National Mission on Nutri-Cereals (Millets)', benefit: 'Direct seed subsidies, millet processing machinery grant up to 50%', applyUrl: 'https://millets.res.in/', portalName: 'Millets Mission Portal' },
      { name: 'Karnataka Raitha Siri Scheme', benefit: 'Direct cash DBT assistance of ₹10,000 per hectare for minor millets', applyUrl: 'https://fruits.karnataka.gov.in/', portalName: 'Karnataka FRUITS Portal' }
    ]
  },

  'Red Gram / Pigeon Pea': {
    name: 'Red Gram / Pigeon Pea (Tur / Arhar)',
    category: 'Pulse / Legume (Nitrogen Fixing)',
    idealSoils: ['black', 'red', 'laterite', 'alluvial', 'sandy_loam'],
    idealTemp: { min: 20, max: 36, optimal: 28 },
    idealRainfall: { min: 450, max: 850, optimal: 650 },
    msp: 7550,
    basePriceRange: { min: 7200, max: 9200 },
    pests: [
      { name: 'Pod Borer (Helicoverpa armigera)', severity: 'High', regions: ['Kalaburagi', 'Bidar', 'Davanagere', 'Chitradurga'] },
      { name: 'Fusarium Wilt', severity: 'Medium', regions: ['Deep black soils'] }
    ],
    valueAddition: {
      action: 'Mini Dal Mill Processing (Unpolished Desi Toor Dal Packaging)',
      details: 'Milling whole pigeon peas into unpolished protein-rich Toor Dal fetches ₹145-₹170/kg at retail vs raw pod mandi rate of ₹75/kg.',
      estimatedMarginBoost: '35% to 48% higher returns',
      byProducts: ['Chuni and broken hulls for livestock protein ration']
    },
    schemes: [
      { name: 'NFSM-Pulses Hub Scheme', benefit: 'Distribution of mini dal mills at 50% subsidy for FPOs and self-help groups', applyUrl: 'https://nfsm.gov.in/', portalName: 'NFSM Pulses Portal' },
      { name: 'PM-AASHA Price Support Scheme', benefit: '100% government procurement guarantee at MSP during market gluts', applyUrl: 'https://pmaasha.gov.in/', portalName: 'PM-AASHA Portal' }
    ]
  },

  'Jowar / Sorghum': {
    name: 'Jowar / Sorghum (Jola / White Millet)',
    category: 'Millet / Dryland Coarse Cereal',
    idealSoils: ['black', 'clayey', 'alluvial', 'red'],
    idealTemp: { min: 22, max: 38, optimal: 30 },
    idealRainfall: { min: 350, max: 700, optimal: 480 },
    msp: 3371,
    basePriceRange: { min: 3100, max: 3900 },
    pests: [
      { name: 'Shoot Fly (Atherigona soccata)', severity: 'Medium', regions: ['Vijayapura', 'Bagalkot', 'Dharwad', 'Ballari', 'Davanagere'] }
    ],
    valueAddition: {
      action: 'Gluten-Free Jowar Flour & Roasted Jowar Flakes (Poha)',
      details: 'Packaging premium gluten-free white jowar flour for urban diabetes/diet markets commands ₹65-₹80/kg.',
      estimatedMarginBoost: '40% margin expansion',
      byProducts: ['High-sugar dry stover fodder for sheep and cattle']
    },
    schemes: [
      { name: 'Raitha Siri Millet Incentive', benefit: '₹10,000 per hectare incentive directly into Aadhaar-linked bank account', applyUrl: 'https://fruits.karnataka.gov.in/', portalName: 'Karnataka FRUITS Portal' }
    ]
  }
};

// Default fallback for any custom crop entered by user
export const DEFAULT_CROP_TEMPLATE = {
  name: 'Specialty Crop',
  category: 'Commercial Agronomy',
  idealSoils: ['alluvial', 'sandy_loam'],
  idealTemp: { min: 18, max: 32, optimal: 25 },
  idealRainfall: { min: 500, max: 1000, optimal: 750 },
  msp: null,
  basePriceRange: { min: 2500, max: 5500 },
  pests: [
    { name: 'Common Sucking Pests / Stem Borers', severity: 'Medium', regions: ['General Agri Zones'] }
  ],
  valueAddition: {
    action: 'Primary Grading, Sorting, Cleaning & Direct Consumer Packaging',
    details: 'Grade produce into Size A / B. Avoid unsorted open mandi auctions.',
    estimatedMarginBoost: '20% to 30% profit boost',
    byProducts: ['Nutrient-rich crop residue mulching']
  },
  schemes: [
    { name: 'PM-KISAN Direct Benefit Transfer', benefit: '₹6,000 yearly income support for registered landholding farmers', applyUrl: 'https://pmkisan.gov.in/', portalName: 'PM-KISAN Portal' },
    { name: 'PM Fasal Bima Yojana (PMFBY)', benefit: 'Comprehensive crop insurance against weather calamities', applyUrl: 'https://pmfby.gov.in/', portalName: 'PMFBY Portal' }
  ]
};

// Loan guidance matrices based on Land Size filter (Smallholder < 2 Acres vs Commercial > 2 Acres)
export const LOAN_PROGRAMS = {
  smallholder: {
    tier: 'Marginal & Smallholder (< 2 Acres)',
    headline: 'Kisan Credit Card (KCC) Micro-Credit & JLG Collateral-Free Loans',
    primaryLoan: 'Kisan Credit Card (KCC) Revolving Agricultural Credit',
    interestRate: '4.0% p.a. (7% base - 3% prompt repayment incentive subvention)',
    maxLimit: 'Up to ₹1,60,000 collateral-free (expandable to ₹3,00,000)',
    repaymentTenure: '12 Months revolving / flexible after crop harvest',
    eligibilityCriteria: [
      'Owner-cultivator or documented tenant/sharecropper with under 2 acres',
      'Valid Aadhaar, land record (7/12, Patta, or Jamabandi extract)',
      'No defaults on existing crop credit lines'
    ],
    secondaryOptions: [
      { name: 'PM MUDRA Shishu Loan', limit: 'Up to ₹50,000 for seed drills, micro-irrigation pipe kits, and power tillers' },
      { name: 'Joint Liability Group (JLG) Micro-Finance', limit: 'Up to ₹50,000 per member without land mortgage' }
    ],
    actionLink: 'https://pmkisan.gov.in/KCC.aspx',
    actionLinkText: 'Apply on Official KCC PM-KISAN Portal',
    portalName: 'National Agriculture Credit / PM-KISAN KCC Portal'
  },
  commercial: {
    tier: 'Medium & Commercial Farmer (≥ 2 Acres)',
    headline: 'NABARD Agri-Business Term Loan & Farm Mechanization Credit',
    primaryLoan: 'Commercial Agri-Business Term Loan & Equipment Financing',
    interestRate: '8.25% - 9.5% p.a. (with eligible capital investment subsidy up to 36%)',
    maxLimit: '₹5,00,000 to ₹50,00,000 (Customized to project scale)',
    repaymentTenure: '5 to 7 Years with 6 to 12 months moratorium',
    eligibilityCriteria: [
      'Landholding above 2 acres with clear title mortgage capacity',
      'Viable farm operational plan or value-addition processing proposal',
      'CIBIL score > 680 with clean credit bureau repayment history'
    ],
    secondaryOptions: [
      { name: 'Agriculture Infrastructure Fund (AIF)', limit: 'Up to ₹2 Crore at 3% interest subvention for solar cold rooms & pack-houses' },
      { name: 'Warehouse Receipt Financing (e-NWR)', limit: 'Instant pledge loan up to 75% of stored produce market value to avoid distress sales' }
    ],
    actionLink: 'https://agriinfra.dac.gov.in/',
    actionLinkText: 'Access Agri Infrastructure Fund Portal',
    portalName: 'Ministry of Agriculture - AIF & NABARD Window'
  }
};

// Sample Farmer Pre-configurations for instant 1-click testing
export const SAMPLE_PRESETS = [
  {
    label: 'Anita Devi (Tomato • Kolar, Karnataka)',
    badge: 'Kolar Tomato • 1.5 Ac',
    data: {
      farmerName: 'Anita Devi',
      landSize: 1.5,
      district: 'Kolar',
      cropName: 'Tomato',
      soilType: 'red',
      temperature: 27,
      rainfall: 680,
      regionalPopularity: 42,
      soilImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    label: 'Basavaraj Patil (Sugarcane • Belagavi, Karnataka)',
    badge: 'Belagavi Cane • 6.0 Ac',
    data: {
      farmerName: 'Basavaraj Patil',
      landSize: 6.0,
      district: 'Belagavi',
      cropName: 'Sugarcane',
      soilType: 'black',
      temperature: 31,
      rainfall: 980,
      regionalPopularity: 72,
      soilImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    label: 'Ningappa Gowda (Cotton • Dharwad, Karnataka)',
    badge: 'Dharwad Cotton • 4.5 Ac',
    data: {
      farmerName: 'Ningappa Gowda',
      landSize: 4.5,
      district: 'Dharwad',
      cropName: 'Cotton',
      soilType: 'black',
      temperature: 32,
      rainfall: 720,
      regionalPopularity: 84,
      soilImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    label: 'Harpreet Singh (Basmati Paddy • Export Grade)',
    badge: 'Paddy • 12.0 Acres',
    data: {
      farmerName: 'Harpreet Singh',
      landSize: 12.0,
      district: 'Ludhiana',
      cropName: 'Paddy / Rice',
      soilType: 'alluvial',
      temperature: 30,
      rainfall: 650,
      regionalPopularity: 58,
      soilImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    label: '⚠️ Vikram Singh (Soil Discrepancy Test Case)',
    badge: 'Mismatch Alert Demo',
    data: {
      farmerName: 'Vikram Singh',
      landSize: 3.5,
      district: 'Wardha',
      cropName: 'Cotton',
      soilType: 'black',
      temperature: 32,
      rainfall: 780,
      regionalPopularity: 48,
      soilImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
    }
  }
];

// Preserved empty array for backward compatibility
export const SAMPLE_SOIL_PREVIEWS = [];

// Key Agricultural Districts of Karnataka
export const KARNATAKA_DISTRICTS = [
  { id: 'Davanagere', name: 'Davanagere', zone: 'Central Dry Zone', keyCrops: 'Maize, Paddy, Sugarcane, Cotton, Ragi' },
  { id: 'Chitradurga', name: 'Chitradurga', zone: 'Central Dry Zone', keyCrops: 'Pomegranate, Groundnut, Onion, Arecanut, Millets' },
  { id: 'Kolar', name: 'Kolar', zone: 'Eastern Dry Zone', keyCrops: 'Tomato, Vegetables, Mulberry, Groundnut' },
  { id: 'Belagavi', name: 'Belagavi', zone: 'Northern Transition Zone', keyCrops: 'Sugarcane, Soybean, Maize, Paddy' },
  { id: 'Mandya', name: 'Mandya', zone: 'Southern Dry Zone', keyCrops: 'Sugarcane, Paddy, Sericulture, Ragi' },
  { id: 'Dharwad', name: 'Dharwad', zone: 'Northern Transition Zone', keyCrops: 'Cotton, Soybean, Groundnut, Wheat' },
  { id: 'Shivamogga', name: 'Shivamogga', zone: 'Southern Transition / Malnad', keyCrops: 'Paddy, Arecanut, Maize, Spices' },
  { id: 'Chikkamagaluru', name: 'Chikkamagaluru', zone: 'Hilly / Malnad Zone', keyCrops: 'Coffee, Black Pepper, Cardamom, Horticulture' },
  { id: 'Vijayapura', name: 'Vijayapura', zone: 'Northern Dry Zone', keyCrops: 'Onion, Grapes, Lime, Pomegranate, Jowar' },
  { id: 'Ballari', name: 'Ballari', zone: 'North Eastern Dry Zone', keyCrops: 'Cotton, Chilli, Maize, Paddy' },
  { id: 'Mysuru', name: 'Mysuru', zone: 'Southern Dry Zone', keyCrops: 'Paddy, Sugarcane, Turmeric, Banana' },
  { id: 'Haveri', name: 'Haveri', zone: 'Central Dry Zone', keyCrops: 'Byadagi Red Chilli, Cotton, Maize, Groundnut' }
];

// Live ticker market commodities featuring Karnataka APMC and National Mandis
export const LIVE_MANDI_TICKER = [
  { commodity: 'Maize (Hybrid)', mandi: 'Davanagere APMC (KA)', price: '₹2,380/qtl', change: '+₹60', trend: 'up' },
  { commodity: 'Pomegranate (Bhagwa)', mandi: 'Chitradurga APMC (KA)', price: '₹12,400/qtl', change: '+₹350', trend: 'up' },
  { commodity: 'Tomato (Local)', mandi: 'Kolar APMC (KA)', price: '₹2,680/qtl', change: '+₹140', trend: 'up' },
  { commodity: 'Byadagi Red Chilli', mandi: 'Haveri APMC (KA)', price: '₹39,200/qtl', change: '+₹650', trend: 'up' },
  { commodity: 'Arecanut (Rashi)', mandi: 'Shivamogga APMC (KA)', price: '₹48,400/qtl', change: '+₹300', trend: 'up' },
  { commodity: 'Sugarcane (Mill Gate)', mandi: 'Belagavi (KA)', price: '₹345/qtl', change: '+₹5', trend: 'up' },
  { commodity: 'Sona Masoori Paddy', mandi: 'Mandya APMC (KA)', price: '₹2,720/qtl', change: '+₹40', trend: 'up' },
  { commodity: 'Cotton (DCH-32)', mandi: 'Dharwad APMC (KA)', price: '₹7,650/qtl', change: '-₹45', trend: 'down' },
  { commodity: 'Onion (Red)', mandi: 'Vijayapura APMC (KA)', price: '₹2,250/qtl', change: '-₹70', trend: 'down' },
  { commodity: 'Turmeric (Salem/Erode)', mandi: 'Mysuru (KA)', price: '₹14,800/qtl', change: '+₹210', trend: 'up' },
  { commodity: 'Groundnut Pods', mandi: 'Chitradurga (KA)', price: '₹6,950/qtl', change: '+₹120', trend: 'up' }
];

