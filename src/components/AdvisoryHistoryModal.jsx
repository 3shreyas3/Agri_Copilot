import React from 'react';
import { History, X, Trash2, ArrowRight } from 'lucide-react';
import { TRANSLATIONS, getTranslatedCropName, getTranslatedDistrict } from '../translations';

export default function AdvisoryHistoryModal({
  isOpen,
  onClose,
  history = [],
  onSelectAdvisory,
  onClearHistory,
  onDeleteSingle,
  language = 'en'
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">{t.historyTitle || 'Saved Farmer Advisories'}</h3>
              <p className="text-xs text-slate-400">{t.historySubtitle || 'Review and compare previous crop cycle evaluations'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
              <p className="text-sm font-semibold text-slate-600">{t.noHistoryTitle || 'No saved advisories yet'}</p>
              <p className="text-xs text-slate-400 mt-1">{t.noHistoryDesc || 'Generate an advisory and click "Save" to build your farm record history.'}</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {item.farmerProfile?.name ? item.farmerProfile.name.charAt(0).toUpperCase() : '🌾'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.farmerProfile.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {getTranslatedCropName(item.cropDetails?.rawCropKey || item.cropDetails?.cropName, language)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>{getTranslatedDistrict(item.farmerProfile?.district, language)}</span>
                      <span>•</span>
                      <span>{item.farmerProfile?.landSize} {t.acresUnit || 'Acres'}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-700">
                        {item.cropAnalysis?.healthScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectAdvisory(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <span>{t.viewReportBtn || 'View Report'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteSingle(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title={t.deleteBtn || 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              {history.length} {t.saved || 'Saved'}
            </span>
            <button
              onClick={onClearHistory}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
            >
              {t.clearAllHistory || 'Clear All History'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
