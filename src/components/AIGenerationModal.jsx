import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Cpu, Database, Activity, ShieldCheck } from 'lucide-react';

export default function AIGenerationModal({
  isOpen,
  farmerName,
  cropName,
  district,
  landSize,
  soilType,
  onComplete
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  const steps = [
    { title: 'Checking Soil & Field Conditions', detail: `Reviewing ${soilType} soil characteristics and crop suitability` },
    { title: 'District Weather & Pest Check', detail: `Checking localized climate and crop risks for ${district}` },
    { title: 'Market Price & Demand Forecast', detail: `Estimating harvest price range and market demand` },
    { title: 'Government Schemes & Subsidies', detail: `Finding eligible central and Karnataka farming benefits` },
    { title: 'Bank Loan Recommendations', detail: `Selecting suitable loan options for ${landSize} Acres (${parseFloat(landSize) < 2 ? 'Smallholder KCC' : 'Commercial Scale'})` },
    { title: 'Preparing Your Farm Advisory', detail: `Writing practical, easy-to-follow farm instructions` }
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

        {/* Header */}
        <div className="p-6 border-b border-slate-800 text-center relative z-10">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-900/50 ring-4 ring-emerald-500/20">
              <Activity className="w-8 h-8 animate-pulse text-white" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Agronomist Preparing Advisory
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            Synthesizing Advisory for <span className="text-emerald-400">{farmerName}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Evaluating {cropName} cultivation in {district} ({landSize} Acres)
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>Progress</span>
            <span className="text-emerald-400 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="p-6 space-y-3 relative z-10 max-h-72 overflow-y-auto">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-emerald-950/60 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-slate-800/40 border-slate-700/60 opacity-80'
                    : 'bg-slate-900/30 border-slate-800/40 opacity-40'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="relative flex h-5 w-5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 ml-0.5" />
                  )}
                </div>

                <div className="overflow-hidden">
                  <div className={`text-xs font-bold ${isCurrent ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Grounded with Agmarknet live mandi indices, Karnataka KSAPC benchmarks & soil rules
        </div>

      </div>
    </div>
  );
}
