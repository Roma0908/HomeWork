import React, { useState } from 'react';
import { Suspect } from '../../game/types.ts';
import { useTranslation } from '../../localization/LocalizationContext.tsx';
import { SuspectAvatar } from '../cards/SuspectAvatar.tsx';
import { sound } from '../../utils/audio.ts';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface AccusationModalProps {
  suspects: Suspect[];
  hasAllEssentialClues: boolean;
  onConfirmAccusation: (suspectId: string, reasoning: string) => void;
  onClose: () => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  suspects,
  hasAllEssentialClues,
  onConfirmAccusation,
  onClose,
}) => {
  const { language, t } = useTranslation();
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [selectedReasoning, setSelectedReasoning] = useState<string>('motive_and_timeline');

  const reasoningOptions = [
    { id: 'motive_and_timeline', label: language === 'kk' ? 'Ниет пен уақыт сәйкессіздігі (Motive & Timeline)' : 'Motive & Contradicted Timeline' },
    { id: 'physical_evidence', label: language === 'kk' ? 'Заттай және сандық іздер (Direct Forensic Match)' : 'Direct Physical / Digital Forensic Match' },
    { id: 'broken_alibi', label: language === 'kk' ? 'Жалған алиби мен құжаттар (Exposed False Alibi)' : 'Exposed False Alibi & Forged Credentials' },
    { id: 'ai_inference', label: language === 'kk' ? 'ЖИ Зертханасының есептеуі (Bayesian Peak Posterior)' : 'AI Laboratory Bayesian & Viterbi Inference' },
  ];

  const handleConfirm = () => {
    if (!selectedSuspectId) return;
    sound.playAccusation();
    onConfirmAccusation(selectedSuspectId, selectedReasoning);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#182235] border border-rose-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A3B54] bg-[#111827]">
          <div className="flex items-center gap-2.5 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-base font-bold font-serif text-[#F3F4F6]">
              {t.accusation.title}
            </h2>
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#A8B1C1] leading-relaxed">
            {t.accusation.desc}
          </p>

          {!hasAllEssentialClues && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-2 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.accusation.earlyWarning}</span>
            </div>
          )}

          <span className="text-xs font-semibold uppercase tracking-wider text-[#D6AE67] block">
            {t.accusation.selectSuspect}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suspects.map((suspect) => {
              const isSelected = selectedSuspectId === suspect.id;
              return (
                <button
                  key={suspect.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedSuspectId(suspect.id);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
                      : 'bg-[#111827] border-[#2A3B54] hover:border-[#6C94C5]'
                  }`}
                >
                  <SuspectAvatar suspect={suspect} size="sm" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#F3F4F6] block truncate">
                      {suspect.name}
                    </span>
                    <span className="text-[11px] text-[#A8B1C1] block truncate">
                      {suspect.profession[language]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reasoning Selection */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A8B1C1] block">
              {t.accusation.selectReasoning}
            </span>
            <div className="space-y-1.5">
              {reasoningOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedReasoning === opt.id
                      ? 'bg-[#111827] border-[#D6AE67] text-[#F3F4F6]'
                      : 'bg-[#111827]/60 border-[#2A3B54] text-[#A8B1C1]'
                  }`}
                >
                  <input
                    type="radio"
                    name="reasoning"
                    value={opt.id}
                    checked={selectedReasoning === opt.id}
                    onChange={(e) => setSelectedReasoning(e.target.value)}
                    className="accent-[#D6AE67]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-[#2A3B54] bg-[#111827] flex items-center justify-end gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-[#A8B1C1] hover:text-[#F3F4F6] transition-colors"
          >
            {t.accusation.cancelBtn}
          </button>
          <button
            disabled={!selectedSuspectId}
            onClick={handleConfirm}
            className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              selectedSuspectId
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50 hover:scale-105'
                : 'bg-rose-950/40 text-rose-300/40 cursor-not-allowed border border-rose-900/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {t.accusation.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
