import React from 'react';
import { Suspect } from '../../game/types.ts';
import { SuspectAvatar } from './SuspectAvatar.tsx';
import { MessageSquare, Shield, Award, AlertCircle, Eye, Sparkles } from 'lucide-react';

interface SuspectCardProps {
  suspect: Suspect;
  language: 'kk' | 'en';
  onInterrogate: (suspectId: string) => void;
  onOpenProfile: (suspect: Suspect) => void;
  isAccused?: boolean;
}

export const SuspectCard: React.FC<SuspectCardProps> = ({
  suspect,
  language,
  onInterrogate,
  onOpenProfile,
  isAccused = false,
}) => {
  const isKk = language === 'kk';

  const roleSlotLabels: Record<string, { kk: string; en: string; color: string; border: string }> = {
    insider: {
      kk: 'Ішкі мүдделі тұлға',
      en: 'The Insider',
      color: 'bg-amber-500/20 text-amber-300',
      border: 'border-amber-500/30',
    },
    access_holder: {
      kk: 'Рұқсат кілтін ұстаушы',
      en: 'The Access Holder',
      color: 'bg-cyan-500/20 text-cyan-300',
      border: 'border-cyan-500/30',
    },
    specialist: {
      kk: 'Арнайы маман-сарапшы',
      en: 'The Specialist',
      color: 'bg-purple-500/20 text-purple-300',
      border: 'border-purple-500/30',
    },
    witness: {
      kk: 'Басты куәгер',
      en: 'The Witness',
      color: 'bg-emerald-500/20 text-emerald-300',
      border: 'border-emerald-500/30',
    },
  };

  const slotInfo = roleSlotLabels[suspect.roleSlot] || {
    kk: 'Күдікті',
    en: 'Person of Interest',
    color: 'bg-slate-500/20 text-slate-300',
    border: 'border-slate-500/30',
  };

  return (
    <div
      className={`group relative rounded-2xl bg-gradient-to-b from-[#162133] to-[#0E1624] border ${
        isAccused ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-[#23354E]'
      } hover:border-[#D6AE67]/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col`}
    >
      {/* Top Banner with Role Slot & Age */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0A101C]/70 border-b border-[#23354E]/60 text-xs">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${slotInfo.color} ${slotInfo.border}`}
        >
          <Award className="w-3 h-3 shrink-0" />
          {isKk ? slotInfo.kk : slotInfo.en}
        </span>
        <span className="font-mono text-xs text-[#8A9EB5]">
          {suspect.age} {isKk ? 'жас' : 'yrs'}
        </span>
      </div>

      <div className="p-4 flex gap-4">
        {/* Left: Illustrated Portrait */}
        <div
          onClick={() => onOpenProfile(suspect)}
          className="cursor-pointer shrink-0 transition-transform duration-200 group-hover:scale-102"
          title={isKk ? 'Толық досьені ашу' : 'View full character dossier'}
        >
          <SuspectAvatar suspect={suspect} size="xl" showBadge={true} />
        </div>

        {/* Right: Info and Stats */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide truncate group-hover:text-[#E8C786] transition-colors">
              {suspect.name}
            </h3>
            <p className="text-xs text-[#9BB1CB] font-medium mt-0.5 truncate">
              {isKk ? suspect.profession.kk : suspect.profession.en}
            </p>

            {/* Capability Snippet */}
            {suspect.professionCapability && (
              <div className="mt-2 text-[11px] bg-[#0B1220]/80 border border-[#23354E]/50 rounded-lg p-1.5 flex items-start gap-1.5 text-[#C4D5EC]">
                <Sparkles className="w-3.5 h-3.5 text-[#D6AE67] shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">
                  <strong className="text-white">
                    {isKk
                      ? suspect.professionCapability.title.kk
                      : suspect.professionCapability.title.en}
                    :
                  </strong>{' '}
                  {isKk
                    ? suspect.professionCapability.description.kk
                    : suspect.professionCapability.description.en}
                </span>
              </div>
            )}
          </div>

          {/* Stress & Trust Bars */}
          <div className="space-y-1.5 mt-3 pt-2 border-t border-[#23354E]/40 text-[11px]">
            <div className="flex items-center justify-between text-[#8A9EB5]">
              <span>{isKk ? 'Сенім:' : 'Trust:'}</span>
              <span className="font-mono text-white font-medium">{suspect.trustScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#090E18] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${suspect.trustScore}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[#8A9EB5]">
              <span>{isKk ? 'Күйзеліс:' : 'Stress:'}</span>
              <span className="font-mono text-white font-medium">{suspect.stressLevel}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#090E18] rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${suspect.stressLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-1 flex gap-2">
        <button
          onClick={() => onInterrogate(suspect.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#D6AE67] to-[#B38C48] hover:from-[#E8C786] hover:to-[#C79C56] text-[#0B1020] font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {isKk ? 'Тергеу' : 'Interrogate'}
          {suspect.interrogatedCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#0B1020]/20 text-[10px]">
              {suspect.interrogatedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onOpenProfile(suspect)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1A283D] hover:bg-[#253956] text-[#D8E4F3] text-xs font-semibold border border-[#2B405D] transition-all cursor-pointer"
          title={isKk ? 'Толық досье' : 'Full Dossier'}
        >
          <Eye className="w-3.5 h-3.5 text-[#D6AE67]" />
          {isKk ? 'Досье' : 'Dossier'}
        </button>
      </div>
    </div>
  );
};
