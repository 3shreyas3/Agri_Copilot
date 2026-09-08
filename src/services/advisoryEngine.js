import { CROP_DATABASE, DEFAULT_CROP_TEMPLATE, SOIL_TYPES, LOAN_PROGRAMS, SAMPLE_SOIL_PREVIEWS } from '../data/agriKnowledge.js';
import { SOIL_FAMILY_COMPATIBILITY } from '../utils/trainedSoilModel.js';


/**
 * Evaluates the specific agronomic compatibility of a crop against farmer inputs:
 * soilType, temperature (°C), and rainfall (mm).
 * Returns scores, penalties, statuses, and reasons tailored to the farmer's field conditions.
 */
export function evaluateCropAgronomics({ crop, soilType, temperature, rainfall, district = '' }) {
  const numericTemp = parseFloat(temperature) || 28;
  const numericRain = parseFloat(rainfall) || 750;
  const soilInfo = SOIL_TYPES.find(s => s.id === soilType) || { id: soilType, name: soilType.charAt(0).toUpperCase() + soilType.slice(1) + ' Soil' };
  const compatibleFamily = SOIL_FAMILY_COMPATIBILITY[soilType] || [soilType];

  // 1. Soil Suitability Evaluation
  let soilScore = 35;
  let soilStatus = 'Incompatible Soil';
  let soilPenalty = 2.8;
  let soilReason = '';

  const isIdealSoil = (crop.idealSoils || []).includes(soilType);
  const isFamilyCompatible = (crop.idealSoils || []).some(s => compatibleFamily.includes(s));

  if (isIdealSoil) {
    soilScore = 100;
    soilStatus = 'Optimal / Highly Suitable';
    soilPenalty = 0;
    soilReason = `Naturally thrives in ${soilInfo.name} with optimal root development and nutrient absorption.`;
  } else if (isFamilyCompatible) {
    soilScore = 80;
    soilStatus = 'Compatible (Conditioning Needed)';
    soilPenalty = 1.2;
    soilReason = `Compatible with ${soilInfo.name} family; requires regular organic manuring/compost for root health.`;
  } else {
    soilScore = 35;
    soilStatus = 'Incompatible / Severe Soil Stress';
    soilPenalty = 2.8;
    soilReason = `Poor soil fit: ${crop.name} requires ${(crop.idealSoils || []).join(' or ')} soil. ${soilInfo.name} causes poor aeration or moisture stress.`;
  }

  const isSevereSoilStress = !isIdealSoil && !isFamilyCompatible;

  // 2. Temperature Evaluation
  let tempScore = 50;
  let tempStatus = 'Optimal';
  let tempPenalty = 0;
  let tempReason = '';
  let isSevereTempStress = false;

  const { min: tMin, max: tMax, optimal: tOpt } = crop.idealTemp;

  if (numericTemp >= tMin && numericTemp <= tMax) {
    const diffFromOpt = Math.abs(numericTemp - tOpt);
    tempScore = Math.max(75, Math.round(100 - (diffFromOpt * 2.5)));
    tempStatus = 'Optimal Thermal Range';
    tempPenalty = (diffFromOpt > 4) ? 0.5 : 0;
    tempReason = `Temperature (${numericTemp}°C) is in optimal physiological range (${tMin}°C - ${tMax}°C).`;
  } else if (numericTemp < tMin) {
    const deficit = tMin - numericTemp;
    if (deficit >= 6) {
      isSevereTempStress = true;
      tempScore = Math.max(10, Math.round(50 - (deficit * 7)));
      tempStatus = 'Severe Cold Shock';
      tempPenalty = Math.min(4.2, 2.0 + deficit * 0.4);
      tempReason = `🚨 Severe Cold Stress (${numericTemp}°C vs min ${tMin}°C): Far below vegetative threshold; causes stunting and frost damage.`;
    } else {
      tempScore = Math.max(25, Math.round(75 - (deficit * 7)));
      tempStatus = 'Moderate Cool Stress';
      tempPenalty = Math.min(2.0, deficit * 0.35);
      tempReason = `Cool Weather Alert (${numericTemp}°C vs min ${tMin}°C): Slower physiological growth; avoid early morning over-watering.`;
    }
  } else {
    const excess = numericTemp - tMax;
    if (excess >= 5) {
      isSevereTempStress = true;
      tempScore = Math.max(10, Math.round(50 - (excess * 7)));
      tempStatus = 'Extreme Heat Stress';
      tempPenalty = Math.min(4.5, 2.0 + excess * 0.45);
      tempReason = `🚨 Extreme Heat Stress (${numericTemp}°C vs max ${tMax}°C): Causes severe pollen sterility, flower abortion, and leaf scorching.`;
    } else {
      tempScore = Math.max(25, Math.round(75 - (excess * 7)));
      tempStatus = 'Moderate Heat Stress';
      tempPenalty = Math.min(2.2, excess * 0.35);
      tempReason = `Hot Weather Alert (${numericTemp}°C vs max ${tMax}°C): Requires timely morning irrigation to keep roots cool.`;
    }
  }

  // 3. Rainfall Evaluation
  let rainScore = 50;
  let rainStatus = 'Optimal';
  let rainPenalty = 0;
  let rainReason = '';
  let isSevereRainStress = false;

  const { min: rMin, max: rMax, optimal: rOpt } = crop.idealRainfall;

  if (numericRain >= rMin && numericRain <= rMax) {
    const diffFromOpt = Math.abs(numericRain - rOpt);
    rainScore = Math.max(75, Math.round(100 - ((diffFromOpt / 200) * 10)));
    rainStatus = 'Optimal Moisture';
    rainPenalty = 0;
    rainReason = `Rainfall (${numericRain}mm) fits moisture needs (${rMin}mm - ${rMax}mm).`;
  } else if (numericRain < rMin) {
    const deficit = rMin - numericRain;
    const percentDeficit = Math.round((deficit / rMin) * 100);

    if (percentDeficit >= 35) {
      isSevereRainStress = true;
      rainScore = Math.max(10, Math.round(50 - (percentDeficit * 0.6)));
      rainStatus = 'Severe Drought / Moisture Deficit';
      rainPenalty = Math.min(4.5, 2.0 + (percentDeficit / 100) * 3.5);
      rainReason = `🚨 Acute Drought Hazard (${numericRain}mm vs ${rMin}mm min): ${percentDeficit}% rainfall deficit! Severe moisture stress and yield failure without intensive irrigation.`;
    } else {
      rainScore = Math.max(20, Math.round(75 - ((deficit / 150) * 15)));
      rainStatus = 'Moderate Moisture Deficit';
      rainPenalty = Math.min(2.0, (deficit / 200) * 0.8);
      rainReason = `Low Rainfall Alert (${numericRain}mm vs optimal ${rOpt}mm): Supplemental drip/furrow watering required.`;
    }
  } else {
    const excess = numericRain - rMax;
    const percentExcess = Math.round((excess / rMax) * 100);

    if (percentExcess >= 40) {
      isSevereRainStress = true;
      rainScore = Math.max(15, Math.round(50 - (percentExcess * 0.5)));
      rainStatus = 'Severe Waterlogging / Flood';
      rainPenalty = Math.min(4.2, 2.0 + (percentExcess / 100) * 2.5);
      rainReason = `🚨 Severe Waterlogging Alert (${numericRain}mm vs ${rMax}mm max): Standing water will rot roots, induce fungal collar rot, and cause lodging.`;
    } else {
      rainScore = Math.max(25, Math.round(75 - ((excess / 200) * 15)));
      rainStatus = 'Moderate Excess Rain';
      rainPenalty = Math.min(1.8, (excess / 250) * 0.8);
      rainReason = `Heavy Rain Warning (${numericRain}mm vs optimal max ${rMax}mm): Excess water stagnating; drainage furrows needed.`;
    }
  }

  // Composite Weighted Suitability Score (0 - 100)
  const suitabilityScore = Math.round(
    (soilScore * 0.40) + (rainScore * 0.35) + (tempScore * 0.25)
  );

  return {
    soilScore,
    soilStatus,
    soilPenalty,
    soilReason,
    isIdealSoil,
    isFamilyCompatible,
    isSevereSoilStress,

    tempScore,
    tempStatus,
    tempPenalty,
    tempReason,
    isSevereTempStress,

    rainScore,
    rainStatus,
    rainPenalty,
    rainReason,
    isSevereRainStress,

    suitabilityScore
  };
}

