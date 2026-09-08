import React, { useState } from 'react';
import { Sprout, Globe, Settings, History, Volume2, Check, ChevronDown } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

export default function Navbar({
  language,
  setLanguage,
  onOpenHistory,
  onOpenSettings,
  isAudioPlaying,
  onStopAudio
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-600/20">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-sans">
                  Agri<span className="text-emerald-600">Copilot</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                  v2.4 AI
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Autonomous Agronomic Advisory & Market Decision Intelligence
              </p>
            </div>
          </div>

          {/* Center / Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Audio narration indicator if active */}
            {isAudioPlaying && (
              <button
                onClick={onStopAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-300 rounded-lg animate-pulse hover:bg-rose-100 transition"
                title="Stop Audio Narration"
              >
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden md:inline">Playing Voice...</span> (Stop)
              </button>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline font-medium">
                  {languages.find(l => l.code === language)?.native || 'English'}
                </span>
                <span className="sm:hidden uppercase">{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-emerald-50 text-slate-700 flex items-center justify-between transition"
                    >
                      <span>{l.native} <span className="text-slate-400 text-xs">({l.label})</span></span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition flex items-center gap-1.5"
              title="View Advisory History"
            >
              <History className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">History</span>
            </button>
            {/* Settings (Live API Key configuration) */}
            <button
              onClick={onOpenSettings}
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition flex items-center gap-1.5"
              title="Configure API Settings"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">Settings</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
