import React, { useState } from 'react';
import { GeneratedCase } from '../game/types.ts';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { SuspectAvatar } from '../components/cards/SuspectAvatar.tsx';
import { sound } from '../utils/audio.ts';
import { ShieldAlert, ArrowRight, Users, Copy, Check, AlertTriangle, Calendar } from 'lucide-react';

interface CaseRevealScreenProps {
  activeCase: GeneratedCase;
  onStartInvestigation: () => void;
}

export const CaseRevealScreen: React.FC<CaseRevealScreenProps> = ({
  activeCase,
  onStartInvestigation,
}) => {
  const { language, t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopySeed = () => {
    sound.playClick();
    navigator.clipboard.writeText(activeCase.formattedSeed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    sound.playClick();
    onStartInvestigation();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      {/* Top Dossier Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#182235] border border-[#D6AE67]/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-[#D6AE67]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#111827] border border-[#2A3B54] text-xs font-mono text-[#D6AE67]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{activeCase.id}</span>
            </div>

            <button
              onClick={handleCopySeed}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111827] hover:bg-[#202C40] border border-[#2A3B54] text-xs font-mono text-[#A8B1C1] hover:text-[#F3F4F6] transition-colors"
              title="Copy Case Seed"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? t.reveal.copied : activeCase.formattedSeed}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-[#202C40] text-[#6C94C5]">
              {activeCase.era.toUpperCase()} · {activeCase.year}
            </span>
            <span className="text-[10px] font-mono text-[#A8B1C1] px-1.5 py-0.5 rounded bg-[#111827]">
              v{activeCase.generatorVersion}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#F3F4F6] font-serif mb-3 leading-tight">
          {activeCase.title[language]}
        </h1>

        <p className="text-sm text-[#A8B1C1] leading-relaxed mb-4 bg-[#111827]/80 p-4 rounded-xl border border-[#2A3B54]">
          {activeCase.introduction[language]}
        </p>

        {/* Crisis Alert Banner if in Crisis Mode */}
        {activeCase.crisisEvent && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-xs text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm text-rose-200">
                {activeCase.crisisEvent.title[language]}
              </span>
              <p className="mt-1 leading-relaxed opacity-90">
                {activeCase.crisisEvent.description[language]}
              </p>
            </div>
          </div>
        )}

        {/* Case Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#111827] border border-[#2A3B54]">
            <span className="text-[#A8B1C1] block text-[11px] mb-1">
              {t.reveal.eraLabel}:
            </span>
            <span className="font-semibold text-[#F3F4F6] capitalize">
              {activeCase.era} ({activeCase.year})
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#111827] border border-[#2A3B54]">
            <span className="text-[#A8B1C1] block text-[11px] mb-1">
              {t.reveal.crimeLabel}:
            </span>
            <span className="font-semibold text-[#F3F4F6] truncate block">
              {activeCase.crimeCategory}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#111827] border border-[#2A3B54]">
            <span className="text-[#A8B1C1] block text-[11px] mb-1">
              {t.reveal.locationLabel}:
            </span>
            <span className="font-semibold text-[#F3F4F6] truncate block">
              {activeCase.rooms[0]?.name[language]}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#111827] border border-[#2A3B54]">
            <span className="text-[#A8B1C1] block text-[11px] mb-1">
              {t.reveal.suspectsLabel}:
            </span>
            <span className="font-semibold text-[#D6AE67] font-mono">
              4 Persons of Interest
            </span>
          </div>
        </div>
      </div>

      {/* 4 Suspects Briefing Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#F3F4F6] font-serif flex items-center gap-2">
          <Users className="w-5 h-5 text-[#D6AE67]" />
          {t.investigation.suspectsTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeCase.suspects.map((suspect) => (
            <div
              key={suspect.id}
              className="p-4 rounded-2xl bg-[#182235] border border-[#2A3B54] flex flex-col items-center text-center space-y-3 hover:border-[#6C94C5]/60 transition-colors"
            >
              <SuspectAvatar suspect={suspect} size="lg" />
              <div>
                <h3 className="text-sm font-bold text-[#F3F4F6]">
                  {suspect.name}
                </h3>
                <span className="text-xs text-[#D6AE67] font-medium block">
                  {suspect.profession[language]}
                </span>
                <span className="text-[11px] text-[#A8B1C1] font-mono block mt-0.5 capitalize">
                  {suspect.age} {language === 'kk' ? 'жаста' : 'yrs'} · {suspect.gender}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button to Start */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleStart}
          className="px-8 py-4 text-sm font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-xl shadow-xl shadow-[#D6AE67]/25 transition-all hover:scale-105 flex items-center gap-3"
        >
          <span>{t.reveal.startInvestigationBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
