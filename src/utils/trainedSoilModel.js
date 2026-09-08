/**
 * AgriCopilot Trained Soil Vision ML Classifier
 * 
 * Trained on multi-dimensional pedological soil colorimetric and textural feature vectors:
 * 1. CIE-L*a*b* Perceptual Uniform Color Space (Munsell Soil Standard)
 * 2. Gray-World Normalized Chromaticity (r, g, b) for lighting & shadow invariance
 * 3. Ferric Iron Oxide Hematite Redness Index (RI)
 * 4. Soil Organic Carbon / Humus Darkness Index (SOC)
 * 5. Spatial Texture Granularity via Laplacian variance & high-frequency edge density
 * 
 * Uses Centroid Distance with Scaled Covariance Vectors & Softmax Probability Distribution.
 */

// Trained Centroids and Variance Weights for the 6 Major Indian Soil Classes
export const TRAINED_SOIL_CLASSES = {
  black: {
    id: 'black',
    name: 'Black Soil (Regur / Vertisols)',
    shortName: 'Black Regur',
    family: 'clay_montmorillonite',
    description: 'Montmorillonite clay-rich dark soil, moisture retentive with deep shrink-swell clod structure.',
    colorHex: '#3a342f',
    weights: {
      L: 24.0,
      a: 2.2,
      b: 5.5,
      rNorm: 0.360,
      gNorm: 0.330,
      bNorm: 0.310,
      rednessIdx: 0.04,
      organicIdx: 0.76,
      roughness: 24.0
    },
    tolerances: {
      L: 8.0,
      a: 4.0,
      b: 5.0,
      rNorm: 0.040,
      gNorm: 0.030,
      bNorm: 0.030,
      rednessIdx: 0.05,
      organicIdx: 0.15,
      roughness: 10.0
    },
    agronomicTraits: {
      organicMatter: 'High (Humus Rich)',
      texture: 'Dense Shrink-Swell Heavy Clay',
      drainage: 'Slow Drainage / High Moisture Hold',
      fertility: 'High Potash, Calcium & Magnesium'
    }
  },

  red: {
    id: 'red',
    name: 'Red & Yellow Soil (Alfisols)',
    shortName: 'Red Soil',
    family: 'ferric_iron',
    description: 'Formed from crystalline parent rocks, characterized by ferric iron oxide (hematite) reddish-ochre hues.',
    colorHex: '#a8422b',
    weights: {
      L: 44.0,
      a: 36.0,
      b: 32.0,
      rNorm: 0.510,
      gNorm: 0.280,
      bNorm: 0.210,
      rednessIdx: 0.29,
      organicIdx: 0.45,
      roughness: 18.0
    },
    tolerances: {
      L: 10.0,
      a: 8.0,
      b: 8.0,
      rNorm: 0.050,
      gNorm: 0.040,
      bNorm: 0.040,
      rednessIdx: 0.08,
      organicIdx: 0.15,
      roughness: 9.0
    },
    agronomicTraits: {
      organicMatter: 'Low to Medium',
      texture: 'Friable Crumbly Loam',
      drainage: 'Good Aeration / Free Draining',
      fertility: 'Rich in Iron & Potash, Low Nitrogen & Phosphorus'
    }
  },

  laterite: {
    id: 'laterite',
    name: 'Laterite Soil (Oxisols / Ultisols)',
    shortName: 'Laterite',
    family: 'ferric_iron',
    description: 'Deeply leached rusty brick-red soil rich in iron and aluminum sesquioxides with gravelly vesicular aggregates.',
    colorHex: '#782d1c',
    weights: {
      L: 30.0,
      a: 30.0,
      b: 25.0,
      rNorm: 0.520,
      gNorm: 0.270,
      bNorm: 0.210,
      rednessIdx: 0.32,
      organicIdx: 0.55,
      roughness: 24.0
    },
    tolerances: {
      L: 8.0,
      a: 7.0,
      b: 7.0,
      rNorm: 0.050,
      gNorm: 0.040,
      bNorm: 0.040,
      rednessIdx: 0.08,
      organicIdx: 0.15,
      roughness: 10.0
    },
    agronomicTraits: {
      organicMatter: 'Low (Intense Leaching)',
      texture: 'Gravelly Porous Aggregates',
      drainage: 'Rapid Percolation / Low Retention',
      fertility: 'Acidic, Requires Lime & Organic Manuring'
    }
  },

  sandy_loam: {
    id: 'sandy_loam',
    name: 'Sandy Loam Soil (Arenosols)',
    shortName: 'Sandy Loam',
    family: 'light_coarse',
    description: 'Light, pale golden-tan soil with high quartz sand proportion, high reflectance and excellent aeration.',
    colorHex: '#c4a47c',
    weights: {
      L: 68.0,
      a: 7.0,
      b: 25.0,
      rNorm: 0.405,
      gNorm: 0.355,
      bNorm: 0.240,
      rednessIdx: 0.07,
      organicIdx: 0.24,
      roughness: 16.0
    },
    tolerances: {
      L: 12.0,
      a: 5.0,
      b: 7.0,
      rNorm: 0.040,
      gNorm: 0.040,
      bNorm: 0.040,
      rednessIdx: 0.05,
      organicIdx: 0.14,
      roughness: 8.0
    },
    agronomicTraits: {
      organicMatter: 'Low Organic Base',
      texture: 'Coarse Granular / High Sand Ratio',
      drainage: 'Very Fast Draining / Needs Frequent Watering',
      fertility: 'Easily Worked, Ideal for Tubers & Groundnut'
    }
  },

  clayey: {
    id: 'clayey',
    name: 'Clayey Soil (Pelosols / Heavy Clay)',
    shortName: 'Clayey Soil',
    family: 'clay_montmorillonite',
    description: 'Fine colloidal dense matrix with uniform grey-brown to muddy tones and high water-holding capacity.',
    colorHex: '#5a5043',
    weights: {
      L: 35.0,
      a: 2.5,
      b: 9.0,
      rNorm: 0.370,
      gNorm: 0.335,
      bNorm: 0.295,
      rednessIdx: 0.05,
      organicIdx: 0.60,
      roughness: 14.0
    },
    tolerances: {
      L: 8.0,
      a: 4.0,
      b: 5.0,
      rNorm: 0.040,
      gNorm: 0.030,
      bNorm: 0.030,
      rednessIdx: 0.05,
      organicIdx: 0.15,
      roughness: 8.0
    },
    agronomicTraits: {
      organicMatter: 'Moderate to High',
      texture: 'Dense Sticky Colloidal Clay',
      drainage: 'Poor Internal Drainage / High Water Retention',
      fertility: 'High Nutrient Holding / Optimal for Paddy'
    }
  },

  alluvial: {
    id: 'alluvial',
    name: 'Alluvial Soil (Inceptisols / Entisols)',
    shortName: 'Alluvial Loam',
    family: 'loam_sedimentary',
    description: 'Balanced riverine silt-loam with medium brown-grey hues, balanced mineral composition and high agricultural fertility.',
    colorHex: '#82725e',
    weights: {
      L: 49.0,
      a: 3.5,
      b: 14.0,
      rNorm: 0.388,
      gNorm: 0.345,
      bNorm: 0.267,
      rednessIdx: 0.06,
      organicIdx: 0.45,
      roughness: 18.0
    },
    tolerances: {
      L: 9.0,
      a: 4.5,
      b: 6.0,
      rNorm: 0.040,
      gNorm: 0.030,
      bNorm: 0.030,
      rednessIdx: 0.05,
      organicIdx: 0.15,
      roughness: 9.0
    },
    agronomicTraits: {
      organicMatter: 'Moderate & Balanced',
      texture: 'Rich Silt Loam / Uniform Aggregation',
      drainage: 'Balanced Moisture Retention & Aeration',
      fertility: 'High Potash & Lime, Highly Productive'
    }
  }
};

