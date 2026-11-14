import React, { useState } from 'react';
import { Suspect, Evidence, DialogueOption, DialogueCategory } from '../../game/types.ts';
import { useTranslation } from '../../localization/LocalizationContext.tsx';
import { SuspectAvatar } from '../cards/SuspectAvatar.tsx';
import { runMinimaxAdversarialSearch } from '../../algorithms/minimax.ts';
import { sound } from '../../utils/audio.ts';
import { X, Sparkles, MessageSquare, AlertCircle, ShieldAlert, Check, HelpCircle } from 'lucide-react';

interface InterrogationModalProps {
  suspect: Suspect;
  discoveredEvidence: Evidence[];
  activeCaseSeed: number;
  onClose: () => void;
  onApplyDialogue: (option: DialogueOption) => void;
  onChallengeWithEvidence: (evidenceId: string) => void;
}

export const InterrogationModal: React.FC<InterrogationModalProps> = ({
  suspect,
  discoveredEvidence,
  onClose,
  onApplyDialogue,
  onChallengeWithEvidence,
}) => {
  const { language, t } = useTranslation();
  const [selectedDialogue, setSelectedDialogue] = useState<DialogueOption | null>(null);
  const [activeCategory, setActiveCategory] = useState<DialogueCategory | 'all'>('all');
  const [selectedEvidenceForChallenge, setSelectedEvidenceForChallenge] = useState<string>('');
  const [challengeResult, setChallengeResult] = useState<string | null>(null);

  const categories: Array<{ id: DialogueCategory | 'all'; label: string }> = [
    { id: 'all', label: language === 'kk' ? 'Барлығы' : 'All Topics' },
    { id: 'timeline', label: language === 'kk' ? 'Уақыт' : 'Timeline' },
    { id: 'motive', label: language === 'kk' ? 'Ниет' : 'Motive' },
    { id: 'object', label: language === 'kk' ? 'Заттар' : 'Objects' },
  ];

  const filteredDialogues = suspect.dialogues.filter((d) => {
    if (activeCategory === 'all') return true;
    return d.category === activeCategory;
  });

  const handleSelectDialogue = (option: DialogueOption) => {
    sound.playClick();
    setSelectedDialogue(option);
    onApplyDialogue(option);
  };

  const handleExecuteChallenge = () => {
    if (!selectedEvidenceForChallenge) return;
    sound.playAccusation();
    onChallengeWithEvidence(selectedEvidenceForChallenge);

    const matchingEvidence = discoveredEvidence.find((e) => e.id === selectedEvidenceForChallenge);
    if (matchingEvidence && matchingEvidence.implicatesSuspectId === suspect.id) {
      setChallengeResult(
        language === 'kk'
          ? `Сәтті беттестіру! ${suspect.name} қайшылықты мойындауға мәжбүр болды және стресс деңгейі күрт өсті (+25).`
          : `Contradiction exposed! ${suspect.name} faltered under the weight of this proof. Stress spiked (+25).`
      );
    } else {
      setChallengeResult(
        language === 'kk'
          ? `Бұл айғақ ${suspect.name} сөзіне тікелей қайшы келмейді. Күдікті сабыр сақтады.`
          : `This evidence does not contradict ${suspect.name}'s statements directly. Suspect remained calm.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#182235] border border-[#2A3B54] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A3B54] bg-[#111827]">
          <div className="flex items-center gap-3">
            <SuspectAvatar suspect={suspect} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F3F4F6] font-serif">
                  {suspect.name}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#202C40] text-[#D6AE67] capitalize">
                  {suspect.communicationStyle}
                </span>
              </div>
              <span className="text-xs text-[#A8B1C1]">
                {suspect.profession[language]} · {suspect.age} {language === 'kk' ? 'жаста' : 'yrs'} ({suspect.gender})
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#A8B1C1] hover:text-[#F3F4F6] hover:bg-[#202C40] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Personality Traits & Trust/Stress Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A8B1C1]">{t.interrogation.stress}:</span>
                <span className={`font-bold ${suspect.stressLevel > 60 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {suspect.stressLevel}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1020] overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    suspect.stressLevel > 60 ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${suspect.stressLevel}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A8B1C1]">{t.interrogation.trust}:</span>
                <span className="font-bold text-[#6C94C5]">{suspect.trustScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1020] overflow-hidden">
                <div
                  className="h-full bg-[#6C94C5] transition-all duration-300"
                  style={{ width: `${suspect.trustScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dossier Information: Alibi & Background Bio */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#111827] border border-[#2A3B54] space-y-2 text-xs">
              <span className="text-[#D6AE67] font-semibold block">
                {t.interrogation.alibi}:
              </span>
              <p className="text-[#F3F4F6] italic leading-relaxed">
                "{suspect.alibi[language]}"
              </p>
              <div className="pt-2 border-t border-[#2A3B54] text-[#A8B1C1] flex flex-wrap gap-2 text-[11px]">
                <span className="text-[#F3F4F6] font-medium">Traits:</span>
                {suspect.personalityTraits.map((tr) => (
                  <span key={tr} className="px-2 py-0.5 rounded bg-[#182235] text-[#D6AE67] capitalize">
                    {tr}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Confrontation / Challenge With Evidence Section */}
          <div className="p-4 rounded-xl bg-[#202C40]/60 border border-[#D6AE67]/40 space-y-3">
            <h3 className="text-xs font-bold text-[#D6AE67] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D6AE67]" />
              {t.interrogation.challengeBtn}
            </h3>

            {discoveredEvidence.length === 0 ? (
              <p className="text-xs text-[#A8B1C1] italic">
                {language === 'kk'
                  ? 'Беттестіру үшін оқиға орнынан кем дегенде бір айғақ табу қажет.'
                  : 'You must discover physical or timeline clues before challenging this suspect.'}
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <select
                  value={selectedEvidenceForChallenge}
                  onChange={(e) => setSelectedEvidenceForChallenge(e.target.value)}
                  className="w-full sm:flex-1 p-2 rounded-lg bg-[#111827] border border-[#2A3B54] text-xs text-[#F3F4F6] focus:outline-none focus:border-[#D6AE67]"
                >
                  <option value="">
                    {language === 'kk' ? '-- Айғақты таңдаңыз --' : '-- Select Clue to Confront --'}
                  </option>
                  {discoveredEvidence.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name[language]} ({ev.type})
                    </option>
                  ))}
                </select>

                <button
                  disabled={!selectedEvidenceForChallenge}
                  onClick={handleExecuteChallenge}
                  className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                    selectedEvidenceForChallenge
                      ? 'bg-[#D6AE67] hover:bg-[#E4C589] text-[#0B1020]'
                      : 'bg-[#111827] text-[#A8B1C1] border border-[#2A3B54] cursor-not-allowed opacity-50'
                  }`}
                >
                  {t.interrogation.challengeBtn}
                </button>
              </div>
            )}

            {challengeResult && (
              <div className="p-3 rounded-lg bg-[#111827] border border-[#2A3B54] text-xs text-[#F3F4F6] flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-[#D6AE67] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{challengeResult}</p>
              </div>
            )}
          </div>

          {/* Dialogue Category Filter Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A8B1C1] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#D6AE67]" />
                {t.interrogation.questionsAvailable}
              </h3>

              <div className="flex items-center gap-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeCategory === c.id
                        ? 'bg-[#D6AE67] text-[#0B1020]'
                        : 'bg-[#111827] text-[#A8B1C1] hover:text-[#F3F4F6]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-2.5">
              {filteredDialogues.map((dlg) => (
                <button
                  key={dlg.id}
                  onClick={() => handleSelectDialogue(dlg)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all text-xs ${
                    selectedDialogue?.id === dlg.id
                      ? 'bg-[#1d2b42] border-[#D6AE67] text-[#F3F4F6]'
                      : 'bg-[#111827] border-[#2A3B54] text-[#A8B1C1] hover:text-[#F3F4F6] hover:border-[#6C94C5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#D6AE67]">
                      {dlg.question[language]}
                    </span>
                    <span className="font-mono text-[10px] text-[#A8B1C1] uppercase px-1.5 py-0.5 rounded bg-[#182235]">
                      {dlg.category}
                    </span>
                  </div>

                  {selectedDialogue?.id === dlg.id && (
                    <div className="mt-2 pt-2 border-t border-[#2A3B54] text-[#F3F4F6] italic bg-[#0B1020]/50 p-2.5 rounded-lg leading-relaxed">
                      "{dlg.response[language]}"
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2A3B54] bg-[#111827] flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-lg transition-colors"
          >
            {t.interrogation.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
