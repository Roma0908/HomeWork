import React, { useState } from 'react';
import { GeneratedCase, Evidence } from '../game/types.ts';
import { useTranslation } from '../localization/LocalizationContext.tsx';
import { EvidenceIcon } from '../components/cards/EvidenceIcon.tsx';
import { ClueInspectModal } from '../components/modals/ClueInspectModal.tsx';
import { sound } from '../utils/audio.ts';
import { BookOpen, ArrowLeft, AlertCircle, ShieldCheck, Sparkles, Brain, Check } from 'lucide-react';

interface EvidenceJournalScreenProps {
  activeCase: GeneratedCase;
  onReturnToInvestigation: () => void;
  onAnalyzeEvidence: (evidenceId: string) => void;
}

export const EvidenceJournalScreen: React.FC<EvidenceJournalScreenProps> = ({
  activeCase,
  onReturnToInvestigation,
  onAnalyzeEvidence,
}) => {
  const { language, t } = useTranslation();
  const [filterTab, setFilterTab] = useState<
    'all' | 'physical' | 'digital' | 'document' | 'statements' | 'timeline' | 'analyzed'
  >('all');
  const [inspectingClue, setInspectingClue] = useState<Evidence | null>(null);

  const discoveredEvidence = activeCase.evidenceList.filter((e) => e.discovered);

  const filtered = discoveredEvidence.filter((e) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'physical') return e.type === 'physical' || e.type === 'biological';
    if (filterTab === 'digital') return e.type === 'digital';
    if (filterTab === 'document') return e.type === 'document';
    if (filterTab === 'statements') return e.type === 'statement' || e.type === 'document';
    if (filterTab === 'timeline') return e.type === 'timeline';
    if (filterTab === 'analyzed') return e.analyzed;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A3B54] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {
                sound.playClick();
                onReturnToInvestigation();
              }}
              className="text-xs font-semibold text-[#D6AE67] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.nav.backToGame}
            </button>
            <span className="text-[#A8B1C1]">·</span>
            <span className="text-xs font-mono text-[#A8B1C1]">{activeCase.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F3F4F6] font-serif">
            {t.evidence.title}
          </h1>
          <p className="text-sm text-[#A8B1C1] mt-1">
            {t.evidence.subtitle} ({discoveredEvidence.length} / {activeCase.evidenceList.length} {language === 'kk' ? 'табылды' : 'collected'})
          </p>
        </div>

        {/* 6 Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111827] rounded-xl border border-[#2A3B54] overflow-x-auto">
          {[
            { id: 'all', label: t.evidence.filterAll },
            { id: 'physical', label: t.evidence.filterPhysical },
            { id: 'digital', label: t.evidence.filterDigital },
            { id: 'document', label: t.evidence.filterDocument },
            { id: 'statements', label: t.evidence.filterStatements },
            { id: 'timeline', label: t.evidence.filterTimeline },
            { id: 'analyzed', label: t.evidence.filterAnalyzed },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilterTab(tab.id as typeof filterTab);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filterTab === tab.id
                  ? 'bg-[#182235] text-[#D6AE67] font-semibold border border-[#D6AE67]/40 shadow-sm'
                  : 'text-[#A8B1C1] hover:text-[#F3F4F6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      {filtered.length === 0 ? (
        <div className="p-14 text-center rounded-2xl bg-[#182235] border border-[#2A3B54] space-y-3">
          <BookOpen className="w-12 h-12 text-[#A8B1C1] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#F3F4F6]">
            {t.evidence.emptyState}
          </h3>
          <p className="text-xs text-[#A8B1C1] max-w-md mx-auto">
            {language === 'kk'
              ? 'Оқиға орнындағы бөлмелерді мұқият тексеріп, заттай дәлелдемелерді жинаңыз.'
              : 'Search room hotspots in the crime scene to recover physical, digital, and timeline clues.'}
          </p>
          <button
            onClick={onReturnToInvestigation}
            className="mt-2 px-5 py-2 text-xs font-bold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-lg transition-colors inline-block"
          >
            {t.nav.backToGame}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ev) => {
            const room = activeCase.rooms.find((r) => r.id === ev.roomId);
            const implicatedSuspect = activeCase.suspects.find((s) => s.id === ev.implicatesSuspectId);
            const exoneratedSuspect = activeCase.suspects.find((s) => s.id === ev.exoneratesSuspectId);

            return (
              <div
                key={ev.id}
                className="group p-5 rounded-2xl bg-[#182235] border border-[#2A3B54] hover:border-[#D6AE67] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#D6AE67]/40 flex items-center justify-center text-[#D6AE67]">
                      <EvidenceIcon icon={ev.svgIcon} className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {ev.isEssential && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#D6AE67]/20 text-[#D6AE67] border border-[#D6AE67]/40">
                          {t.evidence.essentialBadge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#111827] text-[#A8B1C1] border border-[#2A3B54]">
                        {t.evidence.rarity[ev.rarity]}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#F3F4F6] font-serif group-hover:text-[#D6AE67] transition-colors">
                      {ev.name[language]}
                    </h3>
                    <span className="text-[11px] text-[#A8B1C1] font-mono">
                      {t.evidence.roomFound}: {room?.name[language]}
                    </span>
                  </div>

                  <p className="text-xs text-[#A8B1C1] leading-relaxed line-clamp-3">
                    {ev.description[language]}
                  </p>
                </div>

                {/* Suspect relationships & Analyze action */}
                <div className="pt-3 border-t border-[#2A3B54] space-y-2 text-[11px]">
                  {implicatedSuspect && (
                    <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {t.evidence.pointsTowards}: {implicatedSuspect.name}
                      </span>
                    </div>
                  )}

                  {exoneratedSuspect && (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {t.evidence.exonerates}: {exoneratedSuspect.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        sound.playInspect();
                        setInspectingClue(ev);
                      }}
                      className="text-xs text-[#6C94C5] hover:underline font-semibold"
                    >
                      {language === 'kk' ? 'Егжей-тегжейі' : 'View Details'} →
                    </button>

                    {!ev.analyzed ? (
                      <button
                        onClick={() => {
                          sound.playClueFound();
                          onAnalyzeEvidence(ev.id);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-md transition-colors flex items-center gap-1"
                      >
                        <Brain className="w-3 h-3" />
                        <span>{t.evidence.analyzeBtn}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {t.evidence.analyzedBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clue Inspector Modal */}
      {inspectingClue && (
        <ClueInspectModal
          evidence={inspectingClue}
          suspects={activeCase.suspects}
          onClose={() => setInspectingClue(null)}
        />
      )}
    </div>
  );
};