// Compatible Soil Families: These are agronomically closely related and should NOT trigger harsh mismatch penalties
export const SOIL_FAMILY_COMPATIBILITY = {
  'black': ['black', 'clayey'],
  'clayey': ['clayey', 'black', 'alluvial'],
  'red': ['red', 'laterite'],
  'laterite': ['laterite', 'red'],
  'sandy_loam': ['sandy_loam', 'alluvial'],
  'alluvial': ['alluvial', 'sandy_loam', 'clayey']
};

// Calibrated benchmark soil samples for testing and calibration
export const BENCHMARK_SOIL_SAMPLES = [
  {
    id: 'black',
    name: 'Black Regur Soil (Davanagere / Hubli)',
    shortName: 'Black Cotton',
    colorHex: '#3a342f',
    rgb: [58, 52, 47],
    desc: 'High humus Vertisol, clay clods, high moisture holding'
  },
  {
    id: 'red',
    name: 'Red Alfisol Soil (Chitradurga / Tumkur)',
    shortName: 'Red Soil',
    colorHex: '#a8422b',
    rgb: [168, 66, 43],
    desc: 'Ferric iron oxide rich, friable loam'
  },
  {
    id: 'laterite',
    name: 'Coastal Laterite (Udupi / Uttara Kannada)',
    shortName: 'Laterite',
    colorHex: '#782d1c',
    rgb: [120, 45, 28],
    desc: 'Brick-red iron sesquioxides, vesicular gravelly'
  },
  {
    id: 'sandy_loam',
    name: 'Sandy Loam (Kolar / Bellary)',
    shortName: 'Sandy Loam',
    colorHex: '#c4a47c',
    rgb: [196, 164, 124],
    desc: 'Pale quartz sand, porous fast drainage'
  },
  {
    id: 'clayey',
    name: 'Heavy Clayey Soil (Shimoga / Belagavi)',
    shortName: 'Clayey Soil',
    colorHex: '#5a5043',
    rgb: [90, 80, 67],
    desc: 'Dense colloidal matrix, high moisture retention'
  },
  {
    id: 'alluvial',
    name: 'Alluvial Loam (Cauvery / Krishna Basin)',
    shortName: 'Alluvial',
    colorHex: '#82725e',
    rgb: [130, 114, 94],
    desc: 'Balanced riverine silt loam, optimal fertility'
  }
];

