import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FarmerInputForm from './components/FarmerInputForm';
import AdvisoryReport from './components/AdvisoryReport';
import SettingsModal from './components/SettingsModal';
import AdvisoryHistoryModal from './components/AdvisoryHistoryModal';
import DesignDocsModal from './components/DesignDocsModal';
import AIGenerationModal from './components/AIGenerationModal';
import Footer from './components/Footer';
import { generateLocalAdvisory, callGeminiAdvisoryAPI } from './services/advisoryEngine.js';
import { stopAdvisorySpeech } from './services/speechService.js';
import { TRANSLATIONS, getTranslatedCropName, getTranslatedDistrict } from './translations.js';
import MarketRedirectionMap from './components/MarketRedirectionMap';
import GovernanceAndFinanceTab from './components/GovernanceAndFinanceTab';
import { CheckCircle2, Sparkles, TrendingUp, ShieldAlert, Cpu, FileText, Eye, ArrowRight, X, Truck, Navigation, Landmark } from 'lucide-react';

const defaultFormData = {
  farmerName: '',
  landSize: '',
  district: '',
  cropName: '',
  soilType: '',
  temperature: '',
  rainfall: '',
  regionalPopularity: 50,
  soilImage: null,
  soilAnalysisResult: null
};

export default function App() {
  const [formData, setFormData] = useState(defaultFormData);
  const [advisory, setAdvisory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [history, setHistory] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('form'); // 'form' | 'report' | 'redirection' | 'governance'
  const [successToast, setSuccessToast] = useState(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Modals
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  // Settings
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('agri_gemini_key') || '');
  const [modelName, setModelName] = useState(() => localStorage.getItem('agri_gemini_model') || 'gemini-1.5-flash');

  // Load history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('agri_advisory_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse stored history', e);
      }
    }
  }, []);

  // When language changes, if an active advisory exists, re-generate it in the newly chosen language
  useEffect(() => {
    if (advisory && formData.cropName && formData.soilType) {
      const updated = generateLocalAdvisory({ ...formData, language });
      setAdvisory(updated);
    }
  }, [language]);

  // Handle Form Submission with Diagnostic Modal
  const handleGenerateAdvisory = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsGenerating(true);
    setIsSaved(false);
    setIsModalOpen(true);
  };

  // Called when AI Diagnostic Modal completes all evaluation steps
  const handleDiagnosticComplete = async () => {
    try {
      let resultAdvisory = null;

      // If user configured a live Gemini API key, attempt live multimodal LLM call
      if (apiKey && apiKey.trim().length > 15) {
        try {
          const liveMarkdown = await callGeminiAdvisoryAPI({
            apiKey: apiKey.trim(),
            modelName,
            formData,
            base64Image: formData.soilImage,
            language
          });

          resultAdvisory = generateLocalAdvisory({ ...formData, language });
          if (liveMarkdown) {
            resultAdvisory.markdownOutput = liveMarkdown;
          }
        } catch (apiErr) {
          console.warn('Live API call failed, falling back to offline agronomic engine:', apiErr);
          resultAdvisory = generateLocalAdvisory({ ...formData, language });
        }
      } else {
        resultAdvisory = generateLocalAdvisory({ ...formData, language });
      }

      if (resultAdvisory) {
        setAdvisory(resultAdvisory);
        setSuccessToast(t.advisoryGeneratedToast || `AgriCopilot Advisory generated successfully!`);
        setTimeout(() => setSuccessToast(null), 5000);
      }

      // Switch to report tab
      setActiveMainTab('report');

      setTimeout(() => {
        const el = document.getElementById('advisory-result-anchor');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Error in advisory generation:', err);
      const fallback = generateLocalAdvisory({ ...formData, language });
      setAdvisory(fallback);
    } finally {
      setIsModalOpen(false);
      setIsGenerating(false);
    }
  };

  // Handle 1-click switch to alternate recommended crop
  const handleSelectAlternateCrop = (alternateCropKey) => {
    const updatedFormData = {
      ...formData,
      cropName: alternateCropKey
    };
    setFormData(updatedFormData);
    const newAdvisory = generateLocalAdvisory({ ...updatedFormData, language });
    setAdvisory(newAdvisory);
    setSuccessToast(`${t.switchToAlternate}: ${getTranslatedCropName(alternateCropKey, language)}`);
    setTimeout(() => setSuccessToast(null), 4000);

    setTimeout(() => {
      const el = document.getElementById('advisory-result-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Save current advisory to history
  const handleSaveToHistory = () => {
    if (!advisory) return;
    const updated = [advisory, ...history.slice(0, 19)];
    setHistory(updated);
    localStorage.setItem('agri_advisory_history', JSON.stringify(updated));
    setIsSaved(true);
    setSuccessToast(t.saveSuccessToast || 'Advisory successfully saved to your farm records!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Delete single history item
  const handleDeleteSingleHistory = (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem('agri_advisory_history', JSON.stringify(updated));
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('agri_advisory_history');
  };

  // Load from history modal
  const handleSelectAdvisoryFromHistory = (savedAdvisory) => {
    setAdvisory(savedAdvisory);
    setFormData({
      farmerName: savedAdvisory.farmerProfile.name,
      landSize: savedAdvisory.farmerProfile.landSize,
      district: savedAdvisory.farmerProfile.district,
      cropName: savedAdvisory.cropDetails.rawCropKey || savedAdvisory.cropDetails.cropName,
      soilType: savedAdvisory.cropDetails.soilTypeId || 'red',
      temperature: savedAdvisory.cropDetails.temperature,
      rainfall: savedAdvisory.cropDetails.rainfall,
      regionalPopularity: savedAdvisory.cropDetails.regionalPopularity,
      soilImage: savedAdvisory.farmerProfile.soilImage || null
    });
    setIsSaved(true);
    setActiveMainTab('report');
  };

  const handleStopAudio = () => {
    stopAdvisorySpeech();
    setIsAudioPlaying(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Main Top Navigation */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onStopAudio={handleStopAudio}
      />

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-400/50 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="ml-2 text-emerald-300 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Banner with Executive Overview */}
      <div className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white py-6 sm:py-9 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.heroTag || 'Karnataka AI Agronomist & Decision Intelligence Platform'}</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {t.heroHeading || 'Precision Agronomy, APMC Price Forecasts & Bank Credit'}
              </h1>
              
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {t.heroDesc || 'AI-powered agricultural intelligence platform delivering soil insights, crop recommendations, market forecasts, government scheme discovery, and personalized credit guidance for every farmer.'}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-2 gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center shrink-0">
              <div className="px-3 border-r border-white/10">
                <div className="text-lg font-black text-amber-400">4%</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">{t.statInterest || 'KCC Interest'}</div>
              </div>
              <div className="px-3">
                <div className="text-lg font-black text-teal-400">100%</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">{t.statOffline || 'Offline Ready'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Navigation Ribbon */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveMainTab('form')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeMainTab === 'form'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.tabForm || 'Farmer Profile'}</span>
            </button>

            <button
              onClick={() => setActiveMainTab('report')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeMainTab === 'report'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{t.tabReport || 'Advisory Report'}</span>
            </button>

            <button
              onClick={() => setActiveMainTab('redirection')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeMainTab === 'redirection'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>{t.tabMap || 'Market Redirection'}</span>
            </button>

            <button
              onClick={() => setActiveMainTab('governance')}
              className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeMainTab === 'governance'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>{t.tabGovernance || 'Governance & Finance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: FARMER INPUT FORM */}
        {activeMainTab === 'form' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <FarmerInputForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGenerateAdvisory}
              isGenerating={isGenerating}
              language={language}
            />
          </div>
        )}

        {/* VIEW 2: ADVISORY REPORT */}
        {activeMainTab === 'report' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div id="advisory-result-anchor" />
            {advisory ? (
              <AdvisoryReport
                advisory={advisory}
                language={language}
                onSaveHistory={handleSaveToHistory}
                isSaved={isSaved}
                onNavigateToRedirection={() => setActiveMainTab('redirection')}
                onNavigateToGovernance={() => setActiveMainTab('governance')}
                onSelectAlternateCrop={handleSelectAlternateCrop}
              />
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-40" />
                <h3 className="text-base font-bold text-slate-800">{t.noAdvisoryTitle || 'No Advisory Generated Yet'}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {t.noAdvisoryDesc || 'Please fill the farmer and crop details form to generate your personalized advisory report.'}
                </p>
                <button
                  onClick={() => setActiveMainTab('form')}
                  className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {t.btnGoToForm || 'Go to Farmer Form'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: MARKET REDIRECTION & INTERSTATE MAP */}
        {activeMainTab === 'redirection' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <MarketRedirectionMap
              defaultDistrict={formData.district || 'Davanagere'}
              defaultCrop={formData.cropName || 'Maize / Corn'}
              defaultPopularity={formData.regionalPopularity || 75}
              defaultLotSize={formData.landSize ? Math.max(20, Math.round(Number(formData.landSize) * 25)) : 80}
              onNavigateToForm={() => setActiveMainTab('form')}
              onNavigateToReport={() => setActiveMainTab('report')}
              language={language}
            />
          </div>
        )}

        {/* VIEW 4: GOVERNANCE POLICIES & TAILORED FINANCIAL GUIDANCE */}
        {activeMainTab === 'governance' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <GovernanceAndFinanceTab
              defaultLandSize={formData.landSize ? Number(formData.landSize) : 3.5}
              defaultDistrict={formData.district || 'Davanagere'}
              defaultCrop={formData.cropName || 'Maize / Corn'}
              farmerName={formData.farmerName}
              onNavigateToForm={() => setActiveMainTab('form')}
              onNavigateToReport={() => setActiveMainTab('report')}
              language={language}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* AI Diagnostic Scan Animated Modal */}
      <AIGenerationModal
        isOpen={isModalOpen}
        farmerName={formData.farmerName}
        cropName={formData.cropName}
        district={formData.district}
        landSize={formData.landSize}
        soilType={formData.soilType}
        language={language}
        onComplete={handleDiagnosticComplete}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        modelName={modelName}
        setModelName={setModelName}
        language={language}
      />

      {/* History Modal */}
      <AdvisoryHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectAdvisory={handleSelectAdvisoryFromHistory}
        onClearHistory={handleClearHistory}
        onDeleteSingle={handleDeleteSingleHistory}
        language={language}
      />

      {/* Design Docs Modal */}
      <DesignDocsModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
        language={language}
      />

    </div>
  );
}