/**
 * Evaluates and ranks alternate crops based on farmer inputs (soil, temperature, rainfall).
 * Tailored to suggest resilient, high-yield alternative options when risk is High.
 */
export function getAlternateCropRecommendations({ currentCropName, soilType, temperature, rainfall, district = '' }) {
  const numericTemp = parseFloat(temperature) || 28;
  const numericRain = parseFloat(rainfall) || 750;
  const soilInfo = SOIL_TYPES.find(s => s.id === soilType) || { id: soilType, name: soilType.charAt(0).toUpperCase() + soilType.slice(1) + ' Soil' };

  const candidates = [];

  for (const [key, crop] of Object.entries(CROP_DATABASE)) {
    if (key === currentCropName || crop.name === currentCropName) continue;

    const agro = evaluateCropAgronomics({
      crop,
      soilType,
      temperature: numericTemp,
      rainfall: numericRain,
      district
    });

    // Projected Health Score (out of 100%)
    const projectedHealthScore = Math.min(98, Math.max(40, Math.round(
      (agro.suitabilityScore * 0.95) + 5
    )));

    // Specific agronomic advantages of this alternative for the farmer's inputs
    const advantages = [];
    if (agro.soilScore >= 80) advantages.push(agro.soilReason);
    if (agro.rainScore >= 75) advantages.push(agro.rainReason);
    if (agro.tempScore >= 75) advantages.push(agro.tempReason);

    if (crop.idealRainfall.min <= numericRain && numericRain < 650) {
      advantages.push(`Drought Resilient: Needs only ${crop.idealRainfall.optimal}mm water, avoiding drought crop failure.`);
    }

    candidates.push({
      cropKey: key,
      cropName: crop.name,
      category: crop.category,
      suitabilityScore: agro.suitabilityScore,
      projectedHealthScore,
      soilScore: agro.soilScore,
      tempScore: agro.tempScore,
      rainScore: agro.rainScore,
      soilStatus: agro.soilStatus,
      tempStatus: agro.tempStatus,
      rainStatus: agro.rainStatus,
      soilReason: agro.soilReason,
      tempReason: agro.tempReason,
      rainReason: agro.rainReason,
      isSevereStress: agro.isSevereSoilStress || agro.isSevereTempStress || agro.isSevereRainStress,
      idealSoils: crop.idealSoils,
      idealTemp: crop.idealTemp,
      idealRainfall: crop.idealRainfall,
      basePriceRange: crop.basePriceRange,
      msp: crop.msp,
      valueAddition: crop.valueAddition?.action,
      primaryScheme: crop.schemes?.[0]?.name,
      advantages: advantages.slice(0, 3)
    });
  }

  // Sort candidates by highest suitability match
  candidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    topAlternatives: candidates.slice(0, 3),
    bestAlternative: candidates[0] || null
  };
}


