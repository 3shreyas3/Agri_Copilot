import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Layers, 
  Upload, 
  Thermometer, 
  CloudRain, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Image as ImageIcon,
  X,
  Compass,
  FileCheck,
  RefreshCw,
  Eye,
  Camera,
  Cpu,
  Activity,
  Sliders,
  Check,
  Droplets,
  Beaker,
  Radio,
  Sun,
  Wind
} from 'lucide-react';
import { SOIL_TYPES, CROP_DATABASE, KARNATAKA_DISTRICTS, SAMPLE_PRESETS } from '../data/agriKnowledge';
import { TRANSLATIONS, getTranslatedCropName, getTranslatedSoilName, getTranslatedDistrict } from '../translations';
import { analyzeSoilImageAsync } from '../utils/soilImageAnalyzer';
import { BENCHMARK_SOIL_SAMPLES, generateSyntheticSoilDataUrl } from '../utils/trainedSoilModel';
import { evaluateCropAgronomics, getAlternateCropRecommendations } from '../services/advisoryEngine';
import { fetchLiveDistrictWeather } from '../services/weatherService';

export default function FarmerInputForm({
  formData,
  setFormData,
  onSubmit,
  isGenerating,
  language
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [imagePreview, setImagePreview] = useState(formData.soilImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [soilAnalysisResult, setSoilAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCustomDistrict, setIsCustomDistrict] = useState(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [dismissMismatch, setDismissMismatch] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherSyncedDistrict, setWeatherSyncedDistrict] = useState('');

  const numericLandSize = parseFloat(formData.landSize) || 0;
  const isSmallholder = numericLandSize < 2.0;
  const numericPop = parseFloat(formData.regionalPopularity) || 0;

  // Real-time agro-climatic assessment for selected crop under farmer's input (soil, temp, rainfall)
  const hasCropAndEnvironment = Boolean(formData.cropName && formData.soilType && formData.temperature !== '' && formData.rainfall !== '');
  const selectedCropObj = CROP_DATABASE[formData.cropName] || null;

  const liveAgro = (hasCropAndEnvironment && selectedCropObj) ? evaluateCropAgronomics({
    crop: selectedCropObj,
    soilType: formData.soilType,
    temperature: formData.temperature,
    rainfall: formData.rainfall,
    district: formData.district
  }) : null;

  const isInputHighRisk = Boolean(
    hasCropAndEnvironment && 
    liveAgro && 
    (liveAgro.isSevereSoilStress || liveAgro.isSevereTempStress || liveAgro.isSevereRainStress || liveAgro.suitabilityScore < 60)
  );

  // If high risk detected, fetch best alternate crop recommendation tailored to input (soil, temp, rainfall)
  const liveAlternates = isInputHighRisk ? getAlternateCropRecommendations({
    currentCropName: formData.cropName,
    soilType: formData.soilType,
    temperature: formData.temperature,
    rainfall: formData.rainfall,
    district: formData.district
  }) : null;

  // Handle text & number field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Synchronize image preview whenever formData.soilImage changes from external
  useEffect(() => {
    setImagePreview(formData.soilImage || null);
    setDismissMismatch(false);
  }, [formData.soilImage]);

  // Run real-time spectral & pedological analysis when image or selected soil type changes
  useEffect(() => {
    let isMounted = true;
    if (formData.soilImage) {
      setIsAnalyzing(true);
      analyzeSoilImageAsync(formData.soilImage, formData.soilType).then((result) => {
        if (isMounted) {
          setSoilAnalysisResult(result);
          setIsAnalyzing(false);
          setFormData(prev => ({
            ...prev,
            soilAnalysisResult: result
          }));
        }
      });
    } else {
      setSoilAnalysisResult(null);
      setFormData(prev => ({
        ...prev,
        soilAnalysisResult: null
      }));
    }
    return () => { isMounted = false; };
  }, [formData.soilImage, formData.soilType]);

  // Handle soil image upload
  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImagePreview(base64);
      setFormData(prev => ({
        ...prev,
        soilImage: base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeSoilImage = () => {
    setImagePreview(null);
    setSoilAnalysisResult(null);
    setFormData(prev => ({
      ...prev,
      soilImage: null,
      soilAnalysisResult: null
    }));
  };

  // Select and test benchmark soil sample
  const handleSelectBenchmark = (benchmark) => {
    const dataUrl = generateSyntheticSoilDataUrl(benchmark.rgb);
    if (dataUrl) {
      setImagePreview(dataUrl);
      setFormData(prev => ({
        ...prev,
        soilImage: dataUrl
      }));
      setDismissMismatch(false);
    }
  };

  // Auto-fill realistic climate for district
  const handleAutoFillClimate = () => {
    const crop = CROP_DATABASE[formData.cropName];
    if (crop) {
      setFormData(prev => ({
        ...prev,
        temperature: crop.idealTemp.optimal,
        rainfall: crop.idealRainfall.optimal
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        temperature: 28,
        rainfall: 750
      }));
    }
  };

  // Real-time automatic weather synchronization for farmer's location/district
  useEffect(() => {
    let isMounted = true;
    const targetDistrict = (formData.district || '').trim();
    if (!targetDistrict) return;

    // Use short debounce for dropdowns (50ms) and longer for custom text typing (450ms)
    const delay = isCustomDistrict ? 450 : 50;

    const timer = setTimeout(async () => {
      setIsFetchingWeather(true);
      try {
        const weatherData = await fetchLiveDistrictWeather(targetDistrict);
        if (isMounted && weatherData) {
          setLiveWeather(weatherData);
          setWeatherSyncedDistrict(targetDistrict);
          // Automatically take input for temp and rainfall based on real-time location
          setFormData(prev => ({
            ...prev,
            temperature: weatherData.temperature,
            rainfall: weatherData.rainfall
          }));
        }
      } catch (err) {
        console.error('Failed to sync live weather for district:', targetDistrict, err);
      } finally {
        if (isMounted) setIsFetchingWeather(false);
      }
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [formData.district, isCustomDistrict]);

  // Manually refresh real-time weather telemetry
  const handleRefreshWeather = async () => {
    const targetDistrict = (formData.district || '').trim() || 'Davanagere';
    setIsFetchingWeather(true);
    try {
      const weatherData = await fetchLiveDistrictWeather(targetDistrict);
      if (weatherData) {
        setLiveWeather(weatherData);
        setWeatherSyncedDistrict(targetDistrict);
        setFormData(prev => ({
          ...prev,
          temperature: weatherData.temperature,
          rainfall: weatherData.rainfall
        }));
      }
    } catch (err) {
      console.error('Failed to refresh live weather:', err);
    } finally {
      setIsFetchingWeather(false);
    }
  };

  // 1-Click fix when soil mismatch occurs
  const handleFixSoilMismatch = () => {
    if (soilAnalysisResult && soilAnalysisResult.detectedSoilType) {
      handleChange('soilType', soilAnalysisResult.detectedSoilType);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Form Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-300" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {t.appTitle} - {t.farmerProfile}
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-7">

        {/* SECTION 1: FARMER PROFILE */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                1. {t.farmerProfile}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Step 1 of 2</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Farmer Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.farmerName} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.farmerName}
                  onChange={(e) => handleChange('farmerName', e.target.value)}
                  placeholder={t.farmerNamePlaceholder || 'e.g. Ramesh Patil'}
                  className="w-full px-3.5 py-2.5 pl-9 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none font-medium text-slate-800"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Land Size in Acres */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.landSize} <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isSmallholder ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-blue-50 text-blue-800 border-blue-300'}`}>
                  {isSmallholder ? (t.smallholderBadge || 'Smallholder (< 2 Acres)') : (t.commercialBadge || 'Commercial (≥ 2 Acres)')}
                </span>
              </div>
              <input
                type="number"
                step="any"
                min="0.01"
                max="5000"
                required
                value={formData.landSize}
                onChange={(e) => handleChange('landSize', e.target.value)}
                placeholder={t.landSizePlaceholder || 'e.g. 2.5'}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none font-medium"
              />
            </div>

            {/* District Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.district} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {t.statDistricts || 'Karnataka Districts'}
                </span>
              </div>

              <select
                required
                value={
                  !formData.district 
                    ? '' 
                    : KARNATAKA_DISTRICTS.some(d => d.id === formData.district || d.name === formData.district)
                    ? formData.district
                    : ['Yavatmal', 'Ludhiana', 'Junagadh', 'Wardha'].includes(formData.district)
                    ? formData.district
                    : 'CUSTOM'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'CUSTOM') {
                    setIsCustomDistrict(true);
                    handleChange('district', '');
                  } else {
                    setIsCustomDistrict(false);
                    handleChange('district', val);
                  }
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none font-medium text-slate-800"
              >
                <option value="" disabled>-- {t.selectDistrict || 'Select District'} --</option>
                <optgroup label={t.statDistricts || 'Karnataka Districts'}>
                  {KARNATAKA_DISTRICTS.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {getTranslatedDistrict(dist.id, language) || dist.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t.customDistrict || 'Custom District'}>
                  <option value="CUSTOM">{t.customDistrict || 'Type Other District...'}</option>
                </optgroup>
              </select>

              {/* Show custom text input if 'CUSTOM' is chosen or district isn't in predefined list */}
              {(isCustomDistrict || (Boolean(formData.district) && !KARNATAKA_DISTRICTS.some(d => d.id === formData.district) && !['Yavatmal', 'Ludhiana', 'Junagadh', 'Wardha'].includes(formData.district))) && (
                <div className="mt-2 animate-in fade-in duration-150">
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    placeholder="Enter district or town name"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>
              )}

              {/* Display zone & key crop intelligence if a Karnataka district is selected */}
              {(() => {
                const kDist = KARNATAKA_DISTRICTS.find(d => d.id === formData.district || d.name === formData.district);
                if (kDist) {
                  return (
                    <p className="text-[10px] text-emerald-700 font-medium mt-1 truncate" title={`${kDist.zone} - ${kDist.keyCrops}`}>
                      📍 {kDist.zone} • {kDist.keyCrops}
                    </p>
                  );
                }
                return <p className="text-[11px] text-slate-400 mt-1">Used for local pest & scheme matching</p>;
              })()}

              {/* Real-time Weather Sync Status Badge */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {isFetchingWeather ? (
                  <span className="text-blue-600 font-semibold flex items-center gap-1.5 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    Fetching live weather for {formData.district}...
                  </span>
                ) : liveWeather ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Live Weather Auto-Synced: <strong>{liveWeather.currentTemp}°C</strong> &bull; <strong>{liveWeather.rainfall}mm</strong></span>
                  </span>
                ) : (
                  <span className="text-slate-400">⚡ Select a district above to auto-sync live temp & rainfall</span>
                )}
                {liveWeather && (
                  <button
                    type="button"
                    onClick={handleRefreshWeather}
                    disabled={isFetchingWeather}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold underline ml-2"
                  >
                    Refresh
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: CROP & ENVIRONMENT DETAILS */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                2. {t.cropDetails}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshWeather}
                disabled={isFetchingWeather}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition flex items-center gap-1.5"
                title="Fetch live satellite & ground station weather"
              >
                <RefreshCw className={`w-3 h-3 text-blue-600 ${isFetchingWeather ? 'animate-spin' : ''}`} />
                <span>{isFetchingWeather ? 'Syncing...' : 'Sync Live Weather'}</span>
              </button>
              <button
                type="button"
                onClick={handleAutoFillClimate}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Optimal Crop Climate
              </button>
            </div>
          </div>

          {/* Real-time Weather Intelligence Card */}
          {liveWeather && (
            <div className="mb-5 p-3.5 bg-gradient-to-r from-blue-50/90 via-emerald-50/70 to-slate-50 border border-blue-200/90 rounded-2xl shadow-sm animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100/90 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-blue-600" />
                    Live Meteorological Telemetry: <span className="text-blue-700 font-extrabold">{liveWeather.locationName}, {liveWeather.state}</span>
                  </span>
                  <span className="text-[10px] font-bold bg-blue-100/90 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200/60">
                    {liveWeather.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Updated: {liveWeather.timestamp}</span>
                  <button
                    type="button"
                    onClick={handleRefreshWeather}
                    disabled={isFetchingWeather}
                    className="p-1 text-slate-500 hover:text-blue-600 transition"
                    title="Refresh live weather"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingWeather ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Real-time Temp */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Ambient Temp</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-black text-slate-900">{liveWeather.currentTemp}°C</span>
                    <span className="text-[10px] font-semibold text-slate-500">Peak: {liveWeather.dayMaxTemp}°C</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleChange('temperature', liveWeather.currentTemp)}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition ${Number(formData.temperature) === Number(liveWeather.currentTemp) ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                      title="Set to live temperature"
                    >
                      Use Live ({liveWeather.currentTemp}°)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('temperature', liveWeather.dayMaxTemp)}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition ${Number(formData.temperature) === Number(liveWeather.dayMaxTemp) ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                      title="Set to peak daytime temperature"
                    >
                      Day Peak ({liveWeather.dayMaxTemp}°)
                    </button>
                  </div>
                </div>

                {/* Rain Today */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Precipitation Today</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-blue-600">{liveWeather.precipToday}</span>
                    <span className="text-[10px] font-semibold text-slate-500">mm today</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">7-day forecast: {liveWeather.precip7Day} mm</span>
                </div>

                {/* Annual / Seasonal Normal */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Seasonal Normal Rain</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-emerald-700">{liveWeather.rainfall}</span>
                    <span className="text-[10px] font-semibold text-slate-500">mm / year</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('rainfall', liveWeather.rainfall)}
                    className={`mt-1.5 text-[10px] px-1.5 py-0.5 rounded font-medium transition ${Number(formData.rainfall) === Number(liveWeather.rainfall) ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    title="Set to authoritative annual/seasonal rainfall normal"
                  >
                    Use Normal ({liveWeather.rainfall}mm)
                  </button>
                </div>

                {/* Humidity & Atmospheric */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Atmosphere & Wind</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-black text-slate-800">{liveWeather.humidity}% RH</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1 truncate">Wind: {liveWeather.windSpeed} km/h • {liveWeather.zone}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Crop Cultivated */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.cropName} <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.cropName}
                onChange={(e) => handleChange('cropName', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none font-medium text-slate-800"
              >
                <option value="" disabled>-- {t.selectCrop || 'Select Crop'} --</option>
                {Object.keys(CROP_DATABASE).map((crop) => (
                  <option key={crop} value={crop}>
                    {getTranslatedCropName(crop, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.soilType} <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.soilType}
                onChange={(e) => handleChange('soilType', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none font-medium text-slate-800"
              >
                <option value="" disabled>-- {t.selectSoil || 'Select Soil Type'} --</option>
                {SOIL_TYPES.map((soil) => (
                  <option key={soil.id} value={soil.id}>
                    {getTranslatedSoilName(soil.id, language) || soil.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {SOIL_TYPES.find(s => s.id === formData.soilType)?.description || 'Select soil type or analyze sample photo below'}
              </p>
            </div>

            {/* Ambient Temperature */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {t.temperature}
                </label>
                {liveWeather && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    Live: {liveWeather.currentTemp}°C
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="-10"
                  max="60"
                  required
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none font-medium"
                />
                <Thermometer className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {liveWeather ? `Auto-synced for ${liveWeather.locationName} (Day peak: ${liveWeather.dayMaxTemp}°C)` : 'Auto-syncs with location'}
              </p>
            </div>

            {/* Rainfall */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {t.rainfall}
                </label>
                {liveWeather && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Normal: {liveWeather.rainfall}mm
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  max="12000"
                  required
                  value={formData.rainfall}
                  onChange={(e) => handleChange('rainfall', e.target.value)}
                  placeholder="e.g. 750"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none font-medium"
                />
                <CloudRain className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {liveWeather ? `IMD normal for ${liveWeather.locationName} (Today: ${liveWeather.precipToday}mm)` : 'Auto-syncs with location'}
              </p>
            </div>

            {/* Regional Popularity (%) Slider */}
            <div className="sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  {t.regionalPopularity}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formData.regionalPopularity}%
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={formData.regionalPopularity}
                onChange={(e) => handleChange('regionalPopularity', e.target.value)}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              {/* Dynamic Saturation Badge based on prompt logic */}
              <div className="mt-2.5 flex items-start gap-2">
                {numericPop > 80 ? (
                  <div className="flex items-start gap-1.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded-lg w-full">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Over-Supply Warning ({numericPop}%): </span>
                      Extremely high saturation. Market gluts at harvest are likely to depress prices. Staggered harvesting & value-addition strongly recommended.
                    </div>
                  </div>
                ) : numericPop < 35 ? (
                  <div className="flex items-start gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg w-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{t.scarcitySurge}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5 text-xs text-slate-700 bg-slate-100 border border-slate-200 p-2 rounded-lg w-full">
                    <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{t.balancedDemand}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* REAL-TIME LIVE AGRO-CLIMATIC RISK CHECK & ALTERNATE CROP RECOMMENDATION */}
            {hasCropAndEnvironment && liveAgro && (
              isInputHighRisk && liveAlternates?.bestAlternative ? (
                <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50/70 to-emerald-50/50 border-2 border-rose-300 text-left animate-in fade-in duration-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
                        <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
                            ⚠️ {t.highRiskDetected}: {getTranslatedCropName(formData.cropName, language)}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-rose-300">
                            {liveAgro.suitabilityScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-rose-900/90 mt-1 leading-relaxed">
                          {liveAgro.isSevereRainStress && liveAgro.rainReason}
                          {liveAgro.isSevereTempStress && (liveAgro.isSevereRainStress ? ' ' : '') + liveAgro.tempReason}
                          {liveAgro.isSevereSoilStress && ((liveAgro.isSevereRainStress || liveAgro.isSevereTempStress) ? ' ' : '') + liveAgro.soilReason}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-rose-200/80 flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-slate-800">💡 {t.alternateCrop}:</span>
                          <span className="font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                            {liveAlternates.bestAlternative.cropName}
                          </span>
                          <span className="text-emerald-800 font-semibold text-[11px]">
                            ({liveAlternates.bestAlternative.suitabilityScore}% Fit • {t.projectedHealth}: {Number(liveAlternates.bestAlternative.projectedHealthScore) <= 10 ? Math.round(Number(liveAlternates.bestAlternative.projectedHealthScore) * 10) : liveAlternates.bestAlternative.projectedHealthScore}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChange('cropName', liveAlternates.bestAlternative.cropKey)}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-800/20 whitespace-nowrap shrink-0 self-start sm:self-center group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
                      <span>{t.switchToAlternate}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sm:col-span-2 lg:col-span-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">
                      {getTranslatedCropName(formData.cropName, language)} • {getTranslatedSoilName(formData.soilType, language)} ({liveAgro.suitabilityScore}% Fit)
                    </span>
                  </div>
                </div>
              )
            )}

          </div>
        </div>

        {/* SECTION 3: MULTIMODAL SOIL IMAGE ANALYSIS & TRAINED PEDOLOGICAL VISION */}
        <div className="pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                3. {t.soilImage}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Trained Vision ML Model
            </span>
          </div>

          <div className="space-y-4">
            {/* Main Drag-and-Drop Image Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleImageUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center transition ${
                isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {imagePreview ? (
                <div className="flex flex-col md:flex-row items-stretch justify-between gap-5">
                  
                  {/* Left: Thumbnail & Image Metrics */}
                  <div className="flex items-start gap-4 text-left">
                    <div className="relative group shrink-0">
                      <img
                        src={imagePreview}
                        alt="Soil Sample"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl shadow-md border-2 border-white ring-2 ring-slate-200"
                      />
                      {soilAnalysisResult && (
                        <span 
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                          style={{ backgroundColor: soilAnalysisResult.metrics.hex }}
                          title={`Sample Swatch: ${soilAnalysisResult.metrics.hex}`}
                        />
                      )}
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <span>Soil Sample Analyzed</span>
                          {isAnalyzing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />}
                        </div>
                        
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          {soilAnalysisResult 
                            ? `RGB(${soilAnalysisResult.metrics.r}, ${soilAnalysisResult.metrics.g}, ${soilAnalysisResult.metrics.b}) • CIE-L*: ${soilAnalysisResult.metrics.labL}`
                            : 'Extracting spatial & colorimetric features...'}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSoilImage();
                          }}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg border border-rose-200 transition flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDiagnosticsModal(true);
                          }}
                          className="text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 px-3 py-1 rounded-lg border border-slate-300 hover:border-emerald-300 transition flex items-center gap-1 shadow-2xs"
                        >
                          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                          Model Diagnostics
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Trained Model Output Card */}
                  {soilAnalysisResult && (
                    <div className="flex-1 md:max-w-md text-left bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-emerald-600" />
                          ML Pedological Classification
                        </span>
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          soilAnalysisResult.confidence >= 65 
                            ? 'text-emerald-800 bg-emerald-50 border-emerald-200' 
                            : 'text-amber-800 bg-amber-50 border-amber-200'
                        }`}>
                          {soilAnalysisResult.confidence}% Certainty
                        </span>
                      </div>

                      <div>
                        <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                          <span>{soilAnalysisResult.detectedSoilName}</span>
                        </div>
                        {soilAnalysisResult.runnerUp && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Runner-up: <strong className="text-slate-700">{soilAnalysisResult.runnerUp.shortName}</strong> ({soilAnalysisResult.runnerUp.probability}%)
                          </div>
                        )}
                      </div>

                      {/* Top Softmax Probability Bars */}
                      <div className="space-y-1.5 pt-1">
                        {soilAnalysisResult.rankedList.slice(0, 3).map((item, idx) => (
                          <div key={item.id} className="text-xs">
                            <div className="flex justify-between text-[11px] mb-0.5">
                              <span className={`${idx === 0 ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                {item.shortName}
                              </span>
                              <span className="font-bold text-slate-700">{item.probability}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  idx === 0 ? 'bg-emerald-600' : idx === 1 ? 'bg-teal-500' : 'bg-slate-300'
                                }`}
                                style={{ width: `${Math.max(4, item.probability)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Inferred Agronomic Traits */}
                      {soilAnalysisResult.agronomicTraits && (
                        <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-[10px]">
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block font-semibold">Organic Base</span>
                            <span className="font-bold text-slate-800 truncate block" title={soilAnalysisResult.agronomicTraits.organicMatter}>
                              {soilAnalysisResult.agronomicTraits.organicMatter.split(' ')[0]}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block font-semibold">Texture</span>
                            <span className="font-bold text-slate-800 truncate block" title={soilAnalysisResult.agronomicTraits.texture}>
                              {soilAnalysisResult.agronomicTraits.texture.split(' ')[0]}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block font-semibold">Drainage</span>
                            <span className="font-bold text-slate-800 truncate block" title={soilAnalysisResult.agronomicTraits.drainage}>
                              {soilAnalysisResult.agronomicTraits.drainage.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {t.dragDropImage}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                    Upload a clear photo of your field soil, or test one of the calibrated benchmark samples above. The trained ML model extracts perceptual CIE-L*a*b* hues, hematite index, and texture roughness to classify the soil and inspect moisture retention.
                  </p>
                  <span className="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-full border border-slate-200">
                    Supports JPG, PNG, WEBP up to 10MB
                  </span>
                </div>
              )}
            </div>

            {/* LIVE SOIL MISMATCH WARNING BANNER (When Image and Selection do not match) */}
            {soilAnalysisResult && soilAnalysisResult.isMismatch && !dismissMismatch && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-400 text-amber-950 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-200/80 text-amber-900 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-amber-800 animate-pulse" />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-extrabold text-sm text-amber-950 tracking-tight flex items-center gap-2">
                        <span>⚠️ Soil Discrepancy Detected: Photo does not match Selected Soil</span>
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 w-fit">
                        Pedological Conflict
                      </span>
                    </div>

                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      You selected <strong className="underline decoration-amber-600 font-bold">{soilAnalysisResult.selectedSoilName}</strong>, but the trained machine learning vision model indicates <strong className="underline decoration-amber-600 font-bold">{soilAnalysisResult.detectedSoilName}</strong> ({soilAnalysisResult.confidence}% confidence).
                    </p>

                    <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs text-slate-700 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner shrink-0" style={{ backgroundColor: soilAnalysisResult.metrics.hex }}></span>
                        <span>Sample Color: <strong>{soilAnalysisResult.metrics.hex}</strong></span>
                      </div>
                      <span>•</span>
                      <span>Lightness: <strong>{soilAnalysisResult.metrics.lightness}%</strong></span>
                      <span>•</span>
                      <span>Redness Index: <strong>{soilAnalysisResult.metrics.rednessIdx?.toFixed(2)}</strong></span>
                      <span>•</span>
                      <span className="text-amber-900 font-medium italic">{soilAnalysisResult.visualDescription}</span>
                    </div>

                    {/* Quick 1-Click Fix Button & Dismiss */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={handleFixSoilMismatch}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-900/20 transition flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>Update Form to "{soilAnalysisResult.detectedSoilName}"</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setDismissMismatch(true)}
                        className="px-3 py-2 bg-white hover:bg-amber-100/60 text-amber-900 text-xs font-semibold rounded-xl border border-amber-300 transition"
                      >
                        Keep "{soilAnalysisResult.selectedSoilName}" (Camera Flash / Shadows)
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* LIVE VERIFICATION SUCCESS BADGE (When Image and Selection match) */}
            {soilAnalysisResult && (!soilAnalysisResult.isMismatch || dismissMismatch) && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>ML Verified Compatibility:</strong> Uploaded photo confirms <strong>{soilAnalysisResult.detectedSoilName}</strong> characteristics (CIE-L*: {soilAnalysisResult.metrics.labL}, Redness: {soilAnalysisResult.metrics.rednessIdx?.toFixed(2)}).
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 w-fit shrink-0">
                  {soilAnalysisResult.confidence}% Confidence
                </span>
              </div>
            )}

          </div>
        </div>

        {/* MODEL DIAGNOSTICS & BENCHMARK CALIBRATION MODAL */}
        {showDiagnosticsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 text-left">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Trained Soil Vision ML Model Diagnostics
                    </h3>
                    <p className="text-xs text-slate-500">
                      Center-weighted spatial pooling & multi-dimensional pedological feature vectors
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDiagnosticsModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Extracted Feature Vector Grid */}
              {soilAnalysisResult ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    Live Extracted Pedological Feature Vector
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-semibold block">CIE-L* (Lightness)</span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {soilAnalysisResult.metrics.labL}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Scale: 0 (Black) - 100 (White)</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-semibold block">CIE-a* (Redness Axis)</span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {soilAnalysisResult.metrics.labA}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Ferric iron hematite</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-semibold block">CIE-b* (Yellow Axis)</span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {soilAnalysisResult.metrics.labB}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Quartz sand / silt component</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-semibold block">Hematite Redness Index</span>
                      <span className="text-base font-extrabold text-rose-700 font-mono">
                        {soilAnalysisResult.metrics.rednessIdx?.toFixed(3)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">(R - G) / (R + G)</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-semibold block">Soil Organic Carbon (SOC)</span>
                      <span className="text-base font-extrabold text-amber-800 font-mono">
                        {soilAnalysisResult.metrics.organicIdx?.toFixed(3)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Humus darkness proxy</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-semibold block">Laplacian Roughness</span>
                      <span className="text-base font-extrabold text-emerald-800 font-mono">
                        {soilAnalysisResult.metrics.roughness?.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Soil aggregate texture</span>
                    </div>
                  </div>

                  {/* Softmax Probability Distribution Across All 6 Classes */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                      Softmax Probabilities Across All Soil Classes
                    </h4>

                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {soilAnalysisResult.rankedList.map((item, idx) => (
                        <div key={item.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-semibold ${idx === 0 ? 'text-emerald-800 font-extrabold' : 'text-slate-700'}`}>
                              {idx === 0 && '★ '}
                              {item.name}
                            </span>
                            <span className="font-mono font-bold text-slate-800">
                              {item.probability}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                idx === 0 ? 'bg-emerald-600' : idx === 1 ? 'bg-teal-500' : 'bg-slate-400'
                              }`}
                              style={{ width: `${Math.max(2, item.probability)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm">
                  Upload an image or select a benchmark sample to view live feature extraction.
                </div>
              )}

              {/* Benchmark Testing in Modal */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Test & Calibrate with Standard Soil Samples
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BENCHMARK_SOIL_SAMPLES.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        handleSelectBenchmark(sample);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition flex items-center gap-2 group"
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: sample.colorHex }}
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {sample.shortName}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate font-mono">
                          {sample.colorHex}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-100 pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDiagnosticsModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Close Diagnostics
                </button>
              </div>

            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.statOffline || 'Advisory integrates Agmarknet market prices, soil suitability and policy portals'}</span>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2.5 ${
              isGenerating
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-700/25 hover:shadow-emerald-700/35 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.generateButton}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  );
}
