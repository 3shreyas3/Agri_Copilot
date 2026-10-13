import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  BookmarkCheck, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Landmark, 
  ExternalLink, 
  FileText, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  CircleDollarSign,
  HeartPulse,
  Leaf,
  Layers,
  ArrowRight
} from 'lucide-react';
import ValueAddCalculator from './ValueAddCalculator';
import { TRANSLATIONS } from '../translations';
import { playAdvisorySpeech, stopAdvisorySpeech } from '../services/speechService';

export default function AdvisoryReport({
  advisory,
  language = 'en',
  onSaveHistory,
  isSaved = false,
  onNavigateToRedirection,
  onNavigateToGovernance,
  onSelectAlternateCrop
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'markdown'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!advisory) return null;

  const {
    farmerProfile,
    cropDetails,
    cropAnalysis,
    economicOutlook,
    governanceAndFinance,
    markdownOutput
  } = advisory;

  // Handle Markdown Copy
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Health Score Color (Normalized for 0-100 scale)
  const getHealthColor = (score) => {
    const val = Number(score) <= 10 ? score * 10 : score;
    if (val >= 75) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', stroke: '#10b981' };
    if (val >= 55) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', stroke: '#f59e0b' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', stroke: '#ef4444' };
  };

  const healthScorePercent = Number(cropAnalysis.healthScore) <= 10 
    ? Math.round(Number(cropAnalysis.healthScore) * 10) 
    : Math.round(Number(cropAnalysis.healthScore));
  const healthStyle = getHealthColor(healthScorePercent);

  // Best alternative projected health score
  const rawAltHealth = cropAnalysis.bestAlternative?.projectedHealthScore || 0;
  const altHealthPercent = Number(rawAltHealth) <= 10 
    ? Math.round(Number(rawAltHealth) * 10) 
    : Math.round(Number(rawAltHealth));

  // Handle Audio Speech Playback with language-specific script
  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      stopAdvisorySpeech();
      setIsPlayingAudio(false);
    } else {
      let speechScript = '';
      if (language === 'kn') {
        speechScript = `${farmerProfile.name} ಅವರ ಕೃಷಿ ಸಲಹಾ ವರದಿ. ಜಿಲ್ಲೆ: ${farmerProfile.translatedDistrict || farmerProfile.district}. ಬೆಳೆ: ${cropDetails.cropName}. ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ: ೧೦೦ ಕ್ಕೆ ${healthScorePercent}. ಅಪಾಯದ ಮಟ್ಟ: ${cropAnalysis.riskLevel}. ಅಂದಾಜು ಕಟಾವು ಮಾರುಕಟ್ಟೆ ದರ: ${economicOutlook.predictedPriceRange}. ಮಾರುಕಟ್ಟೆ ಮುನ್ನೋಟ: ${economicOutlook.marketSentiment}. ಶಿಫಾರಸು ಮಾಡಿದ ಬ್ಯಾಂಕ್ ಸಾಲ: ${governanceAndFinance.recommendedLoan.primaryLoan}.`;
      } else if (language === 'te') {
        speechScript = `${farmerProfile.name} గారి వ్యవసాయ సలహా నివేదిక. జిల్లా: ${farmerProfile.district}. పంట: ${cropDetails.cropName}. ఆరోగ్య స్కోరు: 100 కి ${healthScorePercent}. ప్రమాద స్థాయి: ${cropAnalysis.riskLevel}. అంచనా మార్కెట్ ధర: ${economicOutlook.predictedPriceRange}. మార్కెట్ సరళి: ${economicOutlook.marketSentiment}. సిఫార్సు చేసిన వ్యవసాయ రుణం: ${governanceAndFinance.recommendedLoan.primaryLoan}.`;
      } else if (language === 'hi') {
        speechScript = `${farmerProfile.name} के लिए कृषि सलाह रिपोर्ट। जिला: ${farmerProfile.district}। फसल: ${cropDetails.cropName}। फसल स्वास्थ्य स्कोर: 100 में से ${healthScorePercent}। जोखिम स्तर: ${cropAnalysis.riskLevel}। अनुमानित कटाई मूल्य: ${economicOutlook.predictedPriceRange}। मंडी रुख: ${economicOutlook.marketSentiment}। अनुशंसित बैंक ऋण: ${governanceAndFinance.recommendedLoan.primaryLoan}।`;
      } else {
        speechScript = `Farm Advisory for ${farmerProfile.name}. District: ${farmerProfile.district}. Crop Health Score: ${healthScorePercent} percent out of 100 percent. Risk Level: ${cropAnalysis.riskLevel}. Predicted harvest price: ${economicOutlook.predictedPriceRange}. Market trend is ${economicOutlook.marketSentiment}. Recommended loan: ${governanceAndFinance.recommendedLoan.primaryLoan}.`;
      }

      playAdvisorySpeech({
        text: speechScript,
        language,
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  // Handle WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🌾 *${t.appTitle} - ${t.reportBadge}*\n` +
      `👤 *${farmerProfile.name}* | 📍 *${farmerProfile.translatedDistrict || farmerProfile.district}* (${farmerProfile.landSize} ${t.acresUnit || 'Acres'})\n` +
      `🌱 *${cropDetails.cropName}* | *${t.cropHealthScore}:* ${healthScorePercent}%\n` +
      `💰 *${t.predictedHarvestPrice}:* ${economicOutlook.predictedPriceRange}\n` +
      `📈 *${t.marketTrend}:* ${economicOutlook.marketSentiment}\n` +
      `🏛 *${t.recommendedLoan}:* ${governanceAndFinance.recommendedLoan.primaryLoan}\n\n` +
      `Generated by AgriCopilot AI`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden print:border-none print:shadow-none">
      
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 border-b border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 border-2 border-emerald-400/60 flex items-center justify-center text-2xl sm:text-3xl text-white shadow-lg shadow-emerald-950/60 shrink-0 ring-4 ring-emerald-500/20">
              🌾
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t.reportBadge || 'Farmer Advisory Report'}
                </span>
                <span className="text-xs text-slate-400">
                  • {new Date(advisory.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {t.advisoryFor || 'AgriCopilot Advisory for'} <span className="text-emerald-400">{farmerProfile.name}</span>
              </h2>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-slate-300">
                <span className="font-semibold text-slate-200">
                  {t.districtLabel || 'District:'} <span className="text-emerald-300 font-bold">{farmerProfile.translatedDistrict || farmerProfile.district}</span>
                </span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center gap-1.5">
                  {t.landSizeLabel || 'Land Size:'} <strong className="text-white">{farmerProfile.landSize} {t.acresUnit || 'Acres'}</strong>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    farmerProfile.isSmallholder 
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                      : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                  }`}>
                    {farmerProfile.isSmallholder ? (t.smallholderTag || 'Smallholder (< 2 Ac)') : (t.commercialTag || 'Commercial Scale (≥ 2 Ac)')}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            
            {/* Audio Readout */}
            <button
              onClick={handleToggleSpeech}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isPlayingAudio 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-md shadow-rose-900/40' 
                  : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40'
              }`}
              title="Voice Narration"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? t.stopAudio : t.readAloud}</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5"
              title="Share Advisory via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.shareWhatsApp || 'WhatsApp'}</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.printReport || 'Print'}</span>
            </button>

            {/* Save to History */}
            <button
              onClick={onSaveHistory}
              disabled={isSaved}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-600/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="Save to My Advisories"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{isSaved ? (t.saved || 'Saved') : (t.saveToHistory || 'Save')}</span>
            </button>

          </div>
        </div>

        {/* View Mode Toggle Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 no-print">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {t.tabVisualDashboard || 'Interactive Visual Dashboard'}
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'markdown'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {t.tabMarkdownOutput || 'Master System Output (Markdown)'}
          </button>
        </div>

      </div>

      {/* 2. ADVISORY BODY */}
      <div className="p-6 sm:p-8 space-y-8">

        {activeTab === 'visual' ? (
          <>
            {/* ==================================================== */}
            {/* SECTION 1: CROP ANALYSIS                            */}
            {/* ==================================================== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🛠</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {t.cropAnalysisTitle || 'Crop Analysis:'} <span className="text-emerald-700">{cropDetails.cropName}</span>
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {cropDetails.soilType} • {cropDetails.temperature}°C • {cropDetails.rainfall}mm
                </span>
              </div>

              {/* SOIL MISMATCH WARNING BANNER IF PHOTO DOES NOT MATCH SELECTED SOIL */}
              {cropAnalysis.soilMismatch && (
                <div className="bg-amber-50 border-2 border-amber-400 text-amber-950 p-4 sm:p-5 rounded-2xl shadow-sm flex items-start gap-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 bg-amber-200 text-amber-900 rounded-xl shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-amber-800 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-amber-900 tracking-wide uppercase">
                        {t.soilMismatchTitle || '⚠️ Soil Warning: Photo Looks Different From Selected Soil'}
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                        {t.checkRequired || 'Check Required'}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      {t.soilMismatchDetail || 'Your uploaded photo looks different from your selected soil type. Health scores have been calibrated to prevent incorrect fertilization.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                
                {/* Health Status Gauge Card */}
                <div className={`md:col-span-4 p-5 rounded-2xl border ${healthStyle.border} ${healthStyle.bg} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-emerald-600" />
                        {t.cropHealthScore || 'Crop Health Score'}
                      </span>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${healthStyle.border} ${healthStyle.text}`}>
                        {healthScorePercent >= 75 ? (t.goodHealth || 'Good Health') : healthScorePercent >= 55 ? (t.fairCondition || 'Fair Condition') : (t.needsCare || 'Needs Care')}
                      </span>
                    </div>

                    {/* Radial Visual Metric */}
                    <div className="my-4 flex items-center justify-center">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-200"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            stroke={healthStyle.stroke}
                            strokeWidth="3.5"
                            strokeDasharray={`${healthScorePercent}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className={`text-2xl font-black ${healthStyle.text}`}>
                            {healthScorePercent}%
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{t.outOf100 || 'out of 100%'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200/60">
                    {healthScorePercent >= 75 
                      ? (t.healthGoodDesc || 'Good plant health! The current soil and weather are well suited for this crop to give a strong harvest.')
                      : healthScorePercent >= 55 
                      ? (t.healthFairDesc || 'Fair plant growth. Regular watering and adding organic compost will help protect and improve the yield.')
                      : (t.healthPoorDesc || 'Needs immediate attention. The crop is stressed by temperature or water conditions. Follow pest and soil tips.')}
                  </p>
                </div>

                {/* Risk Profile & Soil Insight */}
                <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                  
                  {/* Risk Profile Card */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          {t.riskProfile || 'Risk Profile:'} <span className={`ml-1 font-extrabold ${cropAnalysis.riskLevel === 'High' ? 'text-rose-600' : cropAnalysis.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>{cropAnalysis.riskLevel}</span>
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {t.districtPests || 'District Pests & Agro-Climatic Threats'}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3">
                      {cropAnalysis.riskFactors.map((rf, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/70">
                          <span className="text-amber-500 font-bold shrink-0">⚠️</span>
                          <span className="leading-relaxed">{rf}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Soil Insight Card */}
                  <div className={`p-4 sm:p-5 rounded-2xl border transition ${
                    cropAnalysis.soilMismatch 
                      ? 'bg-amber-50/70 border-amber-300' 
                      : 'bg-emerald-50/50 border-emerald-200/80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Layers className={`w-4 h-4 ${cropAnalysis.soilMismatch ? 'text-amber-700' : 'text-emerald-700'}`} />
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          {t.soilInsight || 'Soil Insight:'} {cropDetails.soilType}
                        </h4>
                      </div>
                      {cropAnalysis.soilMismatch && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {t.checkRequired || 'Visual Discrepancy Flagged'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {cropAnalysis.soilInsight}
                    </p>
                  </div>

                </div>

              </div>

              {/* HIGH RISK MITIGATION: RECOMMENDED ALTERNATE CROP */}
              {cropAnalysis.riskLevel === 'High' && cropAnalysis.bestAlternative && (
                <div className="mt-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50/60 to-emerald-50/40 border-2 border-rose-300 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                  
                  {/* Alert Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/80 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-rose-950 tracking-tight">
                            {t.highRiskMitigationTitle || '⚠️ High Agronomic Risk Detected — Resilient Alternate Crop Recommended'}
                          </h4>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-rose-300 uppercase">
                            {t.actionSuggested || 'Action Suggested'}
                          </span>
                        </div>
                        <p className="text-xs text-rose-900/90 mt-0.5">
                          {cropDetails.cropName} • {cropDetails.soilType} • {cropDetails.temperature}°C • {cropDetails.rainfall}mm
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Recommended Alternative Hero Card */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-rose-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            {t.topResilientMatch || 'Top Resilient Match'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {cropAnalysis.bestAlternative.category}
                          </span>
                        </div>
                        <h5 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          {cropAnalysis.bestAlternative.cropName}
                        </h5>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <span className="text-[10px] uppercase font-bold text-emerald-700 block">{t.agronomicFit || 'Agronomic Fit'}</span>
                          <span className="text-lg font-black text-emerald-800">
                            {cropAnalysis.bestAlternative.suitabilityScore}%
                          </span>
                        </div>

                        <div className="text-right bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                          <span className="text-[10px] uppercase font-bold text-teal-700 block">{t.projectedHealth || 'Projected Health'}</span>
                          <span className="text-lg font-black text-teal-800">
                            {altHealthPercent}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Why This Crop Succeeds in Farmer's Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t.soilFit || 'Soil Suitability'}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {cropAnalysis.bestAlternative.soilReason}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                          <span className="text-xs">🌡️</span>
                          <span>{t.tempFit || 'Climate Suitability'}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {cropAnalysis.bestAlternative.tempReason}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                          <span className="text-xs">💧</span>
                          <span>{t.rainFit || 'Water / Moisture Balance'}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {cropAnalysis.bestAlternative.rainReason}
                        </p>
                      </div>
                    </div>

                    {/* Side-by-Side Comparison */}
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                      <div className="bg-slate-100/90 px-3.5 py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>⚖️ {t.comparisonHeading || 'Field Input Compatibility Comparison:'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {cropDetails.soilType} • {cropDetails.temperature}°C • {cropDetails.rainfall}mm
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-[11px] text-slate-500 bg-white">
                              <th className="py-2 px-3 font-bold">{t.inputFactor || 'Input Factor'}</th>
                              <th className="py-2 px-3 font-bold text-rose-700">{t.currentCropCol || 'Current:'} {cropDetails.cropName}</th>
                              <th className="py-2 px-3 font-bold text-emerald-700">{t.recommendedCropCol || 'Recommended:'} {cropAnalysis.bestAlternative.cropName}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/70 text-[11px]">
                            <tr className="hover:bg-slate-100/40">
                              <td className="py-2 px-3 font-semibold text-slate-700 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-slate-500" />
                                <span>{t.soilFactor || 'Soil Type'}</span>
                              </td>
                              <td className="py-2 px-3 text-rose-700 font-medium">
                                {cropAnalysis.currentCropAgro?.soilStatus || (cropAnalysis.soilMismatch ? 'Soil Mismatch' : 'Needs Conditioning')}
                              </td>
                              <td className="py-2 px-3 text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>{cropAnalysis.bestAlternative.soilStatus} ({cropAnalysis.bestAlternative.soilScore}%)</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-100/40">
                              <td className="py-2 px-3 font-semibold text-slate-700 flex items-center gap-1">
                                <span>🌡️</span>
                                <span>{t.tempFactor || 'Temperature'}</span>
                              </td>
                              <td className="py-2 px-3 text-rose-700 font-medium">
                                {cropAnalysis.currentCropAgro?.tempStatus || 'Thermal Stress'}
                              </td>
                              <td className="py-2 px-3 text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>{cropAnalysis.bestAlternative.tempStatus} ({cropAnalysis.bestAlternative.tempScore}%)</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-100/40">
                              <td className="py-2 px-3 font-semibold text-slate-700 flex items-center gap-1">
                                <span>💧</span>
                                <span>{t.rainFactor || 'Rainfall'}</span>
                              </td>
                              <td className="py-2 px-3 text-rose-700 font-medium">
                                {cropAnalysis.currentCropAgro?.rainStatus || 'Moisture Stress'}
                              </td>
                              <td className="py-2 px-3 text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>{cropAnalysis.bestAlternative.rainStatus} ({cropAnalysis.bestAlternative.rainScore}%)</span>
                              </td>
                            </tr>
                            <tr className="bg-emerald-50/30">
                              <td className="py-2 px-3 font-bold text-slate-800">
                                <span>{t.projectedHealthScoreLabel || 'Projected Health Score'}</span>
                              </td>
                              <td className="py-2 px-3 font-black text-rose-600">
                                {healthScorePercent}% ({t.highRiskBadge || 'High Risk ⚠️'})
                              </td>
                              <td className="py-2 px-3 font-black text-emerald-700">
                                {altHealthPercent}% ({t.highPotentialBadge || 'High Potential ✅'})
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Financial Safety & Switch Action Button */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold text-slate-900">{t.economicProtectionLabel || 'Economic Protection:'} </span>
                        <span>
                          {cropAnalysis.bestAlternative.msp 
                            ? `${t.mspAssurance || 'Govt MSP assurance of'} ₹${cropAnalysis.bestAlternative.msp.toLocaleString('en-IN')}${t.perQuintal || '/quintal'}`
                            : `Mandi Price: ₹${cropAnalysis.bestAlternative.basePriceRange.min.toLocaleString('en-IN')} - ₹${cropAnalysis.bestAlternative.basePriceRange.max.toLocaleString('en-IN')}${t.perQuintal || '/quintal'}`}
                        </span>
                      </div>

                      {onSelectAlternateCrop && (
                        <button
                          type="button"
                          onClick={() => onSelectAlternateCrop(cropAnalysis.bestAlternative.cropKey)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 hover:shadow-emerald-700/30 transition flex items-center justify-center gap-2 group shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                          <span>{t.switchAndReanalyze || 'Switch & Re-analyze'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Runner-up Alternate Options */}
                  {cropAnalysis.alternateCrops && cropAnalysis.alternateCrops.length > 1 && (
                    <div className="mt-3.5 pt-3 border-t border-rose-200/60">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                        {t.otherAlternatives || 'Other Compatible Crop Alternatives:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {cropAnalysis.alternateCrops.slice(1, 3).map((alt) => (
                          <div
                            key={alt.cropKey}
                            className="bg-white/90 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{alt.cropName}</div>
                              <div className="text-[11px] text-slate-500">
                                {alt.suitabilityScore}% Fit • {t.projectedHealth}: {Number(alt.projectedHealthScore) <= 10 ? Math.round(Number(alt.projectedHealthScore) * 10) : alt.projectedHealthScore}%
                              </div>
                            </div>
                            {onSelectAlternateCrop && (
                              <button
                                type="button"
                                onClick={() => onSelectAlternateCrop(alt.cropKey)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg border border-slate-200 font-semibold text-[11px] transition shrink-0"
                              >
                                {t.switchBtn || 'Switch'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* ==================================================== */}
            {/* SECTION 2: ECONOMIC OUTLOOK & PRICE FORECASTING     */}
            {/* ==================================================== */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">💰</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {t.economicOutlook || 'Economic Outlook & Harvest Price Forecast'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {t.regionalPopularityLabel || 'Regional Popularity:'} {cropDetails.regionalPopularity}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Predicted Harvest Price Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 p-5 rounded-2xl border border-emerald-200 shadow-sm">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CircleDollarSign className="w-4 h-4 text-emerald-700" />
                    {t.predictedHarvestPrice || 'Predicted Harvest Price'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-2 tracking-tight">
                    {economicOutlook.predictedPriceRange}
                  </div>
                  <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
                    <span>{t.baseMspBenchmark || 'Base MSP / Benchmark:'}</span>
                    <span className="font-bold">₹{economicOutlook.baseMinPrice} - ₹{economicOutlook.baseMaxPrice}/qtl</span>
                  </div>
                </div>

                {/* Market Trend & Sentiment */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      {economicOutlook.marketSentiment.includes('Bullish') || economicOutlook.marketSentiment.includes('ತೇಜಿ') || economicOutlook.marketSentiment.includes('పెరుగుదల') || economicOutlook.marketSentiment.includes('तेजी') ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                      )}
                      {t.marketSentiment || 'Market Sentiment'}
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${
                        economicOutlook.marketSentiment.includes('Bullish') || economicOutlook.marketSentiment.includes('ತೇಜಿ') || economicOutlook.marketSentiment.includes('పెరుగుదల') || economicOutlook.marketSentiment.includes('तेजी')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {economicOutlook.marketSentiment}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {economicOutlook.marketTrendReasoning}
                  </p>
                </div>

                {/* Opportunity Summary Card */}
                <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      {t.marketOpportunity || 'Market Opportunity'}
                    </div>
                    <div className="text-sm font-bold text-amber-950 mt-2">
                      {economicOutlook.valueAddition.action}
                    </div>
                  </div>

                  <p className="text-xs text-amber-900/90 mt-2 leading-relaxed">
                    {economicOutlook.opportunity}
                  </p>
                </div>

              </div>

              {/* Interactive Value-Add Calculator Widget */}
              <div className="mt-4">
                <ValueAddCalculator
                  cropName={cropDetails.cropName}
                  valueAddition={economicOutlook.valueAddition}
                  predictedMinPrice={economicOutlook.predictedMinPrice}
                  predictedMaxPrice={economicOutlook.predictedMaxPrice}
                  landSize={farmerProfile.landSize}
                  language={language}
                />
              </div>

              {/* Interstate Market Redirection Callout */}
              {onNavigateToRedirection && (
                <div className={`mt-4 p-4 sm:p-5 rounded-2xl border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  cropDetails.regionalPopularity > 70
                    ? 'bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 border-2 border-amber-400'
                    : 'bg-emerald-50/60 border-emerald-200'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        cropDetails.regionalPopularity > 70
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {cropDetails.regionalPopularity > 70 ? (t.glutWarningBanner || '🚨 Over-Supply Warning (> 70%)') : (t.interstateMapBanner || '🚚 Interstate Market Map')}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {cropDetails.regionalPopularity > 70 
                          ? `${t.localGlutAlert || 'Local Glut Alert in'} ${farmerProfile.translatedDistrict || farmerProfile.district}` 
                          : (t.priceArbitrage || 'Interstate Wholesale Price Arbitrage')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {cropDetails.regionalPopularity > 70
                        ? (t.glutAlertDesc || 'Over 70% of farmers in your district are growing this crop. Avoid local auction distress by redirecting harvest to high-demand deficit states with higher net profit margins!')
                        : (t.arbitrageDesc || 'Compare wholesale APMC mandi prices in neighboring states and view live transport routes on the interactive map.')}
                    </p>
                  </div>
                  <button
                    onClick={onNavigateToRedirection}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
                  >
                    <span>{t.btnOpenMap || 'Open Market Redirection Map'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* ==================================================== */}
            {/* SECTION 3: GOVERNANCE & FINANCIAL GUIDANCE          */}
            {/* ==================================================== */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏛</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {t.governanceFinance || 'Governance Policies & Tailored Financial Guidance'}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {onNavigateToGovernance && (
                    <button
                      onClick={onNavigateToGovernance}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition flex items-center gap-1 shadow-xs"
                    >
                      <span>{t.btnOpenGovernancePortal || 'Open Full Governance & Loan Portal'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {farmerProfile.landSize} {t.acresUnit || 'Acres'} ({farmerProfile.isSmallholder ? (t.smallholderTag || 'Smallholder') : (t.commercialTag || 'Commercial')})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Card 1: Applicable Policies */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {t.applicablePolicies || 'Applicable Government Policies & Subsidies'}
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {governanceAndFinance.allSchemes.map((scheme, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-xs text-emerald-900 flex items-center justify-between gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{scheme.name}</span>
                            </div>
                            {scheme.portalName && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {scheme.portalName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 pl-5 leading-relaxed">
                            {scheme.benefit}
                          </p>
                        </div>
                        <div className="mt-2.5 pl-5">
                          <a
                            href={scheme.applyUrl || 'https://fruits.karnataka.gov.in/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs hover:shadow"
                          >
                            <span>{t.applyOnlineFor || 'Apply Online for'} {scheme.name.split('(')[0].trim()}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Direct Official Government Application Portals */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      {t.officialPortalsTitle || 'Official Government Scheme Portals:'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href="https://fruits.karnataka.gov.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-between shadow-xs"
                      >
                        <span>{t.fruitsPortalName || 'Karnataka FRUITS Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="https://pmkisan.gov.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center justify-between shadow-xs"
                      >
                        <span>{t.pmKisanPortalName || 'Central PM-KISAN Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-500 italic">
                    {t.subsidiesTailoredFor || `Subsidies tailored specifically for crop cultivation in ${farmerProfile.translatedDistrict || farmerProfile.district}.`}
                  </div>
                </div>

                {/* Card 2: Tailored Bank Loans */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-5 rounded-2xl border border-emerald-800/60 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                          {t.recommendedLoan || 'Recommended Bank Loan'}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {governanceAndFinance.recommendedLoan.tier}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-extrabold text-white">
                        {governanceAndFinance.recommendedLoan.primaryLoan}
                      </div>
                      <div className="text-xs text-emerald-300 font-semibold mt-1">
                        {t.interestRateLabel || 'Interest Rate:'} {governanceAndFinance.recommendedLoan.interestRate}
                      </div>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>{t.maxLimitLabel || 'Max Limit:'}</span>
                        <span className="font-bold text-white">{governanceAndFinance.recommendedLoan.maxLimit}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>{t.tenureLabel || 'Tenure:'}</span>
                        <span className="font-bold text-white">{governanceAndFinance.recommendedLoan.repaymentTenure}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{t.keyEligibilityLabel || 'Key Eligibility:'}</div>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {governanceAndFinance.recommendedLoan.eligibilityCriteria.map((crit, idx) => (
                          <li key={idx} className="leading-snug">{crit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-4 mt-3 border-t border-slate-800">
                    <a
                      href={governanceAndFinance.recommendedLoan.actionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950"
                    >
                      <span>{t.actionLink || 'Access Official Portal'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>

              </div>
            </div>
          </>
        ) : (
          /* TAB 2: PRISTINE MARKDOWN SYSTEM PROMPT VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{t.masterMarkdownTitle || 'Standard Markdown Output'}</span>
              </div>
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied : t.copyMarkdown}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-100 p-6 rounded-2xl overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed border border-slate-800 shadow-inner select-all whitespace-pre-wrap">
              {markdownOutput}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
