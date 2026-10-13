import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Cpu, Database, Activity, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS, getTranslatedCropName, getTranslatedSoilName, getTranslatedDistrict } from '../translations';

export default function AIGenerationModal({
  isOpen,
  farmerName,
  cropName,
  district,
  landSize,
  soilType,
  language = 'en',
  onComplete
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const translatedCrop = getTranslatedCropName(cropName, language) || cropName;
  const translatedSoil = getTranslatedSoilName(soilType, language) || soilType;
  const translatedDistrict = getTranslatedDistrict(district, language) || district;

  const steps = [
    { 
      title: t.step1Title || 'Checking Soil & Field Conditions', 
      detail: `${translatedSoil}: ${t.step1Detail || 'Reviewing soil characteristics and crop suitability'}` 
    },
    { 
      title: t.step2Title || 'District Weather & Pest Check', 
      detail: `${translatedDistrict}: ${t.step2Detail || 'Checking localized climate and crop risks'}` 
    },
    { 
      title: t.step3Title || 'Market Price & Demand Forecast', 
      detail: `${translatedCrop}: ${t.step3Detail || 'Estimating harvest price range and market demand'}` 
    },
    { 
      title: t.step4Title || 'Government Schemes & Subsidies', 
      detail: t.step4Detail || 'Finding eligible central and Karnataka farming benefits' 
    },
    { 
      title: t.step5Title || 'Bank Loan Recommendations', 
      detail: `${landSize || '2'} ${t.acresUnit || 'Acres'} - ${parseFloat(landSize) < 2 ? (t.smallholderTag || 'Smallholder') : (t.commercialTag || 'Commercial')}: ${t.step5Detail || 'Selecting suitable credit options'}` 
    },
    { 
      title: t.step6Title || 'Preparing Your Farm Advisory', 
      detail: t.step6Detail || 'Writing practical, easy-to-follow farm instructions' 
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(15);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          const next = prev + 1;
          setProgress(Math.round(((next + 1) / steps.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 350);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden relative">
        
        {/* Animated glowing backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 animate-pulse">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>{t.aiModalTitle || 'AgriCopilot Neural Agronomy Engine'}</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-400 font-medium">
                {t.aiModalSubtitle || 'Synthesizing Multimodal Soil, Climate & APMC Market Intelligence...'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
              <span>{t.progressLabel || 'Evaluation in progress...'}</span>
              <span className="text-emerald-400 font-mono font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-400/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Diagnostic Steps Checklist */}
        <div className="p-6 space-y-3 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all duration-200 flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-950/50 scale-[1.01]'
                    : isCompleted
                    ? 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                    : 'bg-slate-900/30 border-slate-800/30 text-slate-600 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                  )}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                        Scanning
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info pill */}
        <div className="bg-slate-950/80 px-6 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.statOffline || 'Offline Agronomic Rules Active'}</span>
          </div>
          <span className="font-mono text-slate-500">AgriCopilot 2.4</span>
        </div>

      </div>
    </div>
  );
}