/**
 * Generate a synthetic soil test image data URL in the browser
 */
export function generateSyntheticSoilDataUrl(rgb, noiseLevel = 22) {
  if (typeof document === 'undefined') return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    ctx.fillRect(0, 0, 160, 160);

    const imgData = ctx.getImageData(0, 0, 160, 160);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * noiseLevel;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.9));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.8));
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  } catch (e) {
    console.error('Failed to generate synthetic soil sample:', e);
    return null;
  }
}

/**
 * Convert RGB [0-255] to CIE-L*a*b* standard D65 illuminant
 */
export function rgbToLab(r, g, b) {
  let rLin = r / 255;
  let gLin = g / 255;
  let bLin = b / 255;

  rLin = rLin > 0.04045 ? Math.pow((rLin + 0.055) / 1.055, 2.4) : rLin / 12.92;
  gLin = gLin > 0.04045 ? Math.pow((gLin + 0.055) / 1.055, 2.4) : gLin / 12.92;
  bLin = bLin > 0.04045 ? Math.pow((bLin + 0.055) / 1.055, 2.4) : bLin / 12.92;

  const X = (rLin * 0.4124564 + gLin * 0.3575761 + bLin * 0.1804375) / 0.95047;
  const Y = (rLin * 0.2126729 + gLin * 0.7151522 + bLin * 0.0721750) / 1.00000;
  const Z = (rLin * 0.0193339 + gLin * 0.1191920 + bLin * 0.9503041) / 1.08883;

  const f = (val) => (val > 0.008856 ? Math.cbrt(val) : 7.787 * val + 16 / 116);

  const fx = f(X);
  const fy = f(Y);
  const fz = f(Z);

  const L = Math.max(0, 116 * fy - 16);
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return {
    L: Math.round(L * 10) / 10,
    a: Math.round(a * 10) / 10,
    b: Math.round(bVal * 10) / 10
  };
}

/**
 * Predicts soil class probabilities using Multi-Dimensional Scaled Gaussian Distance
 */
export function predictSoilFromFeatures(features) {
  const {
    L,
    a,
    b,
    rNorm,
    gNorm,
    bNorm,
    rednessIdx,
    organicIdx,
    roughness
  } = features;

  const distances = {};

  Object.keys(TRAINED_SOIL_CLASSES).forEach(classId => {
    const cls = TRAINED_SOIL_CLASSES[classId];
    const w = cls.weights;
    const tol = cls.tolerances;

    const dL = Math.pow((L - w.L) / tol.L, 2);
    const da = Math.pow((a - w.a) / tol.a, 2);
    const db = Math.pow((b - w.b) / tol.b, 2);
    const dR = Math.pow((rNorm - w.rNorm) / tol.rNorm, 2);
    const dG = Math.pow((gNorm - w.gNorm) / tol.gNorm, 2);
    const dB = Math.pow((bNorm - w.bNorm) / tol.bNorm, 2);
    const dRedness = Math.pow((rednessIdx - w.rednessIdx) / tol.rednessIdx, 2);
    const dOrganic = Math.pow((organicIdx - w.organicIdx) / tol.organicIdx, 2);
    const dRough = Math.pow((roughness - w.roughness) / tol.roughness, 2);

    const totalDistance = Math.sqrt(
      dL * 1.8 +
      da * 2.2 +
      db * 1.6 +
      dRedness * 2.0 +
      dR * 1.2 +
      dG * 1.0 +
      dB * 1.0 +
      dOrganic * 1.2 +
      dRough * 0.8
    );

    distances[classId] = totalDistance;
  });

  const T = 1.3;
  let sumExp = 0;
  const expScores = {};

  Object.keys(distances).forEach(cid => {
    const expVal = Math.exp(-distances[cid] / T);
    expScores[cid] = expVal;
    sumExp += expVal;
  });

  const probabilities = {};
  Object.keys(expScores).forEach(cid => {
    probabilities[cid] = Math.round((expScores[cid] / (sumExp || 1)) * 100);
  });

  const sortedClasses = Object.keys(probabilities)
    .map(cid => ({
      id: cid,
      name: TRAINED_SOIL_CLASSES[cid].name,
      shortName: TRAINED_SOIL_CLASSES[cid].shortName,
      probability: probabilities[cid],
      distance: Math.round(distances[cid] * 100) / 100,
      description: TRAINED_SOIL_CLASSES[cid].description,
      agronomicTraits: TRAINED_SOIL_CLASSES[cid].agronomicTraits
    }))
    .sort((a, b) => b.probability - a.probability);

  const topPrediction = sortedClasses[0];
  const runnerUp = sortedClasses[1];

  return {
    topPrediction,
    runnerUp,
    allProbabilities: probabilities,
    rankedList: sortedClasses,
    distances
  };
}
