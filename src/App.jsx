import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MandiTicker from './components/MandiTicker';
import FarmerInputForm from './components/FarmerInputForm';
import AdvisoryReport from './components/AdvisoryReport';
import SettingsModal from './components/SettingsModal';
import AdvisoryHistoryModal from './components/AdvisoryHistoryModal';
import DesignDocsModal from './components/DesignDocsModal';
import AIGenerationModal from './components/AIGenerationModal';
import Footer from './components/Footer';
import { generateLocalAdvisory, callGeminiAdvisoryAPI } from './services/advisoryEngine.js';
import { stopAdvisorySpeech } from './services/speechService.js';
import { TRANSLATIONS } from './translations.js';
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
  const [activeMainTab, setActiveMainTab] = useState('form'); // 'form' | 'report'
  const [successToast, setSuccessToast] = useState(null);

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

  // Handle Form Submission with High-Tech Diagnostic Modal
  const handleGenerateAdvisory = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsGenerating(true);
    setIsSaved(false);
    setIsModalOpen(true); // Opens the animated diagnostic HUD
  };

  // Called when AI Diagnostic Modal completes all 6 evaluation steps
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
            base64Image: formData.soilImage
          });

          resultAdvisory = generateLocalAdvisory(formData);
          if (liveMarkdown) {
            resultAdvisory.markdownOutput = liveMarkdown;
          }
        } catch (apiErr) {
          console.warn('Live API call failed, falling back to offline agronomic engine:', apiErr);
          resultAdvisory = generateLocalAdvisory(formData);
        }
      } else {
        resultAdvisory = generateLocalAdvisory(formData);
      }

      if (resultAdvisory) {
        setAdvisory(resultAdvisory);
        setSuccessToast(`AgriCopilot Advisory updated for ${formData.farmerName} in ${formData.district}!`);
        setTimeout(() => setSuccessToast(null), 5000);
      }

      // Switch to report tab
      setActiveMainTab('report');

      // Smooth scroll to advisory section
      setTimeout(() => {
        const el = document.getElementById('advisory-result-anchor');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Error in advisory generation:', err);
      const fallback = generateLocalAdvisory(formData);
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
    const newAdvisory = generateLocalAdvisory(updatedFormData);
    setAdvisory(newAdvisory);
    setSuccessToast(`Plan switched to ${alternateCropKey}! High risk mitigated (Health Score: ${newAdvisory.cropAnalysis.healthScore}%).`);
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
    const updated = [advisory, ...history.slice(0, 19)]; // Keep latest 20
    setHistory(updated);
    localStorage.setItem('agri_advisory_history', JSON.stringify(updated));
    setIsSaved(true);
    setSuccessToast('Advisory successfully saved to your farm records!');
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
      cropName: savedAdvisory.cropDetails.cropName,
      soilType: savedAdvisory.cropDetails.soilTypeId || 'black',
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
      
      {/* Live Karnataka APMC & Mandi Ticker */}
      <MandiTicker currentLang={language} />

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
                <span>Karnataka AI Agronomist & Decision Intelligence Platform</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Precision Agronomy, APMC Price Forecasts & Bank Credit
              </h1>
              
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Hyper-localized agricultural advisory powering Karnataka and national farmers with soil spectral analysis, harvest price forecasting, Raitha Siri & Krishi Bhagya schemes, and land-size tailored credit.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center shrink-0">
              <div className="px-2">
                <div className="text-lg font-black text-emerald-400">12</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">KA Districts</div>
              </div>
              <div className="px-2 border-x border-white/10">
                <div className="text-lg font-black text-amber-400">4%</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">KCC Interest</div>
              </div>
              <div className="px-2">
                <div className="text-lg font-black text-teal-400">100%</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Offline Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Navigation Ribbon */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit flex-wrap">
            <button
              onClick={() => setActiveMainTab('form')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeMainTab === 'form'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Farmer & Crop Form</span>
            </button>

            <button
              onClick={() => setActiveMainTab('report')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeMainTab === 'report'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2. Advisory Report</span>
              {advisory && (
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-mono">
                  {advisory.cropAnalysis.healthScore}%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMainTab('redirection')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeMainTab === 'redirection'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>3. Market Redirection (Map)</span>
              {Number(formData.regionalPopularity) > 70 ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  Glut &gt; 70%
                </span>
              ) : (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  Interstate
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMainTab('governance')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeMainTab === 'governance'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>4. Governance & Finance</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Policies & Loans
              </span>
            </button>
          </div>

          {/* Active Status & Quick Jump */}
          <div className="flex items-center gap-3 text-xs">
            {formData.farmerName && (
              <span className="text-slate-500 hidden xl:inline">
                Selected: <strong className="text-slate-900">{formData.farmerName}</strong> ({formData.cropName} in <strong className="text-emerald-700">{formData.district}</strong>)
              </span>
            )}

            {activeMainTab === 'form' && advisory && (
              <button
                onClick={() => setActiveMainTab('report')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 transition flex items-center gap-1 shrink-0"
              >
                <span>View Advisory Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeMainTab === 'report' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMainTab('form')}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center gap-1 shrink-0"
                >
                  <span>← Edit Form</span>
                </button>
                <button
                  onClick={() => setActiveMainTab('governance')}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 transition flex items-center gap-1 shrink-0"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Policies & Loans Hub →</span>
                </button>
                <button
                  onClick={() => setActiveMainTab('redirection')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center gap-1 shrink-0 ${
                    Number(formData.regionalPopularity) > 70
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold border-amber-400 shadow-xs animate-pulse'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{Number(formData.regionalPopularity) > 70 ? '🚨 Route Map →' : 'Interstate Map →'}</span>
                </button>
              </div>
            )}

            {activeMainTab === 'redirection' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMainTab('form')}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center gap-1 shrink-0"
                >
                  <span>← Edit Form</span>
                </button>
                <button
                  onClick={() => setActiveMainTab('governance')}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 transition flex items-center gap-1 shrink-0"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Policies & Loans →</span>
                </button>
                {advisory && (
                  <button
                    onClick={() => setActiveMainTab('report')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 transition flex items-center gap-1 shrink-0"
                  >
                    <span>View Advisory →</span>
                  </button>
                )}
              </div>
            )}

            {activeMainTab === 'governance' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMainTab('form')}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center gap-1 shrink-0"
                >
                  <span>← Edit Form</span>
                </button>
                {advisory && (
                  <button
                    onClick={() => setActiveMainTab('report')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 transition flex items-center gap-1 shrink-0"
                  >
                    <span>View Advisory →</span>
                  </button>
                )}
              </div>
            )}
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
                <h3 className="text-base font-bold text-slate-800">No Advisory Generated Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Please fill the farmer and crop details form to generate your personalized advisory report.
                </p>
                <button
                  onClick={() => setActiveMainTab('form')}
                  className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Go to Farmer Form
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
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* AI Diagnostic Scan Animated Modal */}
      <AIGenerationModal
        isOpen={isModalOpen}
        farmerName={formData.farmerName}
        cropName={formData.cropName}
        district={formData.district}
        landSize={formData.landSize}
        soilType={formData.soilType}
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
      />

      {/* History Modal */}
      <AdvisoryHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectAdvisory={handleSelectAdvisoryFromHistory}
        onClearHistory={handleClearHistory}
        onDeleteSingle={handleDeleteSingleHistory}
      />

      {/* Design Docs Modal */}
      <DesignDocsModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

    </div>
  );
}
