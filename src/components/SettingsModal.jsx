import React, { useState } from 'react';
import { Settings, Key, Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  modelName,
  setModelName,
  language = 'en'
}) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [tempModel, setTempModel] = useState(modelName || 'gemini-1.5-flash');
  const [saved, setSaved] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey);
    setModelName(tempModel);
    localStorage.setItem('agri_gemini_key', tempKey);
    localStorage.setItem('agri_gemini_model', tempModel);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">{t.settingsTitle || 'AgriCopilot AI Engine Settings'}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t.offlineEngineActive || 'Offline Agronomic Engine is Active:'} </span>
              {t.offlineEngineDesc || 'By default, AgriCopilot executes locally using deterministic agronomic rules, Agmarknet price algorithms, and policy databases without needing an external API key!'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-emerald-600" />
              {t.geminiApiKeyLabel || 'Google Gemini API Key (Optional for Live LLM):'}
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder={t.geminiKeyPlaceholder || 'AIzaSy...'}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {t.geminiModelLabel || 'Gemini Model Architecture:'}
            </label>
            <select
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-medium"
            >
              <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
              <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
              <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
            </select>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            {t.cancelBtn || 'Cancel'}
          </button>

          <button
            onClick={handleSave}
            disabled={saved}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.saved || 'Saved!'}</span>
              </>
            ) : (
              <span>{t.saveSettingsBtn || 'Save Settings'}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