/**
 * Evaluates agronomic health score, risks, price forecast, market opportunities,
 * policies, and tailored financial guidance strictly according to AgriCopilot Design specifications.
 */
export function generateLocalAdvisory(data = {}) {
  const {
    farmerName = 'Farmer',
    landSize = 2,
    district = 'Davanagere',
    cropName = 'Maize / Corn',
    soilType = 'red',
    temperature = 28,
    rainfall = 800,
    regionalPopularity = 50,
    soilImage = null,
    soilSampleId = null,
    soilAnalysisResult = null
  } = data || {};

  const numericLandSize = parseFloat(landSize) || 1.0;
  const numericTemp = parseFloat(temperature) || 28;
  const numericRain = parseFloat(rainfall) || 750;
  const numericPop = parseFloat(regionalPopularity) || 50;
  const districtSafe = district || 'Davanagere';

  // Retrieve crop agronomic profile
  const cropProfile = CROP_DATABASE[cropName] || {
    ...DEFAULT_CROP_TEMPLATE,
    name: cropName
  };

  const soilInfo = SOIL_TYPES.find(s => s.id === soilType) || {
    id: soilType,
    name: soilType.charAt(0).toUpperCase() + soilType.slice(1) + ' Soil',
    description: 'Local agricultural soil'
  };

  // 1. CROP HEALTH & RISK ASSESSMENT (ACCORDING TO INPUT: SOIL, TEMP, RAINFALL)
  const currentCropAgro = evaluateCropAgronomics({
    crop: cropProfile,
    soilType,
    temperature: numericTemp,
    rainfall: numericRain,
    district: districtSafe
  });

  const alternateCrops = getAlternateCropRecommendations({
    currentCropName: cropName,
    soilType,
    temperature: numericTemp,
    rainfall: numericRain,
    district: districtSafe
  });

  let healthScore = 8.5; // Baseline healthy score
  const riskFactors = [];
  let soilCompatibility = currentCropAgro.soilStatus;

  // Apply soil penalty
  if (!currentCropAgro.isIdealSoil) {
    healthScore -= currentCropAgro.soilPenalty;
    riskFactors.push(currentCropAgro.soilReason);
  }

  // Apply temperature penalty
  if (currentCropAgro.tempPenalty > 0) {
    healthScore -= currentCropAgro.tempPenalty;
    riskFactors.push(currentCropAgro.tempReason);
  }

  // Apply rainfall penalty
  if (currentCropAgro.rainPenalty > 0) {
    healthScore -= currentCropAgro.rainPenalty;
    riskFactors.push(currentCropAgro.rainReason);
  }

  // District-specific pest vulnerabilities
  const districtLower = (districtSafe || '').toLowerCase();
  const matchedPest = (cropProfile.pests || []).find(p =>
    (p.regions || []).some(r => (r || '').toLowerCase().includes(districtLower) || districtLower.includes((r || '').toLowerCase())) ||
    (p.regions || []).includes('All Districts')
  ) || (cropProfile.pests && cropProfile.pests[0]);

  if (matchedPest) {
    riskFactors.push(`Pest Alert for ${districtSafe}: Watch out for ${matchedPest.name}. Inspect the underside of leaves weekly. Spray neem oil solution or use yellow sticky traps early before pests spread.`);
  }

  // Soil image analysis & Mismatch Verification
  let soilImageAnalysis = '';
  let soilMismatchDetected = false;

  if (soilAnalysisResult && soilAnalysisResult.isMismatch) {
    soilMismatchDetected = true;
    healthScore -= 1.6;
    riskFactors.unshift(`⚠️ Soil Type Mismatch: The uploaded photo looks like "${soilAnalysisResult.detectedSoilName}", but you selected "${soilInfo.name}". Please verify your soil at your local Raitha Samparka Kendra to use the right fertilizer.`);
    soilImageAnalysis = `⚠️ Visual Check Warning: The photo shows ${soilAnalysisResult.detectedSoilName} rather than stated ${soilInfo.name}. Test your soil to avoid applying wrong fertilizers or wrong water amounts.`;
  } else if (soilImage && soilAnalysisResult) {
    soilImageAnalysis = `Visual check confirmed: The uploaded photo matches ${soilAnalysisResult.detectedSoilName}. Good texture and healthy organic matter observed.`;
  } else if (soilImage) {
    soilImageAnalysis = `Visual check completed for ${soilInfo.name}. Soil texture looks healthy with balanced moisture capacity.`;
  } else {
    soilImageAnalysis = `Soil categorized as ${soilInfo.name}. Add organic compost yearly to keep the soil fertile and soft.`;
  }

  // Clamp health score between 2 and 9.8
  healthScore = Math.max(2.0, Math.min(9.8, parseFloat(healthScore.toFixed(1))));

  // Critical severe stress factor tags from input (soil, temp, and rainfall)
  const severeStressTriggers = [];
  if (currentCropAgro.isSevereSoilStress) severeStressTriggers.push(`Incompatible soil type (${soilInfo.name})`);
  if (currentCropAgro.isSevereTempStress) severeStressTriggers.push(`Severe temperature stress (${numericTemp}°C)`);
  if (currentCropAgro.isSevereRainStress) severeStressTriggers.push(`Critical moisture imbalance (${numericRain}mm)`);

  let riskLevel = 'Low';
  if (
    healthScore < 6.0 ||
    severeStressTriggers.length >= 1 ||
    riskFactors.length >= 3 ||
    (soilMismatchDetected && healthScore < 7.0)
  ) {
    riskLevel = 'High';
  } else if (
    healthScore < 7.5 ||
    riskFactors.length >= 2 ||
    soilMismatchDetected ||
    currentCropAgro.soilPenalty > 0 ||
    currentCropAgro.tempPenalty > 0 ||
    currentCropAgro.rainPenalty > 0
  ) {
    riskLevel = 'Medium';
  }

  // 2. PRICE FORECASTING & REGIONAL POPULARITY (HARVEST TIME)
  let sentiment = 'Steady Market Demand';
  let priceMultiplierMin = 1.0;
  let priceMultiplierMax = 1.0;
  let marketTrendReasoning = '';

  const baseMin = cropProfile.basePriceRange.min;
  const baseMax = cropProfile.basePriceRange.max;

  if (numericPop > 80) {
    sentiment = 'Over-Supply Warning (Prices may drop)';
    priceMultiplierMin = 0.78;
    priceMultiplierMax = 0.85;
    marketTrendReasoning = `Heavy Sowing Alert: ${numericPop}% of farmers in your district are growing ${cropProfile.name}. When everyone brings their harvest to the mandi at once, prices can fall. Tip: Do not rush to sell all at once. Grade your produce, sell to direct buyers, or store in a warehouse to sell when prices recover.`;
  } else if (numericPop < 35) {
    sentiment = 'Good Profit Opportunity (High Demand)';
    priceMultiplierMin = 1.15;
    priceMultiplierMax = 1.28;
    marketTrendReasoning = `High Demand Opportunity: Only ${numericPop}% of local farmers planted ${cropProfile.name}. Because market supply will be limited, traders and wholesale buyers will compete to buy your produce at premium rates.`;
  } else {
    sentiment = 'Steady Market Demand';
    priceMultiplierMin = 0.95;
    priceMultiplierMax = 1.08;
    marketTrendReasoning = `Balanced Market: About ${numericPop}% of area farmers planted this crop. Production matches regular market demand, so wholesale prices should remain steady.`;
  }

  const predictedMinPrice = Math.round(baseMin * priceMultiplierMin);
  const predictedMaxPrice = Math.round(baseMax * priceMultiplierMax);
  const predictedPriceRange = `₹${predictedMinPrice.toLocaleString('en-IN')} - ₹${predictedMaxPrice.toLocaleString('en-IN')} per Quintal`;

  // 3. MARKET OPPORTUNITIES & VALUE ADDITION (CLEAR, SIMPLE TIPS)
  const opportunitySummary = `${cropProfile.valueAddition.action}: ${cropProfile.valueAddition.details} (Can boost your profit by ${cropProfile.valueAddition.estimatedMarginBoost}). Grade your produce into Grade A and Grade B to get the highest market price.`;

  // 4. GOVERNMENT POLICY & LEGAL SUPPORT
  const primaryScheme = cropProfile.schemes[0] || {
    name: 'PM-KISAN Direct Benefit Transfer',
    benefit: 'Direct financial assistance of ₹6,000 every year directly into your bank account',
    applyUrl: 'https://pmkisan.gov.in/',
    portalName: 'PM-KISAN Portal'
  };
  const secondaryScheme = cropProfile.schemes[1] || {
    name: 'PM Fasal Bima Yojana (PMFBY)',
    benefit: 'Low-cost government crop insurance protecting you against drought, flood, or pest loss',
    applyUrl: 'https://pmfby.gov.in/',
    portalName: 'PMFBY Portal'
  };

  // 5. FINANCIAL GUIDANCE (BANK LOANS)
  const isSmallholder = numericLandSize < 2.0;
  const loanPackage = isSmallholder ? LOAN_PROGRAMS.smallholder : LOAN_PROGRAMS.commercial;

  // Scale health score to percentage (out of 100%)
  const healthScorePercent = Math.min(100, Math.max(0, Math.round(healthScore * 10)));

  // GENERATE SIMPLE, EASY-TO-UNDERSTAND MARKDOWN
  const markdownOutput = `## 🌾 Farm Advisory for ${farmerName}
**District:** ${districtSafe} | **Land Size:** ${numericLandSize} Acres

### 🛠 Crop Health & Field Advice: ${cropProfile.name}
- **Health Score:** ${healthScorePercent}% (out of 100%) - ${healthScorePercent >= 75 ? 'Healthy and growing well! Weather and soil conditions are favorable for a strong harvest.' : healthScorePercent >= 55 ? 'Fair condition. The crop will grow well with proper watering and regular pest monitoring.' : 'Needs care. The crop faces weather or water stress. Follow the tips below to protect your yield.'}
- **Risk Level:** ${riskLevel} ⚠️ ${riskFactors.join(' | ')}
- **Soil Advice:** ${soilImageAnalysis}

${riskLevel === 'High' && alternateCrops.bestAlternative ? `### 🚨 High-Risk Alert & Recommended Alternate Crop: ${alternateCrops.bestAlternative.cropName}
⚠️ **High Agronomic Risk Detected on ${cropProfile.name}:**
${severeStressTriggers.length > 0 ? `- **Primary Stress Triggers:** ${severeStressTriggers.join(', ')}\n` : ''}- **Current Crop Health:** ${healthScorePercent}% (${riskLevel} Risk)
- **Observed Hazards:** ${riskFactors.join(' | ')}

💡 **Recommended Resilient Alternate Crop: ${alternateCrops.bestAlternative.cropName} (${alternateCrops.bestAlternative.category})**
Due to high agro-climatic stress on **${cropProfile.name}**, switching to **${alternateCrops.bestAlternative.cropName}** achieves **${alternateCrops.bestAlternative.suitabilityScore}% Agronomic Fit** and a projected health score of **${alternateCrops.bestAlternative.projectedHealthScore}%**.

**Suitability Match as per your inputs (Soil, Temp, Rainfall):**
- **🌱 Soil Fit (${soilInfo.name}):** ${alternateCrops.bestAlternative.soilReason} (Score: ${alternateCrops.bestAlternative.soilScore}%)
- **🌡️ Temperature Fit (${numericTemp}°C):** ${alternateCrops.bestAlternative.tempReason} (Score: ${alternateCrops.bestAlternative.tempScore}%)
- **💧 Rainfall Fit (${numericRain}mm):** ${alternateCrops.bestAlternative.rainReason} (Score: ${alternateCrops.bestAlternative.rainScore}%)
- **💰 Economic Protection:** ${alternateCrops.bestAlternative.msp ? `Government MSP assurance of ₹${alternateCrops.bestAlternative.msp.toLocaleString('en-IN')}/quintal` : `Mandi benchmark: ₹${alternateCrops.bestAlternative.basePriceRange.min.toLocaleString('en-IN')} - ₹${alternateCrops.bestAlternative.basePriceRange.max.toLocaleString('en-IN')}/quintal`}
- **🏛 Government Scheme:** ${alternateCrops.bestAlternative.primaryScheme || 'PM-KISAN & PMFBY Crop Insurance'}

${alternateCrops.topAlternatives.length > 1 ? `**Other Compatible Crop Alternatives:**
${alternateCrops.topAlternatives.slice(1, 3).map(alt => `- **${alt.cropName}**: ${alt.suitabilityScore}% Match | Projected Health: ${alt.projectedHealthScore}%`).join('\n')}
` : ''}
` : ''}### 💰 Harvest Price & Market Outlook
- **Expected Market Price:** ${predictedPriceRange}
- **Market Situation:** ${sentiment} - ${marketTrendReasoning}
- **Extra Profit Tip:** ${opportunitySummary}

### 🏛 Government Subsidies & Bank Loan
- **Government Schemes:** ${primaryScheme.name} (${primaryScheme.benefit}) | ${secondaryScheme.name} (${secondaryScheme.benefit})
- **Application Links:** [${primaryScheme.name}](${primaryScheme.applyUrl}) | [${secondaryScheme.name}](${secondaryScheme.applyUrl})
- **Recommended Bank Loan:** ${loanPackage.primaryLoan} (For ${isSmallholder ? 'Smallholder < 2 Acres' : 'Commercial Scale ≥ 2 Acres'}) - Interest: ${loanPackage.interestRate}, Limit: ${loanPackage.maxLimit}
- **Bank Loan Portal:** [${loanPackage.actionLinkText}](${loanPackage.actionLink})
`;

  return {
    timestamp: new Date().toISOString(),
    farmerProfile: {
      name: farmerName,
      landSize: numericLandSize,
      isSmallholder,
      district: districtSafe
    },
    cropDetails: {
      cropName: cropProfile.name,
      soilType: soilInfo.name,
      soilTypeId: soilType,
      temperature: numericTemp,
      rainfall: numericRain,
      regionalPopularity: numericPop,
      soilImageProvided: !!soilImage || !!soilSampleId
    },
    cropAnalysis: {
      healthScore: healthScorePercent,
      healthScorePercent,
      healthScoreScale10: healthScore,
      riskLevel,
      riskFactors,
      severeStressTriggers,
      currentCropAgro,
      soilInsight: soilImageAnalysis,
      soilCompatibility,
      soilMismatch: soilMismatchDetected,
      soilAnalysisResult,
      alternateCrops: alternateCrops.topAlternatives,
      bestAlternative: alternateCrops.bestAlternative
    },
    economicOutlook: {
      predictedPriceRange,
      predictedMinPrice,
      predictedMaxPrice,
      baseMinPrice: baseMin,
      baseMaxPrice: baseMax,
      marketSentiment: sentiment,
      marketTrendReasoning,
      opportunity: opportunitySummary,
      valueAddition: cropProfile.valueAddition
    },
    governanceAndFinance: {
      primaryScheme,
      secondaryScheme,
      allSchemes: cropProfile.schemes,
      recommendedLoan: loanPackage
    },
    markdownOutput
  };
}

