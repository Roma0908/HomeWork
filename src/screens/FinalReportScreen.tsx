import React, { useState } from 'react';
import { GeneratedCase, InvestigationState } from '../game/types.ts';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { SuspectAvatar } from '../components/cards/SuspectAvatar.tsx';
import { sound } from '../utils/audio.ts';
import {
  Trophy,
  AlertTriangle,
  ArrowRight,
  Home,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ShieldAlert,
  Flame,
} from 'lucide-react';

interface FinalReportScreenProps {
  activeCase: GeneratedCase;
  investigationState: InvestigationState;
  onNewCase: () => void;
  onGoHome: () => void;
}

export const FinalReportScreen: React.FC<FinalReportScreenProps> = ({
  activeCase,
  investigationState,
  onNewCase,
  onGoHome,
}) => {
  const { language, t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const isCulpritMatch = investigationState.accusedSuspectId === activeCase.culpritId;
  const discoveredEssentialCount = activeCase.evidenceList.filter((e) => e.discovered && e.isEssential).length;

  // Determine which of the 3 outcomes occurred
  let outcomeType: 'outcome1' | 'outcome2' | 'outcome3' = 'outcome3';
  if (isCulpritMatch) {
    outcomeType = discoveredEssentialCount >= 3 ? 'outcome1' : 'outcome2';
  }

  const actualCulprit = activeCase.suspects.find((s) => s.id === activeCase.culpritId)!;
  const accusedSuspect = activeCase.suspects.find((s) => s.id === investigationState.accusedSuspectId);

  // Score Calculation
  const discoveredCount = activeCase.evidenceList.filter((e) => e.discovered).length;
  let baseScore = 200;
  if (outcomeType === 'outcome1') baseScore = 1000;
  else if (outcomeType === 'outcome2') baseScore = 650;

  const clueBonus = discoveredCount * 100;
  const hintPenalty = investigationState.hintsUsed * 80;
  const actionPenalty = Math.max(0, (investigationState.actionPointsUsed - 12) * 10);
  const crisisBonus = activeCase.crisisEvent && investigationState.dangerMeter < 80 ? 150 : 0;

  const totalScore = Math.max(100, baseScore + clueBonus + crisisBonus - hintPenalty - actionPenalty);

  const handleCopySeed = () => {
    sound.playClick();
    navigator.clipboard.writeText(activeCase.formattedSeed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      {/* 1. Main Outcome Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden text-center space-y-4 ${
          outcomeType === 'outcome1'
            ? 'bg-gradient-to-b from-[#182235] to-[#111827] border-[#D6AE67]'
            : outcomeType === 'outcome2'
            ? 'bg-gradient-to-b from-amber-950/40 to-[#111827] border-amber-500/60'
            : 'bg-gradient-to-b from-rose-950/40 to-[#111827] border-rose-500/60'
        }`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0B1020] border border-[#2A3B54] mx-auto shadow-inner">
          {outcomeType === 'outcome1' ? (
            <Trophy className="w-8 h-8 text-[#D6AE67]" />
          ) : outcomeType === 'outcome2' ? (
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif text-[#F3F4F6]">
          {outcomeType === 'outcome1'
            ? t.report.outcome1Title
            : outcomeType === 'outcome2'
            ? t.report.outcome2Title
            : t.report.outcome3Title}
        </h1>

        <p className="text-sm text-[#A8B1C1] max-w-xl mx-auto leading-relaxed">
          {outcomeType === 'outcome1'
            ? t.report.outcome1Desc
            : outcomeType === 'outcome2'
            ? t.report.outcome2Desc
            : t.report.outcome3Desc}
        </p>

        {/* Score Stamp & Copy Seed Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-xl bg-[#0B1020] border border-[#2A3B54] font-mono">
            <span className="text-xs uppercase text-[#A8B1C1]">{t.report.scoreLabel}:</span>
            <span className="text-xl font-bold text-[#D6AE67]">{totalScore}</span>
          </div>

          <button
            onClick={handleCopySeed}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1020] hover:bg-[#182235] border border-[#2A3B54] text-xs font-mono text-[#D6AE67] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.reveal.copied : `${t.report.copySeedBtn} (${activeCase.formattedSeed})`}</span>
          </button>
        </div>
      </div>

      {/* 2. Suspects Accusation Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Accusation */}
        <div className="p-5 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A8B1C1] flex items-center gap-2">
            {isCulpritMatch ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
            {t.report.yourAccusation}
          </span>
          {accusedSuspect && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111827]">
              <SuspectAvatar suspect={accusedSuspect} size="md" />
              <div>
                <h3 className="text-sm font-bold text-[#F3F4F6]">{accusedSuspect.name}</h3>
                <span className="text-xs text-[#D6AE67]">{accusedSuspect.profession[language]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actual Culprit */}
        <div className="p-5 rounded-2xl bg-[#182235] border border-[#D6AE67]/40 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D6AE67] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D6AE67]" />
            {t.report.actualCulprit}
          </span>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111827]">
            <SuspectAvatar suspect={actualCulprit} size="md" />
            <div>
              <h3 className="text-sm font-bold text-[#F3F4F6]">{actualCulprit.name}</h3>
              <span className="text-xs text-[#D6AE67]">{actualCulprit.profession[language]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Truth Summary & Motive */}
      <div className="p-6 rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-3">
        <h3 className="text-sm font-bold text-[#F3F4F6] font-serif uppercase tracking-wider">
          {t.report.truthSummary}
        </h3>
        <p className="text-xs sm:text-sm text-[#A8B1C1] leading-relaxed bg-[#111827] p-4 rounded-xl border border-[#2A3B54]">
          {activeCase.solutionExplanation[language]}
        </p>

        {/* Misleading Clues Explanations if any existed */}
        {activeCase.misleadingExplanations.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-xs font-mono font-bold text-[#D6AE67] uppercase">
              {t.report.misleadingCluesTitle}:
            </span>
            {activeCase.misleadingExplanations.map((me, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#111827] text-xs text-[#A8B1C1] italic">
                ↳ {me.text[language]}
              </div>
            ))}
          </div>
        )}

        {/* True Timeline Sequence */}
        <div className="pt-3 space-y-2">
          <span className="text-xs font-mono font-bold text-[#6C94C5] uppercase">
            {t.report.timelineTitle}:
          </span>
          {activeCase.timeline.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <span className="font-mono text-[#D6AE67] font-bold shrink-0">{step.time}</span>
              <span className="text-[#A8B1C1]">·</span>
              <p className="text-[#F3F4F6]">{step.eventDescription[language]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onNewCase();
          }}
          className="px-6 py-3.5 text-sm font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
        >
          <span>{t.report.newCaseBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="px-6 py-3.5 text-sm font-semibold text-[#F3F4F6] bg-[#182235] hover:bg-[#202C40] border border-[#2A3B54] rounded-xl transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>{t.report.backToHomeBtn}</span>
        </button>
      </div>
    </div>
  );
};
