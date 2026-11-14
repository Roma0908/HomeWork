import React from 'react';
import { Evidence, Suspect } from '../../game/types.ts';
import { useTranslation } from '../../localization/LocalizationContext.tsx';
import { EvidenceIcon } from '../cards/EvidenceIcon.tsx';
import { sound } from '../../utils/audio.ts';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';

interface ClueInspectModalProps {
  evidence: Evidence;
  suspects: Suspect[];
  onClose: () => void;
}

export const ClueInspectModal: React.FC<ClueInspectModalProps> = ({
  evidence,
  suspects,
  onClose,
}) => {
  const { language, t } = useTranslation();

  const implicatedSuspect = suspects.find((s) => s.id === evidence.implicatesSuspectId);
  const exoneratedSuspect = suspects.find((s) => s.id === evidence.exoneratesSuspectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#182235] border border-[#2A3B54] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A3B54] bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#202C40] border border-[#D6AE67]/40 flex items-center justify-center text-[#D6AE67]">
              <EvidenceIcon icon={evidence.svgIcon} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F3F4F6] font-serif">
                {evidence.name[language]}
              </h2>
              <span className="text-[11px] text-[#A8B1C1] font-mono uppercase">
                {t.evidence.rarity[evidence.rarity]} · {evidence.type}
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#F3F4F6] leading-relaxed bg-[#111827] p-3.5 rounded-xl border border-[#2A3B54]">
            {evidence.description[language]}
          </p>

          {/* Forensic Analysis Weights */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#111827] border border-[#2A3B54]">
              <span className="text-[#A8B1C1] block text-[11px] mb-1">
                Bayesian Weight P(E|C):
              </span>
              <span className="text-sm font-bold font-mono text-[#D6AE67]">
                {(evidence.clueWeight * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#111827] border border-[#2A3B54]">
              <span className="text-[#A8B1C1] block text-[11px] mb-1">
                Evidence Status:
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                Verified & Cataloged
              </span>
            </div>
          </div>

          {/* Implication Notes */}
          {implicatedSuspect && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {t.evidence.pointsTowards}: {implicatedSuspect.name}
                </span>
                <span className="text-[11px] opacity-80">
                  This clue contradicts their stated alibi or matches their personal belongings.
                </span>
              </div>
            </div>
          )}

          {exoneratedSuspect && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {t.evidence.exonerates}: {exoneratedSuspect.name}
                </span>
                <span className="text-[11px] opacity-80">
                  This clue confirms this person could not have been at the crime vault.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2A3B54] bg-[#111827] flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-[#0B1020] bg-[#D6AE67] hover:bg-[#E4C589] rounded-lg transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