/**
 * Optional Live LLM Integration using Google Gemini Multimodal API (1.5 Flash / 2.0 Flash)
 * If the user enters a Gemini API key in settings, the application calls Gemini
 * with the exact Master System Prompt and multimodal soil image payload.
 */
export async function callGeminiAdvisoryAPI({ apiKey, modelName = 'gemini-1.5-flash', formData, base64Image }) {
  if (!apiKey) {
    throw new Error('No API Key provided');
  }

  const systemInstruction = `You are AgriCopilot, an elite AI Agronomist, Market Analyst, and Government Policy Expert. Your mission is to provide hyper-localized, data-driven agricultural advisories to farmers to maximize yield and profitability while minimizing risk.

INPUT DATA STRUCTURE:
1. FARMER PROFILE: {Name, Land Size (Acres), District}
2. CROP DETAILS: {Crop Name, Soil Type, Soil Image (if provided), Temp, Rainfall, Regional Popularity %}

TASK & LOGIC FLOW:
1. Crop Health & Risk Assessment: Compare crop against soil, temp, rainfall. Analyze soil image for color, texture, visible deficiencies. Output Health Score (1-10) and specific risks.
2. High-Risk Alternate Crop Suggestion: If the risk is HIGH (due to soil incompatibility, drought/excess rainfall, or extreme heat/cold for the selected crop), you MUST recommend a resilient alternate crop from the regional knowledge base (e.g., Ragi, Jowar, Red Gram, Groundnut, Soybean, Maize, Cotton, Tomato) that thrives in the input soil, temperature, and rainfall. Detail the soil fit, temperature fit, and rainfall fit, along with economic safety (MSP or price).
3. Price Forecasting (Harvest Time): If regional popularity >80%, warn about Over-supply risk crashing harvest prices. If low (<35%), predict price surge. Output Predicted Price Range and Market Sentiment (Bullish/Bearish).
4. Market Opportunities: Alternative markets (Mandis, Direct, Export) and Value-Addition (e.g. sun-drying, pureeing for higher profit).
5. Government Policy & Legal Support: Specific policies/subsidies for crop and district.
6. Financial Guidance (Bank Loans): Filter loan recommendations based on Land Size:
   - SMALL HOLDERS (< 2 Acres): Micro-loans, KCC (Kisan Credit Cards), Cooperative Society loans.
   - MEDIUM/LARGE HOLDERS (> 2 Acres): Agri-Business loans, Equipment Financing, Commercial Crop loans.

OUTPUT FORMAT (MANDATORY):
## 🌾 AgriCopilot Advisory for [Farmer Name]
**District:** [District] | **Land Size:** [Acres] Acres

### 🛠 Crop Analysis: [Crop Name]
- **Health Status:** [Score/10] - [Brief Summary]
- **Risk Profile:** [High/Medium/Low] ⚠️ [Specific Risk Description]
- **Soil Insight:** [Analysis of soil type and image]

[IF RISK IS HIGH, INCLUDE THIS SECTION]:
### 🚨 High-Risk Alert & Recommended Alternate Crop: [Alternate Crop Name]
- **Current Crop Vulnerability:** [Why input soil, temp, or rainfall creates severe stress]
- **Recommended Alternate Crop:** [Name of resilient crop from: Ragi, Jowar, Red Gram, Groundnut, Soybean, Maize, Cotton, Tomato, Sugarcane, Wheat, Onion, Paddy]
- **Soil Fit:** [Why this alternate crop thrives in input soil]
- **Climate & Rainfall Fit:** [Why it withstands input temperature and rainfall]
- **Economic Safety:** [MSP or Mandi price return]

### 💰 Economic Outlook
- **Predicted Harvest Price:** [Price Range]
- **Market Trend:** [Analysis based on Popularity %]
- **Opportunity:** [Value addition or market tip]

### 🏛 Governance & Finance
- **Applicable Policies:** [Policy Name] → [Benefit]
- **Recommended Loan:** [Loan Type based on Land Size]
- **Action Link:** [URL to Gov/Bank Portal]
`;

  const userPrompt = `
FARMER PROFILE:
- Name: ${formData.farmerName}
- Land Size: ${formData.landSize} Acres
- District: ${formData.district}

CROP DETAILS:
- Crop Name: ${formData.cropName}
- Soil Type: ${formData.soilType}
- Temperature: ${formData.temperature}°C
- Annual/Seasonal Rainfall: ${formData.rainfall} mm
- Regional Popularity: ${formData.regionalPopularity}% of district farmers growing this crop
`;

  const contents = [
    {
      role: 'user',
      parts: [
        { text: userPrompt }
      ]
    }
  ];

  if (base64Image) {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
    contents[0].parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: cleanBase64
      }
    });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}
