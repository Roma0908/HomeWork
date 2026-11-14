import React, { useState } from 'react';
import { GeneratedCase, Evidence, EvidenceConnectionRule } from '../../game/types.ts';
import {
  X,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';

interface EvidenceBoardModalProps {
  caseData: GeneratedCase;
  language: 'kk' | 'en';
  discoveredEvidence: Evidence[];
  connectedPairs: Array<[string, string]>;
  unlockedDeductionIds: string[];
  onConnectPair: (clueAId: string, clueBId: string) => void;
  onClose: () => void;
}

export const EvidenceBoardModal: React.FC<EvidenceBoardModalProps> = ({
  caseData,
  language,
  discoveredEvidence,
  connectedPairs,
  unlockedDeductionIds,
  onConnectPair,
  onClose,
}) => {
  const isKk = language === 'kk';

  const [selectedClueA, setSelectedClueA] = useState<string | null>(null);
  const [selectedClueB, setSelectedClueB] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: { kk: string; en: string };
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const handleClueClick = (clueId: string) => {
    if (selectedClueA === clueId) {
      setSelectedClueA(null);
      setFeedbackMessage(null);
      return;
    }
    if (selectedClueB === clueId) {
      setSelectedClueB(null);
      setFeedbackMessage(null);
      return;
    }

    if (!selectedClueA) {
      setSelectedClueA(clueId);
      setFeedbackMessage(null);
    } else if (!selectedClueB) {
      setSelectedClueB(clueId);
      setFeedbackMessage(null);
    } else {
      // Replace clue B
      setSelectedClueB(clueId);
      setFeedbackMessage(null);
    }
  };

  const isPairAlreadyConnected = (idA: string, idB: string) => {
    return connectedPairs.some(
      ([a, b]) => (a === idA && b === idB) || (a === idB && b === idA)
    );
  };

  const handleEvaluateConnection = () => {
    if (!selectedClueA || !selectedClueB) return;

    if (isPairAlreadyConnected(selectedClueA, selectedClueB)) {
      setFeedbackMessage({
        text: {
          kk: 'Бұл екі айғақ арасындағы логикалық байланыс бұрыннан ашылған!',
          en: 'This logical deduction has already been established on your board!',
        },
        type: 'info',
      });
      return;
    }

    // Check against case.evidenceConnections
    const match = caseData.evidenceConnections.find(
      (rule) =>
        (rule.clueAId === selectedClueA && rule.clueBId === selectedClueB) ||
        (rule.clueAId === selectedClueB && rule.clueBId === selectedClueA)
    );

    if (match) {
      onConnectPair(selectedClueA, selectedClueB);
      setFeedbackMessage({
        text: {
          kk: `Жаңа қорытынды ашылды: «${match.deductionTitle.kk}»!`,
          en: `Breakthrough Deduction Unlocked: "${match.deductionTitle.en}"!`,
        },
        type: 'success',
      });
    } else {
      setFeedbackMessage({
        text: {
          kk: 'Бұл екі айғақ тікелей байланыспайды. Басқа логикалық сәйкестіктерді іздеп көріңіз.',
          en: 'These two clues do not form a direct causal link. Try another combination.',
        },
        type: 'error',
      });
    }
  };

  // Find all unlocked deduction objects
  const unlockedRules: EvidenceConnectionRule[] = caseData.evidenceConnections.filter((rule) =>
    unlockedDeductionIds.includes(rule.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-gradient-to-b from-[#141C2B] via-[#0D1422] to-[#080D18] border border-[#2A3C56] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#0A101C]/90 border-b border-[#2A3C56]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D6AE67]/15 text-[#D6AE67] border border-[#D6AE67]/30">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-wide flex items-center gap-2">
                {isKk ? 'Интерактивті айғақтар тақтасы' : 'Interactive Evidence Board'}
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-[#1A283D] text-[#8FA3BF] border border-[#2B405D]">
                  {unlockedRules.length} / {caseData.evidenceConnections.length}{' '}
                  {isKk ? 'қорытынды' : 'deductions'}
                </span>
              </h2>
              <p className="text-xs text-[#8FA3BF]">
                {isKk
                  ? 'Екі айғақты таңдап, логикалық байланыс пен жаңа қорытындыларды ашыңыз.'
                  : 'Select any two discovered clues to forge deductive links and expose hidden truths.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#8FA3BF] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action / Selection Bar */}
          <div className="p-4 rounded-2xl bg-[#0F1827] border border-[#26374F] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Clue A Slot */}
              <div
                className={`flex-1 md:w-44 px-3 py-2 rounded-xl border text-xs flex items-center gap-2 truncate transition-all ${
                  selectedClueA
                    ? 'bg-[#1C2A3E] border-[#D6AE67] text-white'
                    : 'bg-[#090E17] border-dashed border-[#2B405D] text-[#8FA3BF]'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#D6AE67]/20 text-[#D6AE67] flex items-center justify-center font-bold text-[10px] shrink-0">
                  1
                </span>
                <span className="truncate">
                  {selectedClueA
                    ? discoveredEvidence.find((e) => e.id === selectedClueA)?.name[language] ||
                      'Clue 1'
                    : isKk
                    ? '1-айғақты таңдаңыз'
                    : 'Select Clue A'}
                </span>
              </div>

              <span className="text-[#8FA3BF] font-bold text-xs shrink-0">+</span>

              {/* Clue B Slot */}
              <div
                className={`flex-1 md:w-44 px-3 py-2 rounded-xl border text-xs flex items-center gap-2 truncate transition-all ${
                  selectedClueB
                    ? 'bg-[#1C2A3E] border-[#D6AE67] text-white'
                    : 'bg-[#090E17] border-dashed border-[#2B405D] text-[#8FA3BF]'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#D6AE67]/20 text-[#D6AE67] flex items-center justify-center font-bold text-[10px] shrink-0">
                  2
                </span>
                <span className="truncate">
                  {selectedClueB
                    ? discoveredEvidence.find((e) => e.id === selectedClueB)?.name[language] ||
                      'Clue 2'
                    : isKk
                    ? '2-айғақты таңдаңыз'
                    : 'Select Clue B'}
                </span>
              </div>
            </div>

            {/* Evaluate Button */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                disabled={!selectedClueA || !selectedClueB}
                onClick={handleEvaluateConnection}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6AE67] to-[#B38C48] hover:from-[#E8C786] hover:to-[#C79C56] text-[#0B1020] font-bold text-xs shadow-lg transition-all active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isKk ? 'Байланысты тексеру' : 'Connect Clues'}
              </button>

              {(selectedClueA || selectedClueB) && (
                <button
                  onClick={() => {
                    setSelectedClueA(null);
                    setSelectedClueB(null);
                    setFeedbackMessage(null);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#8FA3BF] hover:text-white transition-colors cursor-pointer"
                >
                  {isKk ? 'Тазарту' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {/* Feedback Message */}
          {feedbackMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 animate-fade-in ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : feedbackMessage.type === 'info'
                  ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : feedbackMessage.type === 'info' ? (
                <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{isKk ? feedbackMessage.text.kk : feedbackMessage.text.en}</span>
            </div>
          )}

          {/* Discovered Clues Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#D6AE67] uppercase tracking-wider flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                {isKk ? 'Табылған заттай және сандық айғақтар' : 'Discovered Evidence Items'} (
                {discoveredEvidence.length})
              </h3>
              <span className="text-[11px] text-[#8FA3BF]">
                {isKk
                  ? 'Тақтада байланыстыру үшін кез келген екі айғақты басыңыз'
                  : 'Click two cards to pair on the board'}
              </span>
            </div>

            {discoveredEvidence.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#090E18] border border-dashed border-[#23354E] text-center text-xs text-[#8FA3BF] space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-[#D6AE67]/40" />
                <p className="font-medium text-white">
                  {isKk ? 'Әзірге ешқандай айғақ табылмады' : 'No Evidence Discovered Yet'}
                </p>
                <p>
                  {isKk
                    ? 'Бөлмелерді аралап, күдікті нүктелерді тексеріп, айғақтар жинаңыз.'
                    : 'Explore the investigation rooms to uncover physical, digital, and timeline clues.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {discoveredEvidence.map((clue) => {
                  const isSelectedA = selectedClueA === clue.id;
                  const isSelectedB = selectedClueB === clue.id;
                  const isSelected = isSelectedA || isSelectedB;

                  return (
                    <div
                      key={clue.id}
                      onClick={() => handleClueClick(clue.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1D2B3F] border-[#D6AE67] ring-2 ring-[#D6AE67]/40 shadow-lg scale-102'
                          : 'bg-[#0E1624] border-[#22334A] hover:border-[#385172] hover:bg-[#121B2C]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-mono text-[#D6AE67] uppercase font-semibold">
                            {clue.type}
                          </span>
                          {clue.isEssential && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              {isKk ? 'Негізгі' : 'Essential'}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-white leading-snug">
                          {clue.name[language]}
                        </h4>
                        <p className="text-[11px] text-[#8FA3BF] mt-1 line-clamp-2 leading-relaxed">
                          {clue.description[language]}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#8FA3BF]">
                        <span>{isKk ? 'Салмағы:' : 'Weight:'} {(clue.clueWeight * 100).toFixed(0)}%</span>
                        {isSelected && (
                          <span className="font-bold text-[#D6AE67]">
                            {isSelectedA ? '№1 Таңдалды' : '№2 Таңдалды'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Unlocked Deductions Section */}
          {unlockedRules.length > 0 && (
            <div className="pt-4 border-t border-[#2A3C56]/60">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {isKk ? 'Дәлелденген дедуктивтік қорытындылар' : 'Established Deductions'} (
                {unlockedRules.length})
              </h3>

              <div className="space-y-3">
                {unlockedRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-[#064E3B]/30 via-[#0B251F]/40 to-[#0A101C] border border-emerald-500/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-300">
                      <Sparkles className="w-4 h-4 text-[#D6AE67]" />
                      <span>{isKk ? rule.deductionTitle.kk : rule.deductionTitle.en}</span>
                    </div>
                    <p className="text-emerald-100 leading-relaxed">
                      {isKk ? rule.deductionText.kk : rule.deductionText.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0A101C]/90 border-t border-[#2A3C56]/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isKk ? 'Тергеуге оралу' : 'Return to Investigation'}
          </button>
        </div>
      </div>
    </div>
  );
};
