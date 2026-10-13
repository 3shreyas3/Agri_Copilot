import React from 'react';
import { Sprout, ShieldCheck, ExternalLink } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

export default function Footer({ language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">{t.appTitle || 'AgriCopilot'}</span>
              <p className="text-[11px] text-slate-500">{t.footerSubtitle || 'Autonomous Agricultural Intelligence & Decision Support Platform'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a 
              href="https://agmarknet.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              Agmarknet Mandis <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://pmkisan.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              {t.pmKisanPortalName || 'PM-KISAN Portal'} <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://fruits.karnataka.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              {t.fruitsPortalName || 'Karnataka FRUITS'} <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://pmfby.gov.in" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              PM Fasal Bima (PMFBY) <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t.footerEmpower || 'Empowering farmers with precision agronomical data, risk mitigation, and fair price discovery.'}</span>
          </div>
          <div>
            {t.footerCopyright || '© 2026 AgriCopilot AI. Built for Karnataka and Indian Agriculture.'}
          </div>
        </div>
      </div>
    </footer>
  );
}
