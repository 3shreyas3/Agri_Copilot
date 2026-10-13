import { CROP_DATABASE, DEFAULT_CROP_TEMPLATE, SOIL_TYPES, LOAN_PROGRAMS } from '../data/agriKnowledge.js';
import { SOIL_FAMILY_COMPATIBILITY } from '../utils/trainedSoilModel.js';
import { getTranslatedCropName, getTranslatedSoilName, getTranslatedDistrict } from '../translations.js';

/**
 * Evaluates the specific agronomic compatibility of a crop against farmer inputs:
 * soilType, temperature (°C), and rainfall (mm).
 * Returns scores, penalties, statuses, and reasons tailored to the farmer's field conditions.
 */
export function evaluateCropAgronomics({ crop, soilType, temperature, rainfall, district = '', language = 'en' }) {
  const numericTemp = parseFloat(temperature) || 28;
  const numericRain = parseFloat(rainfall) || 750;
  const soilInfo = SOIL_TYPES.find(s => s.id === soilType) || { id: soilType, name: soilType.charAt(0).toUpperCase() + soilType.slice(1) + ' Soil' };
  const compatibleFamily = SOIL_FAMILY_COMPATIBILITY[soilType] || [soilType];
  const translatedSoil = getTranslatedSoilName(soilType, language) || soilInfo.name;
  const translatedCrop = getTranslatedCropName(crop.name, language) || crop.name;

  // 1. Soil Suitability Evaluation
  let soilScore = 35;
  let soilStatus = 'Incompatible Soil';
  let soilPenalty = 2.8;
  let soilReason = '';

  const isIdealSoil = (crop.idealSoils || []).includes(soilType);
  const isFamilyCompatible = (crop.idealSoils || []).some(s => compatibleFamily.includes(s));

  if (isIdealSoil) {
    soilScore = 100;
    soilPenalty = 0;
    if (language === 'kn') {
      soilStatus = 'ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ';
      soilReason = `${translatedSoil}ದಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಬೇರು ಬೆಳವಣಿಗೆ ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ಹೀರಿಕೊಳ್ಳುವಿಕೆಯೊಂದಿಗೆ ನೈಸರ್ಗಿಕವಾಗಿ ಬೆಳೆಯುತ್ತದೆ.`;
    } else if (language === 'te') {
      soilStatus = 'అత్యుత్తమ సరిపోలిక';
      soilReason = `${translatedSoil}లో సరైన వేరు అభివృద్ధి మరియు పోషకాల శోషణతో సహజంగా ఎదుగుతుంది.`;
    } else if (language === 'hi') {
      soilStatus = 'उत्तम अनुकूलता';
      soilReason = `${translatedSoil} में जड़ों के समुचित विकास और पोषक तत्वों के अवशोषण के साथ फसल खूब पनपती है।`;
    } else {
      soilStatus = 'Optimal / Highly Suitable';
      soilReason = `Naturally thrives in ${soilInfo.name} with optimal root development and nutrient absorption.`;
    }
  } else if (isFamilyCompatible) {
    soilScore = 80;
    soilPenalty = 1.2;
    if (language === 'kn') {
      soilStatus = 'ಸಾಧಾರಣ ಹೊಂದಾಣಿಕೆ (ಸಾವಯವ ಗೊಬ್ಬರ ಅಗತ್ಯ)';
      soilReason = `${translatedSoil} ಕುಟುಂಬಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ; ಬೇರಿನ ಆರೋಗ್ಯಕ್ಕಾಗಿ ನಿಯಮಿತವಾಗಿ ಸಾವಯವ ಗೊಬ್ಬರ/ಕಾಂಪೋಸ್ಟ್ ಹಾಕುವುದು ಅಗತ್ಯ.`;
    } else if (language === 'te') {
      soilStatus = 'సాధారణ సరిపోలిక (సేంద్రియ ఎరువులు అవసరం)';
      soilReason = `${translatedSoil} కుటుంబానికి సరిపోతుంది; వేరు ఆరోగ్యానికి క్రమం తప్పకుండా సేంద్రియ ఎరువులను వాడాలి.`;
    } else if (language === 'hi') {
      soilStatus = 'मध्यम अनुकूल (जैविक खाद आवश्यक)';
      soilReason = `${translatedSoil} के अनुकूल है; जड़ों के स्वास्थ्य के लिए नियमित रूप से जैविक खाद/कम्पोस्ट की आवश्यकता है।`;
    } else {
      soilStatus = 'Compatible (Conditioning Needed)';
      soilReason = `Compatible with ${soilInfo.name} family; requires regular organic manuring/compost for root health.`;
    }
  } else {
    soilScore = 35;
    soilPenalty = 2.8;
    const needed = (crop.idealSoils || []).map(s => getTranslatedSoilName(s, language)).join(', ');
    if (language === 'kn') {
      soilStatus = 'ಹೊಂದಾಣಿಕೆಯಾಗದ ಮಣ್ಣು';
      soilReason = `ಮಣ್ಣಿನ ಅಸಮರ್ಪಕತೆ: ${translatedCrop}ಗೆ ${needed} ಮಣ್ಣು ಬೇಕು. ${translatedSoil} ಗಾಳಿಯಾಡುವಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.`;
    } else if (language === 'te') {
      soilStatus = 'సరిపోలని నేల';
      soilReason = `నేల సరిపోలిక లోపం: ${translatedCrop} పంటకు ${needed} నేల అవసరం. ${translatedSoil} వేర్లకు ఒత్తిడి కలిగిస్తుంది.`;
    } else if (language === 'hi') {
      soilStatus = 'अनुपयुक्त मिट्टी';
      soilReason = `मिट्टी की कमी: ${translatedCrop} के लिए ${needed} मिट्टी सर्वोत्तम है। ${translatedSoil} से जड़ें प्रभावित हो सकती हैं।`;
    } else {
      soilStatus = 'Incompatible / Severe Soil Stress';
      soilReason = `Poor soil fit: ${crop.name} requires ${(crop.idealSoils || []).join(' or ')} soil. ${soilInfo.name} causes poor aeration or moisture stress.`;
    }
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
    tempPenalty = (diffFromOpt > 4) ? 0.5 : 0;
    if (language === 'kn') {
      tempStatus = 'ಅತ್ಯುತ್ತಮ ತಾಪಮಾನ';
      tempReason = `ತಾಪಮಾನ (${numericTemp}°C) ಬೆಳೆಯ ಶಾರೀರಿಕ ಬೆಳವಣಿಗೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ (${tMin}°C - ${tMax}°C).`;
    } else if (language === 'te') {
      tempStatus = 'సరైన ఉష్ణోగ్రత';
      tempReason = `ఉష్ణోగ్రత (${numericTemp}°C) పంట ఎదుగుదలకు అనుకూలమైన పరిధిలో ఉంది (${tMin}°C - ${tMax}°C).`;
    } else if (language === 'hi') {
      tempStatus = 'इष्टतम तापमान सीमा';
      tempReason = `तापमान (${numericTemp}°C) फसल की वृद्धि के लिए पूरी तरह अनुकूल है (${tMin}°C - ${tMax}°C)।`;
    } else {
      tempStatus = 'Optimal Thermal Range';
      tempReason = `Temperature (${numericTemp}°C) is in optimal physiological range (${tMin}°C - ${tMax}°C).`;
    }
  } else if (numericTemp < tMin) {
    const deficit = tMin - numericTemp;
    if (deficit >= 6) {
      isSevereTempStress = true;
      tempScore = Math.max(10, Math.round(50 - (deficit * 7)));
      tempPenalty = Math.min(4.2, 2.0 + deficit * 0.4);
      if (language === 'kn') {
        tempStatus = 'ತೀವ್ರ ಚಳಿ / ಶೀತದ ಹೊಡೆತ';
        tempReason = `🚨 ತೀವ್ರ ಚಳಿಯ ಅಪಾಯ (${numericTemp}°C vs ಕನಿಷ್ಠ ${tMin}°C): ಬೆಳೆಯ ಬೆಳವಣಿಗೆ ಕುಂಠಿತಗೊಳ್ಳುವ ಸಾಧ್ಯತೆ ಇದೆ.`;
      } else if (language === 'te') {
        tempStatus = 'తీవ్ర చలి ప్రభావం';
        tempReason = `🚨 తీవ్ర చలి ఒత్తిడి (${numericTemp}°C vs కనీసం ${tMin}°C): పంట ఎదుగుదల మందగించి నష్టం వాటిల్లే ప్రమాదం ఉంది.`;
      } else if (language === 'hi') {
        tempStatus = 'अत्यधिक ठंड / पाला';
        tempReason = `🚨 अत्यधिक ठंड का खतरा (${numericTemp}°C vs न्यूनतम ${tMin}°C): फसल की बढ़वार रुक सकती है और पाला पड़ सकता है।`;
      } else {
        tempStatus = 'Severe Cold Shock';
        tempReason = `🚨 Severe Cold Stress (${numericTemp}°C vs min ${tMin}°C): Far below vegetative threshold; causes stunting and frost damage.`;
      }
    } else {
      tempScore = Math.max(25, Math.round(75 - (deficit * 7)));
      tempPenalty = Math.min(2.0, deficit * 0.35);
      if (language === 'kn') {
        tempStatus = 'ಸಾಧಾರಣ ಕಡಿಮೆ ತಾಪಮಾನ';
        tempReason = `ಕಡಿಮೆ ತಾಪಮಾನದ ಎಚ್ಚರಿಕೆ (${numericTemp}°C vs ಕನಿಷ್ಠ ${tMin}°C): ಮುಂಜಾನೆ ಅತಿಯಾದ ನೀರುಣಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ.`;
      } else if (language === 'te') {
        tempStatus = 'సాధారణ తక్కువ ఉష్ణోగ్రత';
        tempReason = `చల్లని వాతావరణం (${numericTemp}°C vs కనీసం ${tMin}°C): ఉదయం వేళ అధిక నీటిపారుదలని నివారించండి.`;
      } else if (language === 'hi') {
        tempStatus = 'हल्की ठंड';
        tempReason = `मौसम ठंडा है (${numericTemp}°C vs न्यूनतम ${tMin}°C): सुबह के समय अत्यधिक पानी देने से बचें।`;
      } else {
        tempStatus = 'Moderate Cool Stress';
        tempReason = `Cool Weather Alert (${numericTemp}°C vs min ${tMin}°C): Slower physiological growth; avoid early morning over-watering.`;
      }
    }
  } else {
    const excess = numericTemp - tMax;
    if (excess >= 5) {
      isSevereTempStress = true;
      tempScore = Math.max(10, Math.round(50 - (excess * 7)));
      tempPenalty = Math.min(4.5, 2.0 + excess * 0.45);
      if (language === 'kn') {
        tempStatus = 'ಅತಿಯಾದ ತಾಪಮಾನ / ಶಾಖದ ಒತ್ತಡ';
        tempReason = `🚨 ತೀವ್ರ ಶಾಖದ ಒತ್ತಡ (${numericTemp}°C vs ಗರಿಷ್ಠ ${tMax}°C): ಹೂವು ಉದುರುವಿಕೆ ಮತ್ತು ಪರಾಗಸ್ಪರ್ಶ ವೈಫಲ್ಯ ಉಂಟಾಗಬಹುದು.`;
      } else if (language === 'te') {
        tempStatus = 'తీవ్ర ఎండ ప్రభావం';
        tempReason = `🚨 తీవ్రమైన వేడి (${numericTemp}°C vs గరిష్టం ${tMax}°C): పువ్వులు రాలిపోవడం మరియు దిగుబడి తగ్గడం జరగవచ్చు.`;
      } else if (language === 'hi') {
        tempStatus = 'अत्यधिक गर्मी / लू';
        tempReason = `🚨 अत्यधिक गर्मी का तनाव (${numericTemp}°C vs अधिकतम ${tMax}°C): फूल झड़ने और परागण प्रभावित होने का खतरा है।`;
      } else {
        tempStatus = 'Extreme Heat Stress';
        tempReason = `🚨 Extreme Heat Stress (${numericTemp}°C vs max ${tMax}°C): Causes severe pollen sterility, flower abortion, and leaf scorching.`;
      }
    } else {
      tempScore = Math.max(25, Math.round(75 - (excess * 7)));
      tempPenalty = Math.min(2.2, excess * 0.35);
      if (language === 'kn') {
        tempStatus = 'ಮಧ್ಯಮ ಶಾಖದ ಒತ್ತಡ';
        tempReason = `ಬಿಸಿಲಿನ ಎಚ್ಚರಿಕೆ (${numericTemp}°C vs ಗರಿಷ್ಠ ${tMax}°C): ಬೇರುಗಳನ್ನು ತಂಪಾಗಿಡಲು ಬೆಳಿಗ್ಗೆಯೇ ನೀರುಣಿಸಿ.`;
      } else if (language === 'te') {
        tempStatus = 'మితమైన ఉష్ణోగ్రత';
        tempReason = `వేడి వాతావరణం (${numericTemp}°C vs గరిష్టం ${tMax}°C): వేర్లు చల్లగా ఉండటానికి ఉదయాన్నే నీటిని అందించండి.`;
      } else if (language === 'hi') {
        tempStatus = 'मध्यम गर्मी';
        tempReason = `गर्म मौसम चेतावनी (${numericTemp}°C vs अधिकतम ${tMax}°C): नमी बनाए रखने के लिए सुबह समय पर सिंचाई करें।`;
      } else {
        tempStatus = 'Moderate Heat Stress';
        tempReason = `Hot Weather Alert (${numericTemp}°C vs max ${tMax}°C): Requires timely morning irrigation to keep roots cool.`;
      }
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
    rainPenalty = 0;
    if (language === 'kn') {
      rainStatus = 'ಅತ್ಯುತ್ತಮ ತೇವಾಂಶ';
      rainReason = `ಮಳೆಯ ಪ್ರಮಾಣ (${numericRain}mm) ಬೆಳೆಯ ತೇವಾಂಶದ ಅಗತ್ಯಕ್ಕೆ ಪೂರಕವಾಗಿದೆ (${rMin}mm - ${rMax}mm).`;
    } else if (language === 'te') {
      rainStatus = 'సరైన తేమ';
      rainReason = `వర్షపాతం (${numericRain}మి.మీ) పంట నీటి అవసరాలకు అనుగుణంగా ఉంది (${rMin}మి.మీ - ${rMax}మి.మీ).`;
    } else if (language === 'hi') {
      rainStatus = 'इष्टतम नमी';
      rainReason = `वर्षा की मात्रा (${numericRain}मिमी) फसल की जल आवश्यकता के अनुकूल है (${rMin}मिमी - ${rMax}मिमी)।`;
    } else {
      rainStatus = 'Optimal Moisture';
      rainReason = `Rainfall (${numericRain}mm) fits moisture needs (${rMin}mm - ${rMax}mm).`;
    }
  } else if (numericRain < rMin) {
    const deficit = rMin - numericRain;
    const percentDeficit = Math.round((deficit / rMin) * 100);

    if (percentDeficit >= 35) {
      isSevereRainStress = true;
      rainScore = Math.max(10, Math.round(50 - (percentDeficit * 0.6)));
      rainPenalty = Math.min(4.5, 2.0 + (percentDeficit / 100) * 3.5);
      if (language === 'kn') {
        rainStatus = 'ತೀವ್ರ ಬರ / ನೀರಿನ ಕೊರತೆ';
        rainReason = `🚨 ತೀವ್ರ ನೀರಿನ ಕೊರತೆ (${numericRain}mm vs ಕನಿಷ್ಠ ${rMin}mm): ${percentDeficit}% ಮಳೆ ಕೊರತೆಯಿದೆ! ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಅಗತ್ಯ.`;
      } else if (language === 'te') {
        rainStatus = 'తీవ్ర వర్షాభావం / కరవు';
        rainReason = `🚨 తీవ్రమైన నీటి కొరత (${numericRain}మి.మీ vs కనీసం ${rMin}మి.మీ): ${percentDeficit}% వర్షపాతం లోటు! బిందు సేద్యం అవసరం.`;
      } else if (language === 'hi') {
        rainStatus = 'गंभीर सूखा / पानी की कमी';
        rainReason = `🚨 भारी जल संकट (${numericRain}मिमी vs न्यूनतम ${rMin}मिमी): ${percentDeficit}% वर्षा की कमी! ड्रिप सिंचाई जरूरी है।`;
      } else {
        rainStatus = 'Severe Drought / Moisture Deficit';
        rainReason = `🚨 Acute Drought Hazard (${numericRain}mm vs ${rMin}mm min): ${percentDeficit}% rainfall deficit! Severe moisture stress and yield failure without intensive irrigation.`;
      }
    } else {
      rainScore = Math.max(20, Math.round(75 - ((deficit / 150) * 15)));
      rainPenalty = Math.min(2.0, (deficit / 200) * 0.8);
      if (language === 'kn') {
        rainStatus = 'ಮಧ್ಯಮ ನೀರಿನ ಕೊರತೆ';
        rainReason = `ಕಡಿಮೆ ಮಳೆಯ ಎಚ್ಚರಿಕೆ (${numericRain}mm vs ಸೂಕ್ತ ${rOpt}mm): ಹೆಚ್ಚುವರಿ ಹನಿ ನೀರಾವರಿ ಅಗತ್ಯ.`;
      } else if (language === 'te') {
        rainStatus = 'మితమైన నీటి కొరత';
        rainReason = `వర్షపాతం తక్కువగా ఉంది (${numericRain}మి.మీ vs కావలసినది ${rOpt}మి.మీ): అదనపు నీటి తడులు అవసరం.`;
      } else if (language === 'hi') {
        rainStatus = 'मध्यम पानी की कमी';
        rainReason = `कम बारिश चेतावनी (${numericRain}मिमी vs इष्टतम ${rOpt}मिमी): अतिरिक्त सिंचाई की आवश्यकता है।`;
      } else {
        rainStatus = 'Moderate Moisture Deficit';
        rainReason = `Low Rainfall Alert (${numericRain}mm vs optimal ${rOpt}mm): Supplemental drip/furrow watering required.`;
      }
    }
  } else {
    const excess = numericRain - rMax;
    const percentExcess = Math.round((excess / rMax) * 100);

    if (percentExcess >= 40) {
      isSevereRainStress = true;
      rainScore = Math.max(15, Math.round(50 - (percentExcess * 0.5)));
      rainPenalty = Math.min(4.2, 2.0 + (percentExcess / 100) * 2.5);
      if (language === 'kn') {
        rainStatus = 'ನೀರು ನಿಲ್ಲುವ ಗಂಭೀರ ಅಪಾಯ';
        rainReason = `🚨 ಅತಿಯಾದ ನೀರಿನ ಎಚ್ಚರಿಕೆ (${numericRain}mm vs ಗರಿಷ್ಠ ${rMax}mm): ನೀರು ನಿಂತು ಬೇರು ಕೊಳೆಯುವ ಅಪಾಯವಿದೆ.`;
      } else if (language === 'te') {
        rainStatus = 'నీరు నిలిచిపోయే ప్రమాదం';
        rainReason = `🚨 అధిక వర్షపాతం హెచ్చరిక (${numericRain}మి.మీ vs గరిష్టం ${rMax}మి.మీ): నీరు నిల్వ ఉండి వేరు కుళ్ళు తెగులు వచ్చే అవకాశం ఉంది.`;
      } else if (language === 'hi') {
        rainStatus = 'जलभराव का भारी खतरा';
        rainReason = `🚨 अत्यधिक जलभराव चेतावनी (${numericRain}मिमी vs अधिकतम ${rMax}मिमी): खेत में पानी भरने से जड़ सड़न का खतरा है।`;
      } else {
        rainStatus = 'Severe Waterlogging / Flood';
        rainReason = `🚨 Severe Waterlogging Alert (${numericRain}mm vs ${rMax}mm max): Standing water will rot roots, induce fungal collar rot, and cause lodging.`;
      }
    } else {
      rainScore = Math.max(25, Math.round(75 - ((excess / 200) * 15)));
      rainPenalty = Math.min(1.8, (excess / 250) * 0.8);
      if (language === 'kn') {
        rainStatus = 'ಹೆಚ್ಚುವರಿ ಮಳೆ';
        rainReason = `ಹೆಚ್ಚು ಮಳೆಯ ಎಚ್ಚರಿಕೆ (${numericRain}mm vs ಗರಿಷ್ಠ ${rMax}mm): ನೀರು ಹರಿದು ಹೋಗಲು ಬಸಿಗಾಲುವೆಗಳನ್ನು ಮಾಡಿ.`;
      } else if (language === 'te') {
        rainStatus = 'అధిక వర్షపాతం';
        rainReason = `అధిక వర్షం (${numericRain}మి.మీ vs గరిష్టం ${rMax}మి.మీ): నీరు బయటకు పోవడానికి కాల్వలు ఏర్పాటు చేయండి.`;
      } else if (language === 'hi') {
        rainStatus = 'अत्यधिक वर्षा';
        rainReason = `भारी बारिश चेतावनी (${numericRain}मिमी vs अधिकतम ${rMax}मिमी): जलनिकासी की उचित व्यवस्था करें।`;
      } else {
        rainStatus = 'Moderate Excess Rain';
        rainReason = `Heavy Rain Warning (${numericRain}mm vs optimal max ${rMax}mm): Excess water stagnating; drainage furrows needed.`;
      }
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
 */
export function getAlternateCropRecommendations({ currentCropName, soilType, temperature, rainfall, district = '', language = 'en' }) {
  const numericTemp = parseFloat(temperature) || 28;
  const numericRain = parseFloat(rainfall) || 750;
  const candidates = [];

  for (const [key, crop] of Object.entries(CROP_DATABASE)) {
    if (key === currentCropName || crop.name === currentCropName) continue;

    const agro = evaluateCropAgronomics({
      crop,
      soilType,
      temperature: numericTemp,
      rainfall: numericRain,
      district,
      language
    });

    const projectedHealthScore = Math.round(
      Math.max(30, Math.min(96, (agro.suitabilityScore * 0.85) + (agro.isIdealSoil ? 12 : 4)))
    );

    const translatedCropTitle = getTranslatedCropName(key, language) || crop.name;

    candidates.push({
      cropKey: key,
      cropName: translatedCropTitle,
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
      advantages: []
    });
  }

  candidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    topAlternatives: candidates.slice(0, 3),
    bestAlternative: candidates[0] || null
  };
}

/**
 * Evaluates agronomic health score, risks, price forecast, market opportunities,
 * policies, and tailored financial guidance in the requested language (en, kn, te, hi).
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
    soilAnalysisResult = null,
    language = 'en'
  } = data || {};

  const numericLandSize = parseFloat(landSize) || 1.0;
  const numericTemp = parseFloat(temperature) || 28;
  const numericRain = parseFloat(rainfall) || 750;
  const numericPop = parseFloat(regionalPopularity) || 50;
  const districtSafe = district || 'Davanagere';

  const translatedDistrict = getTranslatedDistrict(districtSafe, language) || districtSafe;
  const translatedCrop = getTranslatedCropName(cropName, language) || cropName;
  const translatedSoil = getTranslatedSoilName(soilType, language) || `${soilType} Soil`;

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

  // 1. CROP HEALTH & RISK ASSESSMENT
  const currentCropAgro = evaluateCropAgronomics({
    crop: cropProfile,
    soilType,
    temperature: numericTemp,
    rainfall: numericRain,
    district: districtSafe,
    language
  });

  const alternateCrops = getAlternateCropRecommendations({
    currentCropName: cropName,
    soilType,
    temperature: numericTemp,
    rainfall: numericRain,
    district: districtSafe,
    language
  });

  let healthScore = 8.5;
  const riskFactors = [];
  let soilCompatibility = currentCropAgro.soilStatus;

  if (!currentCropAgro.isIdealSoil) {
    healthScore -= currentCropAgro.soilPenalty;
    riskFactors.push(currentCropAgro.soilReason);
  }

  if (currentCropAgro.tempPenalty > 0) {
    healthScore -= currentCropAgro.tempPenalty;
    riskFactors.push(currentCropAgro.tempReason);
  }

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
    if (language === 'kn') {
      riskFactors.push(`${translatedDistrict} ಕೀಟ ಎಚ್ಚರಿಕೆ: ${matchedPest.name} ಬಾಧೆಯ ಸಾಧ್ಯತೆಯಿದೆ. ವಾರಕ್ಕೊಮ್ಮೆ ಎಲೆಗಳ ಕೆಳಭಾಗವನ್ನು ಪರೀಕ್ಷಿಸಿ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.`);
    } else if (language === 'te') {
      riskFactors.push(`${translatedDistrict} తెగుళ్ల హెచ్చరిక: ${matchedPest.name} ఆశించే ప్రమాదం ఉంది. ఆకుల కింద భాగాన్ని పరిశీలించి వేపనూనె ద్రావణం పిచికారీ చేయండి.`);
    } else if (language === 'hi') {
      riskFactors.push(`${translatedDistrict} कीट चेतावनी: ${matchedPest.name} का प्रकोप हो सकता है। पत्तियों के नीचे साप्ताहिक जांच करें व नीम तेल का छिड़काव करें।`);
    } else {
      riskFactors.push(`Pest Alert for ${districtSafe}: Watch out for ${matchedPest.name}. Inspect underside of leaves weekly. Spray neem oil solution early.`);
    }
  }

  // Soil image analysis & Mismatch Verification
  let soilImageAnalysis = '';
  let soilMismatchDetected = false;

  if (soilAnalysisResult && soilAnalysisResult.isMismatch) {
    soilMismatchDetected = true;
    healthScore -= 1.6;
    if (language === 'kn') {
      riskFactors.unshift(`⚠️ ಮಣ್ಣಿನ ಹೊಂದಾಣಿಕೆ ಕೊರತೆ: ಫೋಟೋ ${soilAnalysisResult.detectedSoilName} ನಂತೆ ಕಾಣುತ್ತಿದೆ, ಆದರೆ ಆಯ್ಕೆ ${translatedSoil} ಆಗಿದೆ. ರಸಗೊಬ್ಬರ ನಿರ್ವಹಣೆ ಪರಿಶೀಲಿಸಿ.`);
      soilImageAnalysis = `⚠️ ಮಣ್ಣಿನ ಎಚ್ಚರಿಕೆ: ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೋಟೋ ${soilAnalysisResult.detectedSoilName} ಸೂಚಿಸುತ್ತದೆ. ತಪ್ಪು ಗೊಬ್ಬರ ಬಳಕೆಯನ್ನು ತಡೆಯಲು ಪರೀಕ್ಷಿಸಿ.`;
    } else if (language === 'te') {
      riskFactors.unshift(`⚠️ నేల రకం వ్యత్యాసం: ఫోటో ${soilAnalysisResult.detectedSoilName} లా కనిపిస్తోంది, కానీ మీరు ${translatedSoil} ఎంచుకున్నారు.`);
      soilImageAnalysis = `⚠️ నేల పరిశీలన హెచ్చరిక: ఫోటో ${soilAnalysisResult.detectedSoilName} అని సూచిస్తోంది. తప్పుడు ఎరువుల వాడకం నివారించండి.`;
    } else if (language === 'hi') {
      riskFactors.unshift(`⚠️ मिट्टी का बेमेल: फोटो ${soilAnalysisResult.detectedSoilName} जैसी दिख रही है, जबकि आपने ${translatedSoil} चुना है।`);
      soilImageAnalysis = `⚠️ मिट्टी दृश्य जांच: फोटो ${soilAnalysisResult.detectedSoilName} दर्शाती है। गलत उर्वरक प्रयोग से बचें।`;
    } else {
      riskFactors.unshift(`⚠️ Soil Type Mismatch: The uploaded photo looks like "${soilAnalysisResult.detectedSoilName}", but you selected "${soilInfo.name}".`);
      soilImageAnalysis = `⚠️ Visual Check Warning: The photo shows ${soilAnalysisResult.detectedSoilName} rather than stated ${soilInfo.name}. Test soil to avoid wrong fertilizers.`;
    }
  } else if (soilImage && soilAnalysisResult) {
    if (language === 'kn') {
      soilImageAnalysis = `ಮಣ್ಣಿನ ಪರಿಶೀಲನೆ ಖಚಿತವಾಗಿದೆ: ಫೋಟೋ ${translatedSoil}ಗೆ ಹೊಂದಿಕೆಯಾಗಿದೆ. ಉತ್ತಮ ಸಾವಯವ ಅಂಶ ಮತ್ತು ವಿನ್ಯಾಸವಿದೆ.`;
    } else if (language === 'te') {
      soilImageAnalysis = `నేల పరిశీలన విజయవంతమైంది: ఫోటో ${translatedSoil}కి సరిపోలింది. సేంద్రీయ పదార్థం సమతుల్యంగా ఉంది.`;
    } else if (language === 'hi') {
      soilImageAnalysis = `मिट्टी की दृश्य पुष्टि: फोटो ${translatedSoil} से पूरी तरह मेल खाती है। अच्छी बनावट और जैविक तत्व मौजूद हैं।`;
    } else {
      soilImageAnalysis = `Visual check confirmed: The uploaded photo matches ${soilAnalysisResult.detectedSoilName}. Good texture and healthy organic matter observed.`;
    }
  } else {
    if (language === 'kn') {
      soilImageAnalysis = `ಮಣ್ಣಿನ ಪ್ರಕಾರ ${translatedSoil}. ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಕಾಪಾಡಲು ವಾರ್ಷಿಕವಾಗಿ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಹಾಕಿ.`;
    } else if (language === 'te') {
      soilImageAnalysis = `నేల రకం ${translatedSoil}. నేల సారవంతాన్ని కాపాడటానికి ప్రతి సంవత్సరం పశువుల ఎరువు వేయండి.`;
    } else if (language === 'hi') {
      soilImageAnalysis = `मिट्टी ${translatedSoil} है। मिट्टी को उपजाऊ और मुलायम बनाए रखने के लिए प्रतिवर्ष गोबर की खाद डालें।`;
    } else {
      soilImageAnalysis = `Soil categorized as ${soilInfo.name}. Add organic compost yearly to keep the soil fertile and soft.`;
    }
  }

  healthScore = Math.max(2.0, Math.min(9.8, parseFloat(healthScore.toFixed(1))));

  let riskLevel = 'Low';
  if (healthScore < 6.0 || riskFactors.length >= 3 || (soilMismatchDetected && healthScore < 7.0)) {
    riskLevel = 'High';
  } else if (healthScore < 7.5 || riskFactors.length >= 2 || soilMismatchDetected) {
    riskLevel = 'Medium';
  }

  // 2. PRICE FORECASTING & MARKET SENTIMENT
  let sentiment = 'Steady Market Demand';
  let priceMultiplierMin = 1.0;
  let priceMultiplierMax = 1.0;
  let marketTrendReasoning = '';

  const baseMin = cropProfile.basePriceRange.min;
  const baseMax = cropProfile.basePriceRange.max;

  if (numericPop > 80) {
    priceMultiplierMin = 0.78;
    priceMultiplierMax = 0.85;
    if (language === 'kn') {
      sentiment = 'ಹೆಚ್ಚಿನ ಆವಕದ ಎಚ್ಚರಿಕೆ (ದರ ಕುಸಿಯುವ ಸಾಧ್ಯತೆ)';
      marketTrendReasoning = `ಅತಿಯಾದ ಬಿತ್ತನೆ ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ ಜಿಲ್ಲೆಯಲ್ಲಿ ${numericPop}% ರೈತರು ${translatedCrop} ಬೆಳೆದಿದ್ದಾರೆ. ಎಲ್ಲರೂ ಒಮ್ಮೆಲೇ ಮಂಡಿಗೆ ತಂದರೆ ಬೆಲೆ ಕುಸಿಯಬಹುದು. ಸಲಹೆ: ಗ್ರೇಡಿಂಗ್ ಮಾಡಿ, ನೇರ ಗ್ರಾಹಕರಿಗೆ ಅಥವಾ ಗೋದಾಮಿನಲ್ಲಿಟ್ಟು ಬೆಲೆ ಏರಿದಾಗ ಮಾರಿ.`;
    } else if (language === 'te') {
      sentiment = 'అధిక సరఫరా హెచ్చరిక (ధరలు తగ్గే ప్రమాదం)';
      marketTrendReasoning = `భారీ సాగు హెచ్చరిక: మీ జిల్లాలో ${numericPop}% రైతులు ${translatedCrop} సాగు చేశారు. ఒకేసారి మార్కెట్‌కు తేవడం వల్ల ధరలు పడిపోవచ్చు. సలహా: గ్రేడింగ్ చేసి ప్రత్యక్షంగా అమ్మడం లేదా గిడ్డంగులలో నిల్వ ఉంచండి.`;
    } else if (language === 'hi') {
      sentiment = 'अत्यधिक आवक चेतावनी (भाव गिरने का खतरा)';
      marketTrendReasoning = `बंपर बुवाई चेतावनी: आपके जिले में ${numericPop}% किसानों ने ${translatedCrop} बोई है। मंडी में एक साथ ज्यादा आवक से दाम गिर सकते हैं। ग्रेडिंग करें या सुरक्षित भंडारण कर बाद में बेचें।`;
    } else {
      sentiment = 'Over-Supply Warning (Prices may drop)';
      marketTrendReasoning = `Heavy Sowing Alert: ${numericPop}% of farmers in your district are growing ${cropProfile.name}. Avoid distress selling by grading and storing produce.`;
    }
  } else if (numericPop < 35) {
    priceMultiplierMin = 1.15;
    priceMultiplierMax = 1.28;
    if (language === 'kn') {
      sentiment = 'ಉತ್ತಮ ಲಾಭದ ಅವಕಾಶ (ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ)';
      marketTrendReasoning = `ಹೆಚ್ಚಿನ ಬೇಡಿಕೆಯ ಅವಕಾಶ: ಜಿಲ್ಲೆಯಲ್ಲಿ ಕೇವಲ ${numericPop}% ರೈತರು ಮಾತ್ರ ${translatedCrop} ಬೆಳೆದಿದ್ದಾರೆ. ಆವಕ ಕಡಿಮೆಯಿರುವುದರಿಂದ ಉತ್ತಮ ಧಾರಣೆ ಸಿಗಲಿದೆ.`;
    } else if (language === 'te') {
      sentiment = 'మంచి లాభాల అవకాశం (అధిక డిమాండ్)';
      marketTrendReasoning = `అధిక డిమాండ్ అవకాశం: స్థానికంగా కేవలం ${numericPop}% మంది మాత్రమే ${translatedCrop} వేశారు. సరఫరా తక్కువగా ఉన్నందున వ్యాపారులు మంచి ధర చెల్లిస్తారు.`;
    } else if (language === 'hi') {
      sentiment = 'अच्छा मुनाफा अवसर (मजबूत मांग)';
      marketTrendReasoning = `मजबूत मांग अवसर: केवल ${numericPop}% किसानों ने ${translatedCrop} लगाई है। बाजार में सीमित आवक के कारण ऊंचे दाम मिलने की पूरी संभावना है।`;
    } else {
      sentiment = 'Good Profit Opportunity (High Demand)';
      marketTrendReasoning = `High Demand Opportunity: Only ${numericPop}% of local farmers planted ${cropProfile.name}. Limited supply will push auction rates higher.`;
    }
  } else {
    priceMultiplierMin = 0.95;
    priceMultiplierMax = 1.08;
    if (language === 'kn') {
      sentiment = 'ಸ್ಥಿರ ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ';
      marketTrendReasoning = `ಸಮತೋಲಿತ ಮಾರುಕಟ್ಟೆ: ಸುಮಾರು ${numericPop}% ರೈತರು ಈ ಬೆಳೆ ಬೆಳೆದಿದ್ದಾರೆ. ಆವಕ ಮತ್ತು ಬೇಡಿಕೆ ಸಮತೋಲನದಲ್ಲಿದ್ದು ದರಗಳು ಸ್ಥಿರವಾಗಿರುತ್ತವೆ.`;
    } else if (language === 'te') {
      sentiment = 'స్థిరమైన మార్కెట్ ధరలు';
      marketTrendReasoning = `సమతుల్య మార్కెట్: దాదాపు ${numericPop}% మంది రైతులు ఈ పంట సాగు చేశారు. ఉత్పత్తి మరియు డిమాండ్ స్థిరంగా ఉంటాయి.`;
    } else if (language === 'hi') {
      sentiment = 'स्थिर मंडी मांग';
      marketTrendReasoning = `संतुलित बाजार: लगभग ${numericPop}% किसानों ने यह फसल लगाई है। आवक और मांग संतुलित रहने से भाव स्थिर रहेंगे।`;
    } else {
      sentiment = 'Steady Market Demand';
      marketTrendReasoning = `Balanced Market: About ${numericPop}% of area farmers planted this crop. Prices should remain steady.`;
    }
  }

  const predictedMinPrice = Math.round(baseMin * priceMultiplierMin);
  const predictedMaxPrice = Math.round(baseMax * priceMultiplierMax);
  const perQtlText = language === 'kn' ? 'ಕ್ವಿಂಟಾಲ್‌ಗೆ' : language === 'te' ? 'క్వింటాల్‌కు' : language === 'hi' ? 'प्रति क्विंटल' : 'per Quintal';
  const predictedPriceRange = `₹${predictedMinPrice.toLocaleString('en-IN')} - ₹${predictedMaxPrice.toLocaleString('en-IN')} ${perQtlText}`;

  // 3. VALUE ADDITION & OPPORTUNITY
  let opportunitySummary = '';
  if (language === 'kn') {
    opportunitySummary = `${cropProfile.valueAddition.action}: ${cropProfile.valueAddition.details} (ನಿವ್ವಳ ಲಾಭವನ್ನು ${cropProfile.valueAddition.estimatedMarginBoost} ಹೆಚ್ಚಿಸಬಹುದು). ಉತ್ತಮ ಬೆಲೆಗೆ ಗ್ರೇಡಿಂಗ್ ಮಾಡಿ ಮಾರಾಟ ಮಾಡಿ.`;
  } else if (language === 'te') {
    opportunitySummary = `${cropProfile.valueAddition.action}: ${cropProfile.valueAddition.details} (మీ లాభాన్ని ${cropProfile.valueAddition.estimatedMarginBoost} పెంచుకోవచ్చు). గ్రేడ్ చేసి మార్కెట్లో విక్రయించండి.`;
  } else if (language === 'hi') {
    opportunitySummary = `${cropProfile.valueAddition.action}: ${cropProfile.valueAddition.details} (यह आपके मुनाफे को ${cropProfile.valueAddition.estimatedMarginBoost} तक बढ़ा सकता है)। उत्पाद की ग्रेडिंग करके बेचें।`;
  } else {
    opportunitySummary = `${cropProfile.valueAddition.action}: ${cropProfile.valueAddition.details} (Can boost profit by ${cropProfile.valueAddition.estimatedMarginBoost}).`;
  }

  // 4. SCHEMES & LOANS
  const isSmallholder = numericLandSize < 2.0;
  const loanPackage = isSmallholder ? LOAN_PROGRAMS.smallholder : LOAN_PROGRAMS.commercial;
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

  const healthScorePercent = Math.min(100, Math.max(0, Math.round(healthScore * 10)));

  // GENERATE FULL MARKDOWN REPORT
  const markdownOutput = `## 🌾 Farm Advisory for ${farmerName}
**District:** ${translatedDistrict} | **Land Size:** ${numericLandSize} Acres (${isSmallholder ? 'Smallholder < 2 Ac' : 'Commercial Scale ≥ 2 Ac'})

### 🛠 Crop Health & Field Advice: ${translatedCrop}
- **Health Score:** ${healthScorePercent}% (out of 100%)
- **Risk Level:** ${riskLevel}
- **Observed Risk Factors:** ${riskFactors.join(' | ')}
- **Soil Status & Insight:** ${soilImageAnalysis}

${riskLevel === 'High' && alternateCrops.bestAlternative ? `### 🚨 High-Risk Alternate Crop Recommendation: ${alternateCrops.bestAlternative.cropName}
- **Suitability Match:** ${alternateCrops.bestAlternative.suitabilityScore}% Fit | Projected Health: ${alternateCrops.bestAlternative.projectedHealthScore}%
- **Soil Fit:** ${alternateCrops.bestAlternative.soilReason}
- **Temperature Fit:** ${alternateCrops.bestAlternative.tempReason}
- **Rainfall Fit:** ${alternateCrops.bestAlternative.rainReason}
- **Economic Safety:** ${alternateCrops.bestAlternative.msp ? `MSP ₹${alternateCrops.bestAlternative.msp.toLocaleString('en-IN')}/quintal` : `Mandi ₹${alternateCrops.bestAlternative.basePriceRange.min.toLocaleString('en-IN')} - ₹${alternateCrops.bestAlternative.basePriceRange.max.toLocaleString('en-IN')}`}
` : ''}
### 💰 Harvest Price & Economic Outlook
- **Expected Harvest Price:** ${predictedPriceRange}
- **Market Situation:** ${sentiment}
- **Market Trend:** ${marketTrendReasoning}
- **Value Addition Tip:** ${opportunitySummary}

### 🏛 Government Policies & Bank Loans
- **Eligible Schemes:** ${primaryScheme.name} (${primaryScheme.benefit}) | ${secondaryScheme.name} (${secondaryScheme.benefit})
- **Recommended Loan Facility:** ${loanPackage.primaryLoan} (Interest: ${loanPackage.interestRate}, Limit: ${loanPackage.maxLimit})
- **Application Portal:** ${loanPackage.actionLink}
`;

  return {
    timestamp: new Date().toISOString(),
    language,
    farmerProfile: {
      name: farmerName,
      landSize: numericLandSize,
      isSmallholder,
      district: districtSafe,
      translatedDistrict
    },
    cropDetails: {
      cropName: translatedCrop,
      rawCropKey: cropName,
      soilType: translatedSoil,
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
      severeStressTriggers: [],
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
 * Optional Live LLM Integration using Google Gemini Multimodal API
 */
export async function callGeminiAdvisoryAPI({ apiKey, modelName = 'gemini-1.5-flash', formData, base64Image, language = 'en' }) {
  if (!apiKey) {
    throw new Error('No API Key provided');
  }

  const langNames = { en: 'English', kn: 'Kannada', te: 'Telugu', hi: 'Hindi' };
  const targetLanguage = langNames[language] || 'English';

  const systemInstruction = `You are AgriCopilot, an elite AI Agronomist, Market Analyst, and Government Policy Expert for Indian Agriculture. 
Provide your response strictly in ${targetLanguage}.
Provide hyper-localized, data-driven agricultural advisory for yield, disease prevention, harvest price forecasting, and loan guidance.`;

  const userPrompt = `
FARMER PROFILE:
- Name: ${formData.farmerName}
- Land Size: ${formData.landSize} Acres
- District: ${formData.district}

CROP DETAILS:
- Crop Name: ${formData.cropName}
- Soil Type: ${formData.soilType}
- Temperature: ${formData.temperature}°C
- Rainfall: ${formData.rainfall} mm
- Regional Popularity: ${formData.regionalPopularity}%
- Language Requested: ${targetLanguage}
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
